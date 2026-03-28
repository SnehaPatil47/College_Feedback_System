import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const roleColors = { admin: '#6C63FF', faculty: '#43CFBA', student: '#FF6584', coordinator: '#FFBE55' };
const roleIcons = { admin: '🛡️', faculty: '👨‍🏫', student: '🎓', coordinator: '📋' };

const ProfilePage = () => {
  const { user, fetchMe } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.put('/api/auth/updatepassword', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) { toast.error(e?.response?.data?.message || 'Error updating password'); }
    finally { setLoading(false); }
  };

  const color = roleColors[user?.role] || '#6C63FF';

  return (
    <Layout title="My Profile">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Profile Card */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ height: 100, background: `linear-gradient(135deg,${color},${color}99)` }} />
          <div style={{ padding: '0 32px 32px', marginTop: -44 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}aa)`, border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
              {roleIcons[user?.role]}
            </div>
            <div style={{ marginTop: 12 }}>
              <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 4 }}>{user?.name}</h2>
              <span style={{ padding: '4px 14px', borderRadius: 20, background: `${color}22`, color, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginTop: 24 }}>
              {[
                { label: 'Email', value: user?.email, icon: '📧' },
                { label: 'Department', value: user?.department || 'N/A', icon: '🏛️' },
                user?.role === 'student' && { label: 'Roll Number', value: user?.rollNumber || 'N/A', icon: '🎫' },
                user?.role === 'student' && { label: 'Semester', value: user?.semester, icon: '📅' },
                user?.role === 'student' && { label: 'Batch', value: user?.batch || 'N/A', icon: '👥' },
                { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'N/A', icon: '🕐' },
              ].filter(Boolean).map((item, i) => (
                <div key={i} style={{ padding: '14px 16px', background: 'var(--bg)', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>🔐 Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            {[
              { label: 'Current Password', key: 'currentPassword' },
              { label: 'New Password', key: 'newPassword' },
              { label: 'Confirm New Password', key: 'confirm' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type="password" value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s' }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ padding: '12px 28px', borderRadius: 10, background: `linear-gradient(135deg,${color},${color}cc)`, color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
