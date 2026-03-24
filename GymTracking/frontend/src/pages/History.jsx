import { useEffect, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import workoutService from '../services/workoutService';
import nutritionService from '../services/nutritionService';
import { useUser } from '../context/UserContext';
import { calcSmartTargets } from '../utils/smartGoalCalc';
import toast from 'react-hot-toast';

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WATER_GOAL_ML = 2000;
const TARGET_BURN_DEFAULT = 500;

function formatDateKey(d) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x.getTime();
}

function getDayIndex(date) {
  return new Date(date).getDay();
}

// ProgressRing — same component as Today.jsx
function ProgressRing({ radius = 24, stroke = 4, progress = 0, color = '#00B0B9', iconClass }) {
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle stroke="rgba(255,255,255,0.1)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: radius > 20 ? '1.2rem' : '1rem' }}>
        <i className={iconClass} />
      </div>
    </div>
  );
}

const thStyle = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' };
const tdStyle = { padding: '10px 14px', whiteSpace: 'nowrap' };

function History() {
  const { user } = useUser();
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [workoutRecords, setWorkoutRecords] = useState([]);
  const [nutritionRecords, setNutritionRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logFilter, setLogFilter] = useState('all'); // 'all' | 'workout' | 'nutrition'

  useEffect(() => {
    Promise.all([
      dailySummaryService.getToday().then((r) => r.data),
      dailySummaryService.getHistory({ days: 7 }).then((r) => r.data),
      workoutService.getHistory().then((r) => r.data?.data || []),
      nutritionService.getHistory().then((r) => r.data?.data || [])
    ])
      .then(([todayData, historyData, workoutData, nutritionData]) => {
        setToday(todayData);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setWorkoutRecords(workoutData);
        setNutritionRecords(nutritionData);
      })
      .catch(() => {
        toast.error('Không tải được dữ liệu lịch sử');
        setToday(null);
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Build lookup maps
  const historyByDate = {};
  history.forEach((s) => { historyByDate[formatDateKey(s.date)] = s; });

  const workoutByDate = {};
  workoutRecords.forEach((w) => {
    const key = formatDateKey(w.date);
    if (!workoutByDate[key]) workoutByDate[key] = { mins: 0, burned: 0 };
    workoutByDate[key].mins += (w.totalDurationMinutes || 0);
    workoutByDate[key].burned += (w.caloriesBurned || 0);
  });

  const nutritionByDate = {};
  nutritionRecords.forEach((n) => {
    const key = formatDateKey(n.date);
    if (!nutritionByDate[key]) nutritionByDate[key] = { calories: 0, glucose: 0 };
    nutritionByDate[key].calories += (n.macros?.calories || 0);
    nutritionByDate[key].glucose += (n.macros?.glucose || 0);
  });

  const todayKey = formatDateKey(new Date());
  const todayData = today ?? historyByDate[todayKey];

  // Today overview values
  const todayCalories = nutritionByDate[todayKey]?.calories || 0;
  const todayWater = todayData?.waterMl ?? 0;
  const todayExercise = todayData?.exercisedToday ?? false;
  const todayWorkoutMins = workoutByDate[todayKey]?.mins || 0;
  const todayBurned = todayData?.caloriesBurned ?? workoutByDate[todayKey]?.burned ?? 0;

  // Progress ring targets
  const smartTargets = calcSmartTargets(user);
  const baseTargetCalories = smartTargets?.targetIntake ?? (user?.autoStats?.tdee ?? 1796);
  const baseTargetBurn = smartTargets?.targetBurn ?? TARGET_BURN_DEFAULT;
  const excessCals = (baseTargetCalories - todayCalories) < 0 ? Math.abs(baseTargetCalories - todayCalories) : 0;
  const targetBurn = baseTargetBurn + excessCals;

  const foodPct  = Math.round((todayCalories / baseTargetCalories) * 100);
  const waterPct = Math.round((todayWater / WATER_GOAL_ML) * 100);
  const burnPct  = Math.round((todayBurned / targetBurn) * 100);

  // Build last 7 days array
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    d.setUTCHours(0, 0, 0, 0);
    const key = d.getTime();
    last7Days.push({ date: d, key, summary: historyByDate[key] });
  }
  last7Days.reverse();

  const hasActivity = (summary, dateKey) => {
    if ((nutritionByDate[dateKey]?.calories ?? 0) > 0) return true;
    if (!summary) return false;
    return (summary.waterMl ?? 0) > 0 || summary.exercisedToday || (summary.sleepMinutes != null && summary.sleepMinutes > 0);
  };

  const showNutrition = logFilter === 'all' || logFilter === 'nutrition';
  const showWorkout   = logFilter === 'all' || logFilter === 'workout';

  if (loading) {
    return (
      <div className="history-page">
        <h1 className="page-full-title">Lịch sử</h1>
        <div className="today-sections">
          <section className="today-section">
            <h2 className="today-section-title">Đang tải...</h2>
            <div className="today-cards today-cards--1col">
              <div className="fitbit-card card-dark">
                <div className="skeleton-block" style={{ height: 32, width: '40%', marginBottom: 16 }} />
                <div className="skeleton-block" style={{ height: 80, width: '100%' }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h1 className="page-full-title">Lịch sử</h1>
      <div className="today-sections">

        {/* Overview cards with ProgressRings */}
        <section className="today-section">
          <h2 className="today-section-title">Tổng quan hôm nay</h2>
          <div className="today-cards today-cards--3col">

            <div className="fitbit-card">
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">Calories</p>
                <p className="fitbit-card-value">{todayCalories.toLocaleString()} cal</p>
                <p className="fitbit-card-sub" style={{ color: excessCals > 0 ? '#ef4444' : 'var(--fitbit-muted)' }}>
                  {excessCals > 0
                    ? `Lố ${excessCals} kcal`
                    : `Còn ${Math.max(baseTargetCalories - todayCalories, 0)} kcal`}
                </p>
              </div>
              <ProgressRing progress={foodPct} color={excessCals > 0 ? '#ef4444' : '#eab308'} iconClass="bi bi-apple" />
            </div>

            <div className="fitbit-card">
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">Nước</p>
                <p className="fitbit-card-value">{todayWater.toLocaleString()} ml</p>
                <p className="fitbit-card-sub">Mục tiêu: {WATER_GOAL_ML} ml</p>
              </div>
              <ProgressRing progress={waterPct} color="#3b82f6" iconClass="bi bi-droplet-half" />
            </div>

            <div className="fitbit-card">
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">Tập luyện</p>
                <p className="fitbit-card-value">{todayExercise ? `${todayWorkoutMins} phút` : 'Chưa tập'}</p>
                <p className="fitbit-card-sub" style={{ color: todayBurned >= targetBurn ? '#10b981' : '#f87171' }}>
                  {todayBurned >= targetBurn
                    ? 'Đạt chỉ tiêu!'
                    : `Đốt: ${todayBurned} / ${targetBurn} kcal`}
                </p>
              </div>
              <ProgressRing progress={burnPct} color="#f43f5e" iconClass="bi bi-fire" />
            </div>

          </div>
        </section>

        {/* Week dots */}
        <section className="today-section">
          <h2 className="today-section-title">Tuần này</h2>
          <div className="today-cards today-cards--1col">
            <div className="fitbit-card card-dark">
              <div className="history-week-grid">
                {last7Days.map(({ date, summary, key }) => {
                  const dayIdx = getDayIndex(date);
                  const isToday = date.getTime() === todayKey;
                  const active = hasActivity(summary, key);
                  return (
                    <div key={date.getTime()} className={`history-week-col ${isToday ? 'history-week-col--today' : ''}`}>
                      <span className="history-week-day">{WEEKDAY_LABELS[dayIdx]}</span>
                      <span className={`history-week-dot ${active ? 'history-week-dot--filled' : ''}`} />
                    </div>
                  );
                })}
              </div>
              <p className="form-hint" style={{ marginTop: 10, marginBottom: 0 }}>
                Cột highlight là hôm nay. Chấm sáng = có dữ liệu (calo, nước, tập hoặc ngủ) từ API lịch sử.
              </p>
            </div>
          </div>
        </section>

        {/* 7-day table journal */}
        <section className="today-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="today-section-title" style={{ margin: 0 }}>Nhật ký 7 ngày gần đây</h2>
            <div className="coach-filters" style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'all',       label: 'Tất cả' },
                { key: 'workout',   label: 'Tập luyện' },
                { key: 'nutrition', label: 'Ăn uống' },
              ].map(f => (
                <button
                  key={f.key}
                  className={`coach-pill ${logFilter === f.key ? 'coach-pill--active' : ''}`}
                  onClick={() => setLogFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="today-cards today-cards--1col">
            <div className="fitbit-card card-dark" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: 'var(--fitbit-teal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={thStyle}>Ngày</th>
                    {showNutrition && <th style={thStyle}>🍎 Calo nạp</th>}
                    {showNutrition && <th style={thStyle}>💧 Nước</th>}
                    {showWorkout   && <th style={thStyle}>🔥 Calo đốt</th>}
                    {showWorkout   && <th style={thStyle}>⏱ Thời gian tập</th>}
                    <th style={thStyle}>😴 Giấc ngủ</th>
                  </tr>
                </thead>
                <tbody>
                  {last7Days.map(({ date, summary, key }) => {
                    const isToday = date.getTime() === todayKey;
                    const label = isToday
                      ? 'Hôm nay'
                      : date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });

                    const cal      = nutritionByDate[key]?.calories ?? 0;
                    const water    = summary?.waterMl ?? 0;
                    const burned   = summary?.caloriesBurned ?? workoutByDate[key]?.burned ?? 0;
                    const wMins    = workoutByDate[key]?.mins ?? 0;
                    const sleep    = summary?.sleepMinutes;
                    const exercised = summary?.exercisedToday ?? wMins > 0;

                    const calColor   = cal > baseTargetCalories ? '#ef4444' : cal > 0 ? '#10b981' : 'var(--fitbit-muted)';
                    const waterColor = water >= WATER_GOAL_ML  ? '#10b981' : water > 0 ? '#3b82f6' : 'var(--fitbit-muted)';
                    const burnColor  = burned >= targetBurn     ? '#10b981' : burned > 0 ? '#f43f5e' : 'var(--fitbit-muted)';

                    return (
                      <tr
                        key={date.getTime()}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: isToday ? 'rgba(0,176,185,0.07)' : 'transparent',
                          fontWeight: isToday ? 600 : 400,
                        }}
                      >
                        <td style={{ ...tdStyle, color: isToday ? 'var(--fitbit-teal)' : '#fff' }}>{label}</td>
                        {showNutrition && (
                          <td style={{ ...tdStyle, color: calColor }}>
                            {cal > 0 ? `${cal.toLocaleString()} cal` : '—'}
                          </td>
                        )}
                        {showNutrition && (
                          <td style={{ ...tdStyle, color: waterColor }}>
                            {water > 0 ? `${water} ml` : '—'}
                          </td>
                        )}
                        {showWorkout && (
                          <td style={{ ...tdStyle, color: burnColor }}>
                            {burned > 0 ? `${burned} kcal` : '—'}
                          </td>
                        )}
                        {showWorkout && (
                          <td style={{ ...tdStyle, color: exercised ? '#f97316' : 'var(--fitbit-muted)' }}>
                            {wMins > 0 ? `${wMins} phút` : exercised ? 'Đã tập' : '—'}
                          </td>
                        )}
                        <td style={{ ...tdStyle, color: sleep != null && sleep > 0 ? '#a78bfa' : 'var(--fitbit-muted)' }}>
                          {sleep != null && sleep > 0
                            ? `${Math.floor(sleep / 60)}h${sleep % 60 ? ` ${sleep % 60}m` : ''}`
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default History;
