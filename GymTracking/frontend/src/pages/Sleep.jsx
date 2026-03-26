import { useEffect, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';

function Sleep() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [sleepMinutes, setSleepMinutes] = useState(null);
  const [saving, setSaving] = useState(false);
  const [times, setTimes] = useState({ start: '', end: '' });
  const [historyData, setHistoryData] = useState([]);

  // Mục tiêu ngủ: Nữ = 8 giờ, Nam/Khác = 7 giờ
  const targetSleepMinutes = user?.gender === 'female' ? 8 * 60 : 7 * 60;
  const targetHours = targetSleepMinutes / 60;

  useEffect(() => {
    Promise.all([
      dailySummaryService.getToday(),
      dailySummaryService.getHistory()
    ]).then(([todayRes, historyRes]) => {
      const { sleepMinutes: min, sleepStart, sleepEnd } = todayRes.data;
      setSleepMinutes(min ?? null);
      
      const parsedTimes = { start: '', end: '' };
      if (sleepStart) {
        const d = new Date(sleepStart);
        parsedTimes.start = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }
      if (sleepEnd) {
        const d = new Date(sleepEnd);
        parsedTimes.end = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }
      setTimes(parsedTimes);
      
      setHistoryData(historyRes.data?.data || historyRes.data || []);
    }).catch(() => toast.error('Không tải được dữ liệu giấc ngủ hôm nay'))
      .finally(() => setLoading(false));
  }, []);

  // Tính số phút ngủ tự động từ Giờ bắt đầu và Giờ kết thúc
  const calculateSleep = () => {
    if (!times.start || !times.end) return 0;
    const [sh, sm] = times.start.split(':').map(Number);
    const [eh, em] = times.end.split(':').map(Number);
    if (!Number.isNaN(sh) && !Number.isNaN(eh)) {
      let startMins = sh * 60 + (sm || 0);
      let endMins = eh * 60 + (em || 0);
      if (endMins <= startMins) endMins += 24 * 60;
      return endMins - startMins;
    }
    return 0;
  };

  // Tính số phút hiển thị tạm thời trên UI khi form thay đổi
  const currentFormMinutes = calculateSleep();

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateSleep();
    
    if (!total || total <= 0) {
      toast.error('Vui lòng chọn Giờ bắt đầu và Giờ kết thúc hợp lệ!');
      return;
    }

    setSaving(true);
    const payload = { sleepMinutes: total };
    
    // Gán ngày giờ bắt đầu và kết thúc (Logic: nếu ngủ qua đêm thì Giờ bắt đầu nằm ở ngày hôm qua)
    const today = new Date();
    const startDate = new Date(today);
    const [sh, sm] = times.start.split(':').map(Number);
    startDate.setHours(sh, sm, 0, 0);

    const endDate = new Date(today);
    const [eh, em] = times.end.split(':').map(Number);
    endDate.setHours(eh, em, 0, 0);

    if (endDate <= startDate) {
      startDate.setDate(startDate.getDate() - 1);
    }
    payload.sleepStart = startDate.toISOString();
    payload.sleepEnd = endDate.toISOString();

    dailySummaryService.updateToday(payload)
      .then((res) => {
        const minutes = res.data.sleepMinutes ?? total;
        setSleepMinutes(minutes);
        
        if (minutes < targetSleepMinutes) {
          toast.error(`Hôm nay bạn ngủ chưa đủ ${targetHours} giờ! Đừng thức khuya quá nhé.`, { duration: 4000 });
        } else {
          toast.success('Hôm nay bạn đã ngủ đủ giấc, tuyệt vời!');
        }

        const updatedHistory = [...historyData];
        const todayStr = new Date().toDateString();
        const todayIndex = updatedHistory.findIndex(h => new Date(h.date).toDateString() === todayStr);
        if (todayIndex >= 0) {
          updatedHistory[todayIndex].sleepMinutes = minutes;
        } else {
          updatedHistory.unshift({ date: new Date().toISOString(), sleepMinutes: minutes });
        }
        setHistoryData(updatedHistory);

        // Kiểm tra 7 ngày liên tiếp
        const last7Days = updatedHistory.slice(0, 7);
        if (last7Days.length >= 7 && last7Days.every(h => (h.sleepMinutes || 0) < targetSleepMinutes && (h.sleepMinutes || 0) > 0)) {
          setTimeout(() => {
            toast.error('CẢNH BÁO SỨC KHỎE: Bạn đã thiếu ngủ trong 7 ngày liên tiếp. Trạng thái này có thể làm suy giảm hệ miễn dịch và tăng nguy cơ bệnh lý. Hãy cân nhắc nghỉ ngơi nhiều hơn!', { duration: 10000, position: 'top-center', style: { border: '1px solid #ff4b4b', padding: '16px', color: '#ff4b4b' } });
          }, 800);
        }
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
                <p className="fitbit-card-sub" style={{ color: sleepMinutes != null && sleepMinutes < targetSleepMinutes ? '#ef4444' : 'var(--fitbit-muted)' }}>
                  {sleepMinutes != null 
                    ? (sleepMinutes < targetSleepMinutes ? `Thiếu ${Math.floor((targetSleepMinutes - sleepMinutes) / 60)}h ${(targetSleepMinutes - sleepMinutes) % 60}m` : 'Đã đủ giấc')
                    : 'Được dùng trong thẻ Today'}
                </p>
              </div>
              <div className="fitbit-card-icon purple"><i className="bi bi-moon-stars" /></div>
            </div>
            <div className="fitbit-card get-started">
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">Gợi ý</p>
                <p className="fitbit-card-value">{targetHours} giờ</p>
                <p className="fitbit-card-sub">Theo khuyến nghị riêng cho {user?.gender === 'female' ? 'Nữ' : 'Nam'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="today-section">
          <h2 className="today-section-title">Cập nhật giấc ngủ</h2>
          <div className="today-cards today-cards--1col">
            <div className="fitbit-card">
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-form-grid" style={{ marginBottom: currentFormMinutes > 0 ? '0.5rem' : '1.5rem' }}>
                  <div className="profile-form-col">
                    <div className="mb-3">
                      <label className="form-label">Giờ bắt đầu</label>
                      <input
                        type="time"
                        required
                        className="form-control"
                        value={times.start}
                        onChange={(e) => setTimes((prev) => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="profile-form-col">
                    <div className="mb-3">
                      <label className="form-label">Giờ kết thúc</label>
                      <input
                        type="time"
                        required
                        className="form-control"
                        value={times.end}
                        onChange={(e) => setTimes((prev) => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                {currentFormMinutes > 0 && (
                  <div className="profile-form-grid">
                    <div className="profile-form-col" style={{ gridColumn: '1 / -1' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--fitbit-teal)' }}>
                        Tổng thời gian ước tính: {Math.floor(currentFormMinutes / 60)}h {currentFormMinutes % 60}m
                      </p>
                    </div>
                  </div>
                )}
                <div className="profile-form-actions">
                  <button type="submit" className="btn btn-fitbit profile-save-btn" disabled={saving || !times.start || !times.end}>
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