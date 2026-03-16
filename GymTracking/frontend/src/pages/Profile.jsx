import { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  name: '',
  gender: '',
  age: '',
  measurements: { weight: '', height: '', waist: '' },
  activityLevel: 1.55,
  goals: { targetType: 'cut', targetWeight: '', durationMonths: 3 },
};

function validateForm(form) {
  const err = {};
  if (!form.name?.trim()) err.name = 'Vui lòng nhập tên';
  const age = Number(form.age);
  if (form.age !== '' && (isNaN(age) || age < 1 || age > 120)) err.age = 'Tuổi từ 1 đến 120';
  const weight = Number(form.measurements?.weight);
  if (form.measurements?.weight !== '' && form.measurements?.weight != null && (isNaN(weight) || weight < 20 || weight > 300)) err.weight = 'Cân nặng từ 20 đến 300 kg';
  const height = Number(form.measurements?.height);
  if (form.measurements?.height !== '' && form.measurements?.height != null && (isNaN(height) || height < 100 || height > 250)) err.height = 'Chiều cao từ 100 đến 250 cm';
  const waist = Number(form.measurements?.waist);
  if (form.measurements?.waist !== '' && form.measurements?.waist != null && (isNaN(waist) || waist < 50 || waist > 200)) err.waist = 'Vòng eo từ 50 đến 200 cm';
  const targetWeight = Number(form.goals?.targetWeight);
  if (form.goals?.targetWeight !== '' && form.goals?.targetWeight != null && (isNaN(targetWeight) || targetWeight < 20 || targetWeight > 300)) err.targetWeight = 'Cân nặng mục tiêu từ 20 đến 300 kg';
  const duration = Number(form.goals?.durationMonths);
  if (form.goals?.durationMonths !== '' && form.goals?.durationMonths != null && (isNaN(duration) || duration < 1 || duration > 120)) err.durationMonths = 'Thời hạn từ 1 đến 120 tháng';
  return err;
}

