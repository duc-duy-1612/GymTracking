import React, { Component, useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useUser } from '../context/UserContext';
import dailySummaryService from '../services/dailySummaryService';
import workoutService from '../services/workoutService';
import nutritionService from '../services/nutritionService';
import Model from 'react-body-highlighter';

const CHART_COLORS = {
  teal: '#00B0B9',
  tealLight: 'rgba(0, 176, 185, 0.25)',
  muted: '#9ca3af',
  doughnut: ['#00B0B9', '#6b7280', '#4b5563', '#374151'],
};

const MUSCLE_MAPPING = {
  'Ngực': ['chest'],
  'Lưng': ['upper-back', 'lower-back', 'trapezius', 'back-deltoids'],
  'Vai': ['front-deltoids', 'trapezius'],
  'Chân': ['quadriceps', 'hamstring', 'calves', 'gluteal', 'adductor', 'abductors'],
  'Tay': ['biceps', 'triceps', 'forearm'],
  'Bụng': ['abs', 'obliques'],
  'Toàn thân': ['chest', 'upper-back', 'front-deltoids', 'quadriceps', 'abs', 'biceps', 'triceps'],
  'Tim mạch': ['calves', 'quadriceps']
};

class MuscleMapErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, errorMsg: "" }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorMsg: error.message }; }
  render() { 
    if (this.state.hasError) return <div style={{color:'#fca5a5', padding:'20px'}}>Lỗi Heatmap: {this.state.errorMsg}</div>; 
    return this.props.children; 
  }
}

function calcBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  return (weightKg / ((heightCm / 100) ** 2)).toFixed(1);
}

