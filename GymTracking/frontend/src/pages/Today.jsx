import { useState, useEffect } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import { calcSmartTargets } from '../utils/smartGoalCalc';

const WATER_GOAL_ML = 2000;
const TARGET_CALORIES_DEFAULT = 1796;
const TARGET_BURN_DEFAULT = 500;
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Reusable SVG Activity Ring Component
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
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontSize: radius > 20 ? '1.2rem' : '1rem' }}>
        <i className={iconClass} />
      </div>
    </div>
  );
}

function Today() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState(Array(7).fill(0));
  const [summary, setSummary] = useState({
    waterMl: 0,
    caloriesConsumed: 0,
    caloriesBurned: 0,
    glucoseConsumed: 0,
    sleepMinutes: null,
    exercisedToday: false,
  });

  useEffect(() => {
    Promise.all([
      dailySummaryService.getToday(),
      dailySummaryService.getHistory()
    ]).then(([todayRes, historyRes]) => {
      setSummary({
        waterMl: todayRes.data.waterMl ?? 0,
        caloriesConsumed: todayRes.data.caloriesConsumed ?? 0,
        caloriesBurned: todayRes.data.caloriesBurned ?? 0,
        glucoseConsumed: todayRes.data.glucoseConsumed ?? 0,
        sleepMinutes: todayRes.data.sleepMinutes,
        exercisedToday: todayRes.data.exercisedToday ?? false,
      });

      // Xây dựng mảng Activity cho 7 ngày của tuần (Sun -> Sat)
      const dataArr = Array(7).fill(0);
      const historyItems = historyRes.data?.data || [];
      const today = new Date();
      historyItems.forEach(day => {
        const d = new Date(day.date);
        const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          dataArr[d.getDay()] = Math.max(dataArr[d.getDay()], day.caloriesBurned || 0);
        }
      });
      // Ghi đè ngày hiện tại từ Today API để khớp tiến độ mới nhất
      dataArr[today.getDay()] = Math.max(dataArr[today.getDay()], todayRes.data.caloriesBurned || 0);
      setWeekData(dataArr);

    }).catch(() => {
      toast.error('Không tải được dữ liệu hôm nay');
      setSummary((s) => ({ ...s, waterMl: 0, caloriesConsumed: 0 }));
    }).finally(() => setLoading(false));
  }, []);

  const smartTargets = calcSmartTargets(user);
  const baseTargetCalories = smartTargets?.targetIntake ?? (user?.autoStats?.tdee ?? TARGET_CALORIES_DEFAULT);
  const baseTargetBurn = smartTargets?.targetBurn ?? TARGET_BURN_DEFAULT;
  const consumed = summary.caloriesConsumed || 0;
  const remainingCalories = baseTargetCalories - consumed;

  // Xử lý phạt (Penalty): Nếu lố ăn uống, cộng dồn phần dư vào chỉ tiêu đốt cháy
  const excessCals = remainingCalories < 0 ? Math.abs(remainingCalories) : 0;
  const targetBurn = baseTargetBurn + excessCals;

  // Tính toán tiến trình vòng lặp (Progress Pct)
  const foodPct = Math.round((consumed / baseTargetCalories) * 100);
  const waterPct = Math.round(((summary.waterMl || 0) / WATER_GOAL_ML) * 100);
  const burnPct = Math.round(((summary.caloriesBurned || 0) / targetBurn) * 100);

  // Chuẩn lâm sàng nạp đường theo Hiệp hội Tim mạch Hoa Kỳ (AHA) / WHO
  const targetGlucose = user?.gender === 'male' ? 36 : 25; 
  const consumedGlucose = summary.glucoseConsumed || 0;
  const glucosePct = Math.round((consumedGlucose / targetGlucose) * 100);

  const addWater = () => {
    const newVal = (summary.waterMl || 0) + 250;
    dailySummaryService.updateToday({ waterMl: newVal })
      .then((res) => {
        setSummary((s) => ({ ...s, waterMl: res.data.waterMl }));
        toast.success('Đã thêm 250 ml nước');
      })
      .catch(() => toast.error('Không cập nhật được'));
  };

  const todayDayIndex = new Date().getDay();

  if (loading) {
    return <div className="today-sections"><p className="text-muted">Đang tải...</p></div>;
  }

  return (
    <div className="today-sections">
      <section className="today-section">
        <h2 className="today-section-title">Sleep</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Sleep duration</p>
              <p className="fitbit-card-value">{summary.sleepMinutes != null ? `${Math.floor(summary.sleepMinutes / 60)}h ${summary.sleepMinutes % 60}m` : 'Chưa có dữ liệu'}</p>
              <p className="fitbit-card-sub">{summary.sleepMinutes != null ? 'Hôm nay' : 'Thêm từ nút + bên dưới'}</p>
            </div>
            <div className="fitbit-card-icon purple"><i className="bi bi-moon-stars" /></div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Nutrition</h2>
        <div className="today-cards today-cards--2col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Food</p>
              <p className="fitbit-card-value">{consumed} / {baseTargetCalories} cal</p>
              <p className="fitbit-card-sub" style={{ color: remainingCalories >= 0 ? 'var(--fitbit-muted)' : '#ef4444' }}>
                {remainingCalories >= 0 ? `Còn hạn mức ${remainingCalories} kcal` : `Đã lố ${excessCals} kcal! Phải tập bù`}
              </p>
            </div>
            <ProgressRing progress={foodPct} color={remainingCalories >= 0 ? "#eab308" : "#ef4444"} iconClass="bi bi-apple" />
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Water</p>
              <p className="fitbit-card-value">{summary.waterMl ?? 0} ml</p>
              <p className="fitbit-card-sub">Today</p>
            </div>
            <button type="button" style={{ background: 'transparent', border: 'none', padding: 0 }} onClick={addWater} title="Thêm nước">
              <ProgressRing progress={waterPct} color="#3b82f6" iconClass="bi bi-droplet-half" />
            </button>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Activity</h2>
        <div className="today-cards today-cards--2col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Exercise days</p>
              <p className="fitbit-card-value">{weekData.filter(v => v > 0).length} of 7</p>
              <p className="fitbit-card-sub">This week (Cals burned)</p>
            </div>
            <div className="exercise-week-wrap">
              <div className="exercise-bars" style={{ display: 'flex', alignItems: 'flex-end', height: '40px', gap: '4px' }}>
                {WEEK_DAYS.map((d, i) => {
                  const val = weekData[i];
                  const maxVal = Math.max(...weekData, 1); // fix div by 0
                  const isZero = val === 0;
                  const heightPct = isZero ? 15 : Math.max(15, Math.min(100, Math.round((val / maxVal) * 100)));
                  // Tính opacity: từ 0.3 lên tối đa 1.0 tùy theo mức độ hoạt động. 
                  const opacity = isZero ? 0.1 : Math.max(0.4, val / maxVal);
                  
                  return (
                    <div key={d + i} style={{ 
                      flex: 1, 
                      borderRadius: '4px',
                      height: `${heightPct}%`, 
                      background: isZero ? 'rgba(255,255,255,0.05)' : `rgba(0, 176, 185, ${opacity})`,
                      transition: 'all 0.4s ease'
                    }} />
                  );
                })}
              </div>
              <div className="exercise-days-labels">
                {WEEK_DAYS.map((d, i) => (
                  <span key={`lbl-${d}-${i}`}>{d}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Energy burned</p>
              <p className="fitbit-card-value">{(summary.caloriesBurned ?? 0).toLocaleString()} / {targetBurn} cal</p>
              <p className="fitbit-card-sub" style={{ color: (summary.caloriesBurned || 0) >= targetBurn ? '#10b981' : '#f87171' }}>
                {(summary.caloriesBurned || 0) >= targetBurn 
                  ? 'Đã đạt chỉ tiêu!' 
                  : (excessCals > 0 
                      ? `Phạt: Cần đốt thêm ${targetBurn - (summary.caloriesBurned || 0)} kcal do lố ăn uống` 
                      : `Bạn cần đốt thêm ${targetBurn - (summary.caloriesBurned || 0)} kcal`)}
              </p>
            </div>
            <ProgressRing progress={burnPct} color="#f43f5e" iconClass="bi bi-fire" />
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Health</h2>
        <div className="today-cards today-cards--3col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Weight</p>
              <p className="fitbit-card-value">{user?.measurements?.weight ?? '—'} kg</p>
              <p className="fitbit-card-sub" style={{ color: 'var(--fitbit-teal)' }}>
                {user?.goals?.targetWeight && user?.measurements?.weight 
                  ? `Còn ${Math.abs(user.measurements.weight - user.goals.targetWeight).toFixed(1)} kg tới mục tiêu!` 
                  : 'Chưa cập nhật từ hồ sơ'}
              </p>
            </div>
            <div className="fitbit-card-icon teal"><i className="bi bi-speedometer2" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Glucose (Đường)</p>
              <p className="fitbit-card-value">{consumedGlucose} / {targetGlucose} g</p>
              <p className="fitbit-card-sub" style={{ color: consumedGlucose > targetGlucose ? '#ef4444' : 'var(--fitbit-muted)' }}>
                {consumedGlucose > targetGlucose ? `Bạn đã nạp lố đường mốc an toàn` : `Hôm nay`}
              </p>
            </div>
            <ProgressRing progress={glucosePct} color={consumedGlucose > targetGlucose ? "#ef4444" : "#f43f5e"} iconClass="bi bi-droplet-half" />
          </div>
          <div className="fitbit-card get-started">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Mindful days</p>
              <p className="fitbit-card-value">Get started</p>
              <p className="fitbit-card-sub">Tap to set up</p>
            </div>
            <div className="fitbit-card-icon purple"><i className="bi bi-brain" /></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Today;
