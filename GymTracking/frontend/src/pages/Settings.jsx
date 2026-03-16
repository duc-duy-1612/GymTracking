import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const PREF_KEY = 'healthflow_settings';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

function Settings() {
  const { user } = useUser();
  const [prefs, setPrefs] = useState({
    unitWeight: 'kg',
    unitHeight: 'cm',
    theme: 'dark',
    notifications: true,
  });

  useEffect(() => {
    const stored = loadPrefs();
    if (stored) setPrefs((prev) => ({ ...prev, ...stored }));
  }, []);

  const handleChange = (field, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [field]: value };
      savePrefs(next);
      return next;
    });
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">Cài đặt</h2>
      <div className="profile-card">
        <div className="profile-form">
          <div className="profile-form-grid">
            <div className="profile-form-col">
              <div className="mb-3">
                <label className="form-label">Tài khoản</label>
                <p className="text-muted" style={{ marginBottom: 0 }}>
                  Đang đăng nhập: <strong>{user?.name || 'User'}</strong>
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn vị cân nặng</label>
                <select
                  className="form-select"
                  value={prefs.unitWeight}
                  onChange={(e) => handleChange('unitWeight', e.target.value)}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="lb">Pound (lb)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn vị chiều cao</label>
                <select
                  className="form-select"
                  value={prefs.unitHeight}
                  onChange={(e) => handleChange('unitHeight', e.target.value)}
                >
                  <option value="cm">Centimet (cm)</option>
                  <option value="in">Inch (in)</option>
                </select>
              </div>
            </div>
            <div className="profile-form-col">
              <div className="mb-3">
                <label className="form-label">Chủ đề giao diện</label>
                <select
                  className="form-select"
                  value={prefs.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <option value="dark">Tối (hiện tại)</option>
                  <option value="light">Sáng</option>
                </select>
                <p className="form-hint">Chủ đề sáng chỉ mang tính minh họa trong đồ án này.</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Thông báo</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notifSwitch"
                    checked={prefs.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="notifSwitch">
                    Nhận nhắc nhở uống nước, tập luyện, ngủ đúng giờ
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

