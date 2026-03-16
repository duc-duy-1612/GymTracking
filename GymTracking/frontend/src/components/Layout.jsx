import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();
  const [headerDate, setHeaderDate] = useState('');

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setHeaderDate(new Date().toLocaleDateString('vi-VN', options));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const protectedPaths = ['/today', '/workout', '/coach', '/stats', '/profile', '/nutrition', '/sleep', '/history', '/settings'];
    if (protectedPaths.includes(location.pathname)) fetchUser();
  }, [location.pathname, fetchUser]);

  const pageTitles = {
    '/stats': 'Thống kê',
    '/workout': 'Bài tập',
    '/coach': 'Coach',
    '/profile': 'Hồ sơ',
    '/nutrition': 'Dinh dưỡng',
    '/sleep': 'Giấc ngủ',
    '/history': 'Lịch sử',
    '/settings': 'Cài đặt',
  };
  const pageTitle = pageTitles[location.pathname] ?? 'Today';

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="app-wrapper">
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <i className="bi bi-heart-pulse-fill" />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/today" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Today">
            <i className="bi bi-house-door" />
          </NavLink>
          <NavLink to="/workout" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Bài tập">
            <i className="bi bi-lightning" />
          </NavLink>
          <NavLink to="/coach" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Coach">
            <i className="bi bi-grid-3x3-gap" />
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Thống kê">
            <i className="bi bi-bar-chart-line" />
          </NavLink>
          <NavLink to="/nutrition" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Dinh dưỡng">
            <i className="bi bi-egg-fried" />
          </NavLink>
          <NavLink to="/sleep" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Giấc ngủ">
            <i className="bi bi-moon-stars" />
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'active-link' : '')} title="Lịch sử">
            <i className="bi bi-clock-history" />
          </NavLink>
        </nav>
      </aside>

      <main className="app-main">
        <header className="top-bar">
          <div className="top-bar-left">
            <div className="device-icon"><i className="bi bi-phone" /></div>
          </div>
          <div className="top-bar-center">
            <div className="brand">HealthFlow</div>
            <div className="view-label">{pageTitle}</div>
            <div className="header-date">{headerDate}</div>
          </div>
          <div className="top-bar-right">
            {user?.name && (
              <Link to="/profile" className="top-bar-user-name" title="Hồ sơ">
                {user.name}
              </Link>
            )}
            <Link to="/settings" className="icon-btn" title="Cài đặt">
              <i className="bi bi-gear" />
            </Link>
            <button type="button" className="icon-btn" title="Đăng xuất" onClick={logout}><i className="bi bi-box-arrow-right" /></button>
          </div>
        </header>

        <div className={`content-area ${['/today', '/workout', '/coach', '/stats', '/profile'].includes(location.pathname) ? 'content-area--wide' : ''}`}>
          {children}
        </div>

        <button type="button" className="fab" title="Thêm dữ liệu">
          <i className="bi bi-plus-lg" />
        </button>
      </main>
    </div>
  );
}

export default Layout;
