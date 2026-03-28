import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const roleColors = {
  admin: { from: '#6C63FF', to: '#9C6FFF' },
  faculty: { from: '#43CFBA', to: '#2BB5A0' },
  student: { from: '#FF6584', to: '#FF8FA3' },
  coordinator: { from: '#FFBE55', to: '#FF9800' },
};

const roleIcons = {
  admin: '🛡️', faculty: '👨‍🏫', student: '🎓', coordinator: '📋'
};

const navItems = {
  admin: [
    { label: 'Dashboard', icon: '📊', path: '/admin' },
    { label: 'Manage Users', icon: '👥', path: '/admin/users' },
    { label: 'Manage Courses', icon: '📚', path: '/admin/courses' },
    { label: 'Feedback Reports', icon: '📈', path: '/admin/reports' },
    { label: 'My Profile', icon: '👤', path: '/profile' },
  ],
  faculty: [
    { label: 'Dashboard', icon: '📊', path: '/faculty' },
    { label: 'My Profile', icon: '👤', path: '/profile' },
  ],
  student: [
    { label: 'Dashboard', icon: '🏠', path: '/student' },
    { label: 'Submit Feedback', icon: '✍️', path: '/student/submit' },
    { label: 'My Profile', icon: '👤', path: '/profile' },
  ],
  coordinator: [
    { label: 'Dashboard', icon: '📋', path: '/coordinator' },
    { label: 'Manage Courses', icon: '📚', path: '/coordinator/courses' },
    { label: 'Feedback Reports', icon: '📈', path: '/coordinator/reports' },
    { label: 'My Profile', icon: '👤', path: '/profile' },
  ],
};

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const colors = roleColors[user?.role] || roleColors.admin;
  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sidebarW = collapsed ? 72 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Overlay for mobile */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99, display: 'none' }} className="mob-overlay" />}

      {/* Sidebar */}
      <aside style={{
        width: sidebarW, minHeight: '100vh', background: `linear-gradient(160deg, ${colors.from}, ${colors.to})`,
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 100,
        transition: 'width .3s cubic-bezier(.4,0,.2,1)', boxShadow: '4px 0 24px rgba(0,0,0,.12)',
        overflowX: 'hidden',
      }}>
        {/* Logo / Brand */}
        <div style={{ padding: collapsed ? '24px 16px' : '28px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            🎓
          </div>
          {!collapsed && <div>
            <div style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>EduPulse</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>Feedback System</div>
          </div>}
          <button onClick={() => setCollapsed(c => !c)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* User info */}
        {!collapsed && <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {roleIcons[user?.role]}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
        </div>}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '12px 16px' : '12px 14px',
                  borderRadius: 12, marginBottom: 4, cursor: 'pointer',
                  background: active ? 'rgba(255,255,255,0.25)' : 'transparent',
                  transition: 'background .2s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {!collapsed && <span style={{ color: active ? '#fff' : 'rgba(255,255,255,0.85)', fontWeight: active ? 600 : 400, fontSize: 14 }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px 16px' : '12px 14px',
            borderRadius: 12, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'background .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            {!collapsed && <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Logout</span>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: sidebarW, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left .3s cubic-bezier(.4,0,.2,1)', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 68, background: '#fff', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(108,99,255,.07)',
        }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--text)', flex: 1 }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '6px 16px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
              {roleIcons[user?.role]} {user?.role}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', overflowX: 'hidden' }} className="animate-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
