import { useEffect, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import toast from 'react-hot-toast';

// Hiện backend mới có API /today, nên phần danh sách 7 ngày dùng dữ liệu mô phỏng
// nhưng thể hiện rõ ý tưởng lịch sử tiến độ.
const MOCK_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MOCK_HISTORY = [
  { label: 'Hôm nay', calories: null, water: null, exercised: null },
  { label: 'Hôm qua', calories: 1850, water: 1800, exercised: true },
  { label: '-2 ngày', calories: 2100, water: 1500, exercised: false },
  { label: '-3 ngày', calories: 1720, water: 2000, exercised: true },
];

function History() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dailySummaryService.getToday()
      .then((res) => setToday(res.data))
      .catch(() => toast.error('Không tải được dữ liệu hôm nay'))
      .finally(() => setLoading(false));
  }, []);

  const todayCalories = today?.caloriesConsumed ?? 0;
  const todayWater = today?.waterMl ?? 0;
  const todayExercise = today?.exercisedToday ?? false;

  if (loading) {
    return (
      <div className="today-sections">
        <section className="today-section">
          <h2 className="today-section-title">Lịch sử</h2>
          <div className="today-cards today-cards--1col">
            <div className="fitbit-card card-dark">
              <div className="skeleton-block" style={{ height: 32, width: '40%', marginBottom: 16 }} />
              <div className="skeleton-block" style={{ height: 80, width: '100%' }} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="today-sections">
      <section className="today-section">
        <h2 className="today-section-title">Tổng quan hôm nay</h2>
        <div className="today-cards today-cards--3col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Calories</p>
              <p className="fitbit-card-value">{(todayCalories ?? 0).toLocaleString()} cal</p>
              <p className="fitbit-card-sub">Từ thẻ Today / Nutrition</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-apple" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Nước</p>
              <p className="fitbit-card-value">{(todayWater ?? 0).toLocaleString()} ml</p>
              <p className="fitbit-card-sub">Từ thẻ Today / Water</p>
            </div>
            <div className="fitbit-card-icon blue"><i className="bi bi-droplet-half" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Tập luyện</p>
              <p className="fitbit-card-value">{todayExercise ? 'Đã tập' : 'Chưa tập'}</p>
              <p className="fitbit-card-sub">Dữ liệu demo từ DailySummary</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-activity" /></div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">7 ngày gần đây (demo)</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card card-dark">
            <div className="history-week-grid">
              {MOCK_DAYS.map((d) => (
                <div key={d} className="history-week-col">
                  <span className="history-week-day">{d}</span>
                  <span className="history-week-dot" />
                </div>
              ))}
            </div>
            <p className="fitbit-card-sub" style={{ marginTop: 8 }}>
              Các điểm tròn minh họa trạng thái hoạt động trong tuần. Có thể mở rộng để lấy dữ liệu thật từ backend.
            </p>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Nhật ký gần đây (demo)</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card card-dark history-list">
            {MOCK_HISTORY.map((item) => (
              <div key={item.label} className="history-list-row">
                <div className="history-list-label">{item.label}</div>
                <div className="history-list-values">
                  <span>Calories: {item.calories != null ? `${item.calories} cal` : `${todayCalories} cal (hôm nay)`}</span>
                  <span>Nước: {item.water != null ? `${item.water} ml` : `${todayWater} ml (hôm nay)`}</span>
                  <span>Tập luyện: {item.exercised != null ? (item.exercised ? 'Có' : 'Không') : (todayExercise ? 'Có' : 'Không')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default History;

