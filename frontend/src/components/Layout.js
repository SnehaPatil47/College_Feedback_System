import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleColors = {
  admin:       { from: '#6C63FF', to: '#9C6FFF' },
  faculty:     { from: '#43CFBA', to: '#2BB5A0' },
  student:     { from: '#FF6584', to: '#FF8FA3' },
  coordinator: { from: '#FFBE55', to: '#FF9800' },
};

const roleIcons = { admin: '🛡️', faculty: '👨‍🏫', student: '🎓', coordinator: '📋' };

const navItems = {
  admin: [
    { label: 'Dashboard',        icon: '📊', path: '/admin' },
    { label: 'Manage Users',     icon: '👥', path: '/admin/users' },
    { label: 'Manage Courses',   icon: '📚', path: '/admin/courses' },
    { label: 'Feedback Reports', icon: '📈', path: '/admin/reports' },
    { label: 'My Profile',       icon: '👤', path: '/profile' },
  ],
  faculty: [
    { label: 'Dashboard', icon: '📊', path: '/faculty' },
    { label: 'My Profile', icon: '👤', path: '/profile' },
  ],
  student: [
    { label: 'Dashboard',       icon: '🏠', path: '/student' },
    { label: 'Submit Feedback', icon: '✍️', path: '/student/submit' },
    { label: 'My Profile',      icon: '👤', path: '/profile' },
  ],
  coordinator: [
    { label: 'Dashboard',        icon: '📋', path: '/coordinator' },
    { label: 'Manage Courses',   icon: '📚', path: '/coordinator/courses' },
    { label: 'Feedback Reports', icon: '📈', path: '/coordinator/reports' },
    { label: 'My Profile',       icon: '👤', path: '/profile' },
  ],
};

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const colors = roleColors[user?.role] || roleColors.admin;
  const items  = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sidebarW = collapsed ? 72 : 260;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 16px' : '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>🎓</div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, lineHeight: 1.1 }}>EduPulse</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 500 }}>Feedback System</div>
          </div>
        )}
        {/* Collapse toggle — only on desktop */}
        <button onClick={() => setCollapsed(c => !c)}
          style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          className="desktop-only">
          {collapsed ? '›' : '‹'}
        </button>
        {/* Close — only on mobile */}
        <button onClick={() => setMobileOpen(false)}
          style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'none', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          className="mobile-close-btn">
          ✕
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>
              {roleIcons[user?.role]}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {items.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: collapsed ? '11px 17px' : '11px 13px',
                borderRadius: 11, marginBottom: 3, cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.25)' : 'transparent',
                transition: 'background .2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                {!collapsed && <span style={{ color: active ? '#fff' : 'rgba(255,255,255,0.82)', fontWeight: active ? 600 : 400, fontSize: 13 }}>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
        <div onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: collapsed ? '11px 17px' : '11px 13px',
          borderRadius: 11, cursor: 'pointer',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'background .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: 17 }}>🚪</span>
          {!collapsed && <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13 }}>Logout</span>}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 98,
        }} />
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        width: sidebarW, minHeight: '100vh',
        background: `linear-gradient(160deg,${colors.from},${colors.to})`,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, zIndex: 100,
        transition: 'width .3s cubic-bezier(.4,0,.2,1)',
        boxShadow: '4px 0 24px rgba(0,0,0,.12)', overflowX: 'hidden',
      }} className="desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* ── MOBILE DRAWER ── */}
      <aside style={{
        width: 260, minHeight: '100vh',
        background: `linear-gradient(160deg,${colors.from},${colors.to})`,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: mobileOpen ? 0 : -280, zIndex: 99,
        transition: 'left .3s cubic-bezier(.4,0,.2,1)',
        boxShadow: mobileOpen ? '4px 0 32px rgba(0,0,0,.25)' : 'none',
        overflowX: 'hidden',
      }} className="mobile-sidebar">
        {/* Mobile close button inside drawer */}
        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setMobileOpen(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* ── MAIN ── */}
      <div style={{
        marginLeft: sidebarW, flex: 1, display: 'flex', flexDirection: 'column',
        transition: 'margin-left .3s cubic-bezier(.4,0,.2,1)', minWidth: 0,
      }} className="main-wrapper">

        {/* Topbar */}
        <header style={{
          height: 64, background: '#fff', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 2px 12px rgba(108,99,255,.07)', gap: 12,
        }}>
          {/* Hamburger — mobile only */}
          <button onClick={() => setMobileOpen(true)}
            style={{
              background: 'var(--primary-light)', border: 'none', borderRadius: 9,
              width: 36, height: 36, cursor: 'pointer', color: 'var(--primary)',
              fontSize: 18, display: 'none', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
            className="hamburger-btn">
            ☰
          </button>

          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h1>

          <div style={{ padding: '5px 14px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}>
            {roleIcons[user?.role]} {user?.role}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 28px', overflowX: 'hidden' }} className="animate-in">
          {children}
        </main>
      </div>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .main-wrapper { margin-left: 0 !important; }
          .hamburger-btn { display: flex !important; }
          main { padding: 16px !important; }
          header { padding: 0 16px !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
        }
        @media (max-width: 480px) {
          main { padding: 12px !important; }
          h1 { font-size: 17px !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;