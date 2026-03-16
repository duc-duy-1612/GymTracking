import { useState, useEffect } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const WATER_GOAL_ML = 2000;
const TARGET_CALORIES_DEFAULT = 1796;
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function Today() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    waterMl: 0,
    caloriesConsumed: 0,
    caloriesBurned: 0,
    sleepMinutes: null,
    exercisedToday: false,
  });

  useEffect(() => {
    dailySummaryService.getToday()
      .then((res) => {
        setSummary({
          waterMl: res.data.waterMl ?? 0,
          caloriesConsumed: res.data.caloriesConsumed ?? 0,
          caloriesBurned: res.data.caloriesBurned ?? 0,
          sleepMinutes: res.data.sleepMinutes,
          exercisedToday: res.data.exercisedToday ?? false,
        });
      })
      .catch(() => {
        toast.error('Không tải được dữ liệu hôm nay');
        setSummary((s) => ({ ...s, waterMl: 0, caloriesConsumed: 0 }));
      })
      .finally(() => setLoading(false));
  }, []);

  const targetCalories = user?.autoStats?.tdee ?? TARGET_CALORIES_DEFAULT;
  const remainingCalories = targetCalories - (summary.caloriesConsumed || 0);

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
              <p className="fitbit-card-value">{summary.caloriesConsumed ?? 0} cal</p>
              <p className="fitbit-card-sub">Today · {remainingCalories > 0 ? remainingCalories : 0} remaining</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-apple" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Water</p>
              <p className="fitbit-card-value">{summary.waterMl ?? 0} ml</p>
              <p className="fitbit-card-sub">Today</p>
            </div>
            <button type="button" className="fitbit-card-icon blue" onClick={addWater} title="Thêm nước">
              <i className="bi bi-droplet-half" />
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
              <p className="fitbit-card-value">0 of 5</p>
              <p className="fitbit-card-sub">This week</p>
            </div>
            <div className="exercise-week-wrap">
              <div className="exercise-bars">
                {WEEK_DAYS.map((d, i) => (
                  <span key={d + i} className={i === todayDayIndex ? 'today-bar' : ''} />
                ))}
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
              <p className="fitbit-card-value">{(summary.caloriesBurned ?? 0).toLocaleString()} cal</p>
              <p className="fitbit-card-sub">Today</p>
            </div>
            <div className="energy-ring-wrap" style={{ '--energy-pct': 72 }}>
              <div className="energy-ring-inner"><i className="bi bi-fire" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Health</h2>
        <div className="today-cards today-cards--3col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Weight</p>
              <p className="fitbit-card-value">{user?.measurements?.weight != null ? `${user.measurements.weight} kg` : 'Chưa cập nhật'}</p>
              <p className="fitbit-card-sub">Từ hồ sơ</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-speedometer2" /></div>
          </div>
          <div className="fitbit-card get-started">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Glucose</p>
              <p className="fitbit-card-value">Get started</p>
              <p className="fitbit-card-sub">Tap to set up</p>
            </div>
            <div className="fitbit-card-icon blue"><i className="bi bi-droplet" /></div>
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