const BODY_COMP_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function Stats() {
  const { user, loading: userLoading } = useUser();
  const [todaySummary, setTodaySummary] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [calHistory, setCalHistory] = useState([]);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [muscleMapView, setMuscleMapView] = useState('anterior');
  const [chartPeriod, setChartPeriod] = useState('week');
  const bodyCompRef = useRef(null);
  const workoutChartRef = useRef(null);
  const proportionsRef = useRef(null);

  useEffect(() => {
    Promise.all([
      dailySummaryService.getToday(),
      workoutService.getHistory(),
      dailySummaryService.getHistory({ days: 7 }),
      nutritionService.getHistory()
    ]).then(([todayRes, workoutRes, historyRes, nutRes]) => {
      setTodaySummary(todayRes.data);
      setWorkoutHistory(workoutRes.data?.data || []);
      setCalHistory(historyRes.data?.reverse() || []);
      setNutritionHistory(nutRes.data?.data || []);
    }).catch(err => console.error('Lỗi lấy thống kê', err));
  }, []);

  const weight = user?.measurements?.weight;
  const height = user?.measurements?.height;
  const waist = user?.measurements?.waist;
  const targetWeight = user?.goals?.targetWeight;
  const bmi = user?.autoStats?.bmi ?? (weight && height ? calcBmi(weight, height) : null);
  const targetBmi = user?.autoStats?.targetBmi ?? (targetWeight != null && height ? calcBmi(targetWeight, height) : null);
  
  // Xử lý labels và dữ liệu cho biểu đồ 7 ngày từ Nutrition (nếu có) thay vì DailySummary cache
  let chartLabels = BODY_COMP_LABELS;
  let chartData = [0, 0, 0, 0, 0, 0, 0];
  
  // Tính tổng vĩ mô Protein, Carbs, Fat cho doughnut chart
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (calHistory.length > 0) {
    chartLabels = [];
    chartData = [];
    
    // Group nutrition by date string YYYY-MM-DD
    const nutritionByDate = {};
    nutritionHistory.forEach(n => {
      const d = new Date(n.date).toISOString().split('T')[0];
      if (!nutritionByDate[d]) nutritionByDate[d] = { cal: 0, p: 0, c: 0, f: 0 };
      nutritionByDate[d].cal += (n.macros?.calories || 0);
      nutritionByDate[d].p += (n.macros?.protein || 0);
      nutritionByDate[d].c += (n.macros?.carbs || 0);
      nutritionByDate[d].f += (n.macros?.fat || 0);
      
      totalProtein += (n.macros?.protein || 0);
      totalCarbs += (n.macros?.carbs || 0);
      totalFat += (n.macros?.fat || 0);
    });

    calHistory.forEach(c => {
      const dString = new Date(c.date).toISOString().split('T')[0];
      chartLabels.push(new Date(c.date).toLocaleDateString('vi-VN', { weekday: 'short' }));
      chartData.push(nutritionByDate[dString]?.cal || 0);
    });
  }

  // Fallback safe value for doughnut chart
  if (totalProtein === 0 && totalCarbs === 0 && totalFat === 0) {
    totalProtein = 1; totalCarbs = 1; totalFat = 1; // avoid division by 0 visual bugs
  }
  
  const macroProportions = [
    { label: 'Protein (Đạm)', value: totalProtein, color: '#f43f5e' }, // fitbit-rose
    { label: 'Carbs (Tinh bột)', value: totalCarbs, color: '#eab308' }, // yellow
    { label: 'Fat (Chất béo)', value: totalFat, color: '#00B0B9' }, // fitbit-teal
  ];

  const workoutWeek = [0, 0, 0, 0, 0, 0, 0];
  workoutHistory.forEach(w => {
    const d = new Date(w.date);
    const now = new Date();
    if ((now - d) / (1000 * 60 * 60 * 24) <= 7) {
      workoutWeek[d.getDay()] += (w.totalDurationMinutes || 0);
    }
  });

  const userStatsRows = [
    { icon: 'bi-person', label: 'Tên', value: user?.name ?? '—' },
    { icon: 'bi-person-badge', label: 'BMI', value: bmi ?? '—' },
    { icon: 'bi-rulers', label: 'Chiều cao', value: height != null ? `${height} cm` : '—' },
    { icon: 'bi-speedometer2', label: 'Cân nặng', value: weight != null ? `${weight} kg` : '—' },
    { icon: 'bi-bullseye', label: 'Mục tiêu cân nặng', value: targetWeight != null ? `${targetWeight} kg` : '—' },
    { icon: 'bi-heart-half', label: 'Mục tiêu BMI', value: targetBmi ?? '—' },
  ];

  useEffect(() => {
    if (!bodyCompRef.current) return;
    const ctx = bodyCompRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Lượng Calo (kcal)',
          data: chartData,
          borderColor: CHART_COLORS.teal,
          backgroundColor: CHART_COLORS.tealLight,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: CHART_COLORS.teal,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(37, 38, 42, 0.95)',
            titleColor: '#fff',
            bodyColor: CHART_COLORS.teal,
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: CHART_COLORS.muted, font: { size: 11 } },
          },
          y: {
            min: 0,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: CHART_COLORS.muted, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [chartPeriod, chartData]);

  useEffect(() => {
    if (!workoutChartRef.current) return;
    const ctx = workoutChartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        datasets: [{
          data: workoutWeek,
          backgroundColor: workoutWeek.map((v) => (v ? CHART_COLORS.teal : 'rgba(255,255,255,0.08)')),
          borderRadius: 6,
          barPercentage: 0.65,
          categoryPercentage: 0.8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(37, 38, 42, 0.95)',
            callbacks: { label: (ctx) => (`${ctx.raw} phút`) },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: CHART_COLORS.muted, font: { size: 11 } },
          },
          y: { display: false, min: 0, max: Math.max(...workoutWeek, 60) },
        },
      },
    });
    return () => chart.destroy();
  }, [workoutHistory]);

  useEffect(() => {
    if (!proportionsRef.current) return;
    const ctx = proportionsRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: macroProportions.map((p) => p.label),
        datasets: [{
          data: macroProportions.map((p) => p.value),
          backgroundColor: macroProportions.map((p) => p.color),
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: CHART_COLORS.muted, font: { size: 11 }, padding: 12, usePointStyle: true },
          },
          tooltip: {
            backgroundColor: 'rgba(37, 38, 42, 0.95)',
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}g` },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [nutritionHistory]);

  const muscleIntensity = {};
  workoutHistory.forEach(w => {
    w.exercises?.forEach(ex => {
      const mg = ex.muscleGroup;
      if (mg) {
        if (!muscleIntensity[mg]) muscleIntensity[mg] = 0;
        muscleIntensity[mg] += (ex.completedSets?.length || ex.sets || 1);
      }
    });
    if ((!w.exercises || w.exercises.length === 0) && w.muscleGroup) {
      if (!muscleIntensity[w.muscleGroup]) muscleIntensity[w.muscleGroup] = 0;
      muscleIntensity[w.muscleGroup] += 4;
    }
  });

  const bodyHighlighterData = Object.keys(muscleIntensity)
    .filter(mg => MUSCLE_MAPPING[mg] && MUSCLE_MAPPING[mg].length > 0)
    .map(mg => {
      return {
        name: mg,
        muscles: MUSCLE_MAPPING[mg],
        frequency: Math.max(1, Math.min(Math.ceil(muscleIntensity[mg] / 3), 4)) // scale down raw sets strictly to 1-4 heat index max
      };
    });

  let maxIntensity = 0;
  let focusGroupLabel = 'Chưa có dữ liệu';
  Object.entries(muscleIntensity).forEach(([mg, freq]) => {
    if (freq > maxIntensity) {
      maxIntensity = freq;
      focusGroupLabel = mg;
    }
  });

  if (userLoading && !user) {
    return (
      <div className="stats-page">
        <h1 className="stats-page-title">Thống kê tiến độ</h1>
        <div className="stats-row stats-row--top">
          <div className="stats-user-card fitbit-card stats-user-card--skeleton">
            <div className="stats-user-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="stats-user-item">
                  <div className="skeleton-block" style={{ width: 32, height: 32, borderRadius: 8 }} />
                  <div className="skeleton-block" style={{ width: 60, height: 14 }} />
                  <div className="skeleton-block" style={{ width: 48, height: 18 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="stats-muscle-card fitbit-card">
            <div className="skeleton-block" style={{ height: 200, borderRadius: 14 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <h1 className="stats-page-title">Thống kê tiến độ</h1>

      <div className="stats-row stats-row--top">
        <div className="stats-user-card fitbit-card">
          <div className="stats-user-grid">
            {userStatsRows.map((item, i) => (
              <div key={i} className="stats-user-item">
                <div className="stats-user-icon"><i className={`bi ${item.icon}`} /></div>
                <span className="stats-user-label">{item.label}</span>
                <span className="stats-user-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-muscle-card fitbit-card">
          <div className="stats-muscle-header">
            <h2 className="stats-muscle-title">Muscle Map</h2>
            <div className="stats-muscle-toggle" role="group" aria-label="Góc nhìn">
              <button
                type="button"
                className={`stats-toggle-btn ${muscleMapView === 'anterior' ? 'stats-toggle-btn--active' : ''}`}
                onClick={() => setMuscleMapView('anterior')}
              >
                Mặt trước
              </button>
              <button
                type="button"
                className={`stats-toggle-btn ${muscleMapView === 'posterior' ? 'stats-toggle-btn--active' : ''}`}
                onClick={() => setMuscleMapView('posterior')}
              >
                Mặt sau
              </button>
            </div>
          </div>
          <div className="stats-muscle-image-wrap" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <MuscleMapErrorBoundary>
              {(() => {
                // Xử lý an toàn cho Vite ESM vs CJS interop
                const SafeModel = Model.default || Model;
                if (!SafeModel || (typeof SafeModel !== 'function' && typeof SafeModel !== 'object')) {
                  return <p style={{ color: 'var(--fitbit-muted)' }}>Đang tải mô hình 3D...</p>;
                }
                return (
                  <SafeModel
                    data={bodyHighlighterData}
                    style={{ width: '40%', minWidth: '150px' }}
                    type={muscleMapView}
                    highlightedColors={['#374151', '#f87171', '#ef4444', '#dc2626', '#991b1b']}
                  />
                );
              })()}
            </MuscleMapErrorBoundary>
          </div>
          <div className="stats-muscle-focus">
            <i className="bi bi-bullseye me-1" />
            <span>Nhóm cơ trọng tâm: {focusGroupLabel}</span>
          </div>
        </div>
      </div>

      <div className="stats-row stats-row--body-comp">
        <div className="stats-chart-card fitbit-card">
          <div className="stats-chart-header">
            <h2 className="stats-chart-title">Lượng Calo Tiêu Thụ</h2>
            <div className="stats-period-tabs">
              <button type="button" className={`stats-period-btn ${chartPeriod === 'week' ? 'stats-period-btn--active' : ''}`} onClick={() => setChartPeriod('week')}>Tuần</button>
            </div>
          </div>
          <p className="stats-chart-sub">Calo nạp vào (kcal) trong 7 ngày qua</p>
          <div className="stats-chart-container stats-chart-container--line">
            <canvas ref={bodyCompRef} />
          </div>
        </div>
      </div>

      <div className="stats-row stats-row--charts">
        <div className="stats-chart-card fitbit-card">
          <div className="stats-chart-header">
            <h2 className="stats-chart-title">Thời Gian Tập Luyện</h2>
          </div>
          <p className="stats-chart-sub">Số phút tập trong tuần</p>
          <div className="stats-chart-container stats-chart-container--bar">
            <canvas ref={workoutChartRef} />
          </div>
        </div>
        <div className="stats-chart-card fitbit-card stats-chart-card--proportions">
          <div className="stats-chart-header">
            <h2 className="stats-chart-title">Tỷ lệ Dinh dưỡng (Macros)</h2>
          </div>
          <p className="stats-chart-sub">Protein, Carbs, Fat tiêu thụ (gram)</p>
          <div className="stats-chart-container stats-chart-container--doughnut">
            <canvas ref={proportionsRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
