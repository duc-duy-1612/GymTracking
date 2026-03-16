import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import userService from '../services/userService';
import toast from 'react-hot-toast';

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
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới tối thiểu 6 ký tự');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    setPasswordSaving(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Đã đổi mật khẩu thành công');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setPasswordSaving(false);
    }
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

          <div className="profile-form-actions" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h3 className="profile-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="profile-form-grid">
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <div className="profile-form-col">
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <p className="form-hint">Tối thiểu 6 ký tự</p>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn btn-fitbit profile-save-btn" disabled={passwordSaving}>
                {passwordSaving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

