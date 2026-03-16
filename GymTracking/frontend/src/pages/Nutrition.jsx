import { useEffect, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const QUICK_MEALS = [
  { label: 'Bữa sáng nhẹ', calories: 350 },
  { label: 'Bữa trưa văn phòng', calories: 650 },
  { label: 'Snack trái cây', calories: 150 },
];

function Nutrition() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [adding, setAdding] = useState(false);
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '' });
   const [meals, setMeals] = useState([]);

  useEffect(() => {
    dailySummaryService.getToday()
      .then((res) => setCaloriesToday(res.data.caloriesConsumed ?? 0))
      .catch(() => toast.error('Không tải được dữ liệu dinh dưỡng hôm nay'))
      .finally(() => setLoading(false));
  }, []);

  const targetCalories = user?.autoStats?.tdee ?? 1796;
  const remaining = Math.max(targetCalories - caloriesToday, 0);

  const addCalories = (amount, label) => {
    const newTotal = caloriesToday + amount;
    setAdding(true);
    dailySummaryService.updateToday({ caloriesConsumed: newTotal })
      .then((res) => {
        setCaloriesToday(res.data.caloriesConsumed ?? newTotal);
        setMeals((prev) => [
          { id: Date.now(), label, calories: amount },
          ...prev,
        ]);
        toast.success(`Đã thêm ${amount} cal · ${label}`);
      })
      .catch(() => toast.error('Không cập nhật được calo'))
      .finally(() => setAdding(false));
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (!customMeal.calories) return;
    const amount = Number(customMeal.calories);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error('Calo phải là số dương');
      return;
    }
    addCalories(amount, customMeal.name || 'Bữa ăn tùy chỉnh');
    setCustomMeal({ name: '', calories: '' });
  };

  if (loading) {
    return (
      <div className="nutrition-page">
        <h1 className="page-full-title">Dinh dưỡng</h1>
        <div className="today-sections">
        <section className="today-section">
          <h2 className="today-section-title">Đang tải...</h2>
          <div className="today-cards today-cards--1col">
            <div className="fitbit-card card-dark">
              <div className="skeleton-block" style={{ height: 24, width: '40%', marginBottom: 12 }} />
              <div className="skeleton-block" style={{ height: 40, width: '60%', marginBottom: 8 }} />
              <div className="skeleton-block" style={{ height: 20, width: '50%' }} />
            </div>
          </div>
        </section>
        </div>
      </div>
    );
  }

  return (
    <div className="nutrition-page">
      <h1 className="page-full-title">Dinh dưỡng</h1>
    <div className="today-sections">
      <section className="today-section">
        <h2 className="today-section-title">Tổng quan hôm nay</h2>
        <div className="today-cards today-cards--2col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Calories đã ăn</p>
              <p className="fitbit-card-value">{caloriesToday.toLocaleString()} cal</p>
              <p className="fitbit-card-sub">Mục tiêu: {targetCalories.toLocaleString()} cal</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-egg-fried" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Còn lại</p>
              <p className="fitbit-card-value">{remaining.toLocaleString()} cal</p>
              <p className="fitbit-card-sub">Hôm nay</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-heart-pulse" /></div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Thêm nhanh bữa ăn</h2>
        <div className="today-cards today-cards--3col">
          {QUICK_MEALS.map((m) => (
            <button
              key={m.label}
              type="button"
              className="fitbit-card btn-quick-meal"
              disabled={adding}
              onClick={() => addCalories(m.calories, m.label)}
            >
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">{m.label}</p>
                <p className="fitbit-card-value">{m.calories} cal</p>
                <p className="fitbit-card-sub">Nhấn để cộng vào hôm nay</p>
              </div>
              <div className="fitbit-card-icon"><i className="bi bi-plus-lg" /></div>
            </button>
          ))}
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Bữa ăn tùy chỉnh</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card">
            <form className="profile-form" onSubmit={handleSubmitCustom}>
              <div className="profile-form-grid">
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Tên bữa ăn</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ví dụ: Cơm gà, Salad..."
                      value={customMeal.name}
                      onChange={(e) => setCustomMeal((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Calo (kcal)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={customMeal.calories}
                      onChange={(e) => setCustomMeal((prev) => ({ ...prev, calories: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="btn btn-fitbit profile-save-btn" disabled={adding}>
                  {adding ? 'Đang thêm...' : 'Thêm vào hôm nay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Bữa ăn đã ghi hôm nay (trong phiên)</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card card-dark">
            {meals.length === 0 ? (
              <p className="text-muted" style={{ margin: 0 }}>Chưa có bữa nào được thêm trong phiên này.</p>
            ) : (
              <div className="history-list">
                {meals.map((m) => (
                  <div key={m.id} className="history-list-row">
                    <div className="history-list-label">{m.label}</div>
                    <div className="history-list-values">
                      <span>{m.calories} cal</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}

export default Nutrition;

