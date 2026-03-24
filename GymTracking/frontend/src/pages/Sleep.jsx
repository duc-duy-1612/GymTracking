import { useEffect, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import toast from 'react-hot-toast';

function Sleep() {
  const [loading, setLoading] = useState(true);
  const [sleepMinutes, setSleepMinutes] = useState(null);
  const [form, setForm] = useState({ hours: '', minutes: '' });
  const [saving, setSaving] = useState(false);
  const [times, setTimes] = useState({ start: '', end: '' });

  useEffect(() => {
    dailySummaryService.getToday()
      .then((res) => {
        const minutes = res.data.sleepMinutes;
        setSleepMinutes(minutes ?? null);
        if (minutes != null) {
          setForm({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
        }
      })
      .catch(() => toast.error('Không tải được dữ liệu giấc ngủ hôm nay'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value === '' ? '' : Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let total = Number(form.hours || 0) * 60 + Number(form.minutes || 0);
    if (!total && times.start && times.end) {
      const [sh, sm] = times.start.split(':').map(Number);
      const [eh, em] = times.end.split(':').map(Number);
      if (!Number.isNaN(sh) && !Number.isNaN(eh)) {
        let startMinutes = sh * 60 + (sm || 0);
        let endMinutes = eh * 60 + (em || 0);
        if (endMinutes <= startMinutes) endMinutes += 24 * 60;
        total = endMinutes - startMinutes;
      }
    }
    if (!total || total <= 0) {
      toast.error('Vui lòng nhập thời lượng giấc ngủ hợp lệ');
      return;
    }
    setSaving(true);
    const payload = { sleepMinutes: total };
    if (times.start) payload.sleepStart = new Date().toISOString();
    if (times.end) payload.sleepEnd = new Date().toISOString();
    dailySummaryService.updateToday(payload)
      .then((res) => {
        const minutes = res.data.sleepMinutes ?? total;
        setSleepMinutes(minutes);
        toast.success('Đã cập nhật giấc ngủ hôm nay');
      })
      .catch(() => toast.error('Không cập nhật được giấc ngủ'))
      .finally(() => setSaving(false));
  };

  const renderCurrent = () => {
    if (sleepMinutes == null) return 'Chưa có dữ liệu';
    const h = Math.floor(sleepMinutes / 60);
    const m = sleepMinutes % 60;
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="sleep-page">
        <h1 className="page-full-title">Giấc ngủ</h1>
        <div className="today-sections">
          <section className="today-section">
            <h2 className="today-section-title">Đang tải...</h2>
            <div className="today-cards today-cards--1col">
              <div className="fitbit-card card-dark">
                <div className="skeleton-block" style={{ height: 28, width: '40%', marginBottom: 10 }} />
                <div className="skeleton-block" style={{ height: 40, width: '60%' }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="sleep-page">
      <h1 className="page-full-title">Giấc ngủ</h1>
    <div className="today-sections">
      <section className="today-section">
        <h2 className="today-section-title">Giấc ngủ hôm nay</h2>
        <div className="today-cards today-cards--2col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Thời lượng ngủ</p>
              <p className="fitbit-card-value">{renderCurrent()}</p>
              <p className="fitbit-card-sub">Được dùng trong thẻ Today</p>
            </div>
            <div className="fitbit-card-icon purple"><i className="bi bi-moon-stars" /></div>
          </div>
          <div className="fitbit-card get-started">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Gợi ý</p>
              <p className="fitbit-card-value">7–9 giờ</p>
              <p className="fitbit-card-sub">Theo khuyến nghị cho người trưởng thành</p>
            </div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Cập nhật giấc ngủ</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card">
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Giờ ngủ (giờ)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="24"
                      value={form.hours}
                      onChange={(e) => handleChange('hours', e.target.value)}
                    />
                  </div>
                </div>
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Phút</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="59"
                      value={form.minutes}
                      onChange={(e) => handleChange('minutes', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Giờ bắt đầu (tuỳ chọn)</label>
                    <input
                      type="time"
                      className="form-control"
                      value={times.start}
                      onChange={(e) => setTimes((prev) => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Giờ kết thúc (tuỳ chọn)</label>
                    <input
                      type="time"
                      className="form-control"
                      value={times.end}
                      onChange={(e) => setTimes((prev) => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="btn btn-fitbit profile-save-btn" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu giấc ngủ hôm nay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}

export default Sleep;