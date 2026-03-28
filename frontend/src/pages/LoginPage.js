import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const roles = [
  { id: 'admin', label: 'Admin', icon: '🛡️', color: '#6C63FF', demo: { email: 'admin@college.edu', password: 'password123' } },
  { id: 'faculty', label: 'Faculty', icon: '👨‍🏫', color: '#43CFBA', demo: { email: 'priya@college.edu', password: 'password123' } },
  { id: 'student', label: 'Student', icon: '🎓', color: '#FF6584', demo: { email: 'arjun@student.college.edu', password: 'password123' } },
  { id: 'coordinator', label: 'Coordinator', icon: '📋', color: '#FFBE55', demo: { email: 'coordinator@college.edu', password: 'password123' } },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const selectedRoleObj = roles.find(r => r.id === selectedRole);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const r = roles.find(x => x.id === role);
    if (r) { setEmail(r.demo.email); setPassword(r.demo.password); setSelectedRole(role); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', display: 'none' }} className="left-panel">
        <h1 style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 44 }}>EduPulse 🎓</h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginTop: 12, fontSize: 17, lineHeight: 1.7 }}>College Feedback Management System</p>
      </div>

      {/* Right Panel / Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          width: '100%', maxWidth: 460, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.13)', borderRadius: 24, padding: '44px 40px',
          boxShadow: '0 24px 80px rgba(0,0,0,.4)', animation: 'fadeIn .5s ease both',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${selectedRoleObj?.color},${selectedRoleObj?.color}99)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12, boxShadow: `0 8px 24px ${selectedRoleObj?.color}44` }}>
              {selectedRoleObj?.icon}
            </div>
            <h2 style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 26 }}>Welcome Back</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
          </div>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 28 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => { setSelectedRole(r.id); fillDemo(r.id); }}
                style={{
                  padding: '8px 4px', borderRadius: 10, border: `2px solid ${selectedRole === r.id ? r.color : 'rgba(255,255,255,0.12)'}`,
                  background: selectedRole === r.id ? `${r.color}22` : 'transparent',
                  color: selectedRole === r.id ? r.color : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all .2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                }}>
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@college.edu"
                style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s' }}
                onFocus={e => e.target.style.borderColor = selectedRoleObj?.color}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input value={password} onChange={e => setPassword(e.target.value)} type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  style={{ width: '100%', padding: '13px 44px 13px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s' }}
                  onFocus={e => e.target.style.borderColor = selectedRoleObj?.color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: loading ? 'rgba(255,255,255,0.2)' : `linear-gradient(135deg,${selectedRoleObj?.color},${selectedRoleObj?.color}cc)`,
                color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 8px 24px ${selectedRoleObj?.color}44`, transition: 'all .2s',
              }}>
              {loading ? 'Signing in…' : `Sign in as ${selectedRoleObj?.label}`}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0, textAlign: 'center' }}>
              💡 Demo credentials auto-filled — just click Sign In
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