function Profile() {
  const { user, loading: userLoading, fetchError, fetchUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      gender: user.gender || '',
      age: user.age ?? '',
      measurements: {
        weight: user.measurements?.weight ?? '',
        height: user.measurements?.height ?? '',
        waist: user.measurements?.waist ?? '',
      },
      activityLevel: user.activityLevel ?? 1.55,
      goals: {
        targetType: user.goals?.targetType || 'cut',
        targetWeight: user.goals?.targetWeight ?? '',
        durationMonths: user.goals?.durationMonths ?? 3,
      },
    });
  }, [user]);

  const handleChange = (field, value) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (field === 'name') delete next.name;
      if (field === 'age') delete next.age;
      if (field.startsWith('measurements.')) {
        const key = field.split('.')[1];
        if (key === 'weight') delete next.weight;
        if (key === 'height') delete next.height;
        if (key === 'waist') delete next.waist;
      }
      if (field.startsWith('goals.')) {
        const key = field.split('.')[1];
        if (key === 'targetWeight') delete next.targetWeight;
        if (key === 'durationMonths') delete next.durationMonths;
      }
      return next;
    });
    if (field.startsWith('measurements.')) {
      const key = field.split('.')[1];
      setForm((prev) => ({
        ...prev,
        measurements: { ...prev.measurements, [key]: value === '' ? '' : Number(value) },
      }));
    } else if (field.startsWith('goals.')) {
      const key = field.split('.')[1];
      setForm((prev) => ({
        ...prev,
        goals: { ...prev.goals, [key]: value === '' ? '' : (key === 'durationMonths' ? Number(value) : value) },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm(form);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      toast.error('Vui lòng sửa các lỗi trong form');
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        gender: form.gender || undefined,
        age: form.age === '' ? undefined : Number(form.age),
        measurements: {
          weight: form.measurements.weight === '' ? undefined : Number(form.measurements.weight),
          height: form.measurements.height === '' ? undefined : Number(form.measurements.height),
          waist: form.measurements.waist === '' ? undefined : Number(form.measurements.waist),
        },
        activityLevel: form.activityLevel,
        goals: {
          targetType: form.goals.targetType,
          targetWeight: form.goals.targetWeight === '' ? undefined : Number(form.goals.targetWeight),
          durationMonths: Number(form.goals.durationMonths) || 3,
        },
      };
      await userService.updateProfile(payload);
      await fetchUser();
      toast.success('Đã cập nhật hồ sơ');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (fetchError && !user) {
    return (
      <div className="profile-page">
        <h2 className="profile-title">Hồ sơ cá nhân</h2>
        <div className="profile-card">
          <p className="text-muted">Không tải được hồ sơ.</p>
          <button type="button" className="btn btn-fitbit" onClick={() => fetchUser()}>Thử lại</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h2 className="profile-title">Hồ sơ cá nhân</h2>
        <div className="profile-card profile-card--skeleton">
          <div className="skeleton-block" style={{ height: 24, width: '40%', marginBottom: 16 }} />
          <div className="skeleton-block" style={{ height: 40, marginBottom: 12 }} />
          <div className="skeleton-block" style={{ height: 40, marginBottom: 12 }} />
          <div className="skeleton-block" style={{ height: 40, width: '70%', marginBottom: 24 }} />
          <div className="skeleton-block" style={{ height: 44, width: 160 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">Hồ sơ cá nhân</h2>
      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form-grid">
          <div className="profile-form-col">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'form-control--error' : ''}`}
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <select
                className="form-select"
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">-- Chọn --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Tuổi</label>
              <input
                type="number"
                className={`form-control ${errors.age ? 'form-control--error' : ''}`}
                min="1"
                max="120"
                placeholder="1–120"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
              {errors.age && <p className="form-error">{errors.age}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Cân nặng (kg)</label>
              <input
                type="number"
                className={`form-control ${errors.weight ? 'form-control--error' : ''}`}
                step="0.1"
                min="20"
                max="300"
                placeholder="20–300"
                value={form.measurements.weight}
                onChange={(e) => handleChange('measurements.weight', e.target.value)}
              />
              {errors.weight && <p className="form-error">{errors.weight}</p>}
              <p className="form-hint">Dùng để tính BMI và TDEE</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Chiều cao (cm)</label>
              <input
                type="number"
                className={`form-control ${errors.height ? 'form-control--error' : ''}`}
                min="100"
                max="250"
                placeholder="100–250"
                value={form.measurements.height}
                onChange={(e) => handleChange('measurements.height', e.target.value)}
              />
              {errors.height && <p className="form-error">{errors.height}</p>}
            </div>
          </div>
          <div className="profile-form-col">
            <div className="mb-3">
              <label className="form-label">Vòng eo (cm)</label>
              <input
                type="number"
                className={`form-control ${errors.waist ? 'form-control--error' : ''}`}
                min="50"
                max="200"
                placeholder="50–200"
                value={form.measurements.waist}
                onChange={(e) => handleChange('measurements.waist', e.target.value)}
              />
              {errors.waist && <p className="form-error">{errors.waist}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Mục tiêu</label>
              <select
                className="form-select"
                value={form.goals.targetType}
                onChange={(e) => handleChange('goals.targetType', e.target.value)}
              >
                <option value="cut">Giảm mỡ</option>
                <option value="bulk">Tăng cơ</option>
                <option value="maintain">Duy trì</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Cân nặng mục tiêu (kg)</label>
              <input
                type="number"
                className={`form-control ${errors.targetWeight ? 'form-control--error' : ''}`}
                step="0.1"
                min="20"
                max="300"
                placeholder="20–300"
                value={form.goals.targetWeight}
                onChange={(e) => handleChange('goals.targetWeight', e.target.value)}
              />
              {errors.targetWeight && <p className="form-error">{errors.targetWeight}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Thời hạn (tháng)</label>
              <input
                type="number"
                className={`form-control ${errors.durationMonths ? 'form-control--error' : ''}`}
                min="1"
                max="120"
                placeholder="1–120"
                value={form.goals.durationMonths}
                onChange={(e) => handleChange('goals.durationMonths', e.target.value)}
              />
              {errors.durationMonths && <p className="form-error">{errors.durationMonths}</p>}
            </div>
          </div>
        </div>
          {(user?.autoStats?.bmr != null || user?.autoStats?.tdee != null) && (
            <div className="profile-stats-row">
              {user.autoStats.bmr != null && (
                <div className="profile-stat-box">
                  <span className="profile-stat-label">BMR</span>
                  <span className="profile-stat-value">{user.autoStats.bmr.toLocaleString()} cal</span>
                  <span className="profile-stat-hint">/ ngày</span>
                </div>
              )}
              {user.autoStats.tdee != null && (
                <div className="profile-stat-box">
                  <span className="profile-stat-label">TDEE</span>
                  <span className="profile-stat-value">{user.autoStats.tdee.toLocaleString()} cal</span>
                  <span className="profile-stat-hint">/ ngày</span>
                </div>
              )}
            </div>
          )}
        <div className="profile-form-actions">
          <button type="submit" className="btn btn-fitbit profile-save-btn" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
