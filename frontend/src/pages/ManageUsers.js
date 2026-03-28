import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const ROLES = ['admin', 'faculty', 'student', 'coordinator'];
const DEPTS = ['CSE', 'Mathematics', 'Physics', 'Chemistry', 'ECE', 'Mechanical', 'Administration'];

const Badge = ({ role }) => {
  const colors = { admin: '#6C63FF', faculty: '#43CFBA', student: '#FF6584', coordinator: '#FFBE55' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, background: `${colors[role]}22`, color: colors[role], fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{role}</span>;
};

const emptyForm = { name: '', email: '', password: '', role: 'student', department: 'CSE', rollNumber: '', semester: 1, batch: '2021' };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = filterRole ? `?role=${filterRole}` : '';
      const { data } = await axios.get(`/api/users${q}`);
      setUsers(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filterRole]);

  const handleSave = async () => {
    if (!form.name || !form.email) return toast.error('Name and email required');
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`/api/users/${editId}`, form);
        toast.success('User updated!');
      } else {
        await axios.post('/api/users', form);
        toast.success('User created!');
      }
      setShowModal(false); setForm(emptyForm); setEditId(null);
      fetch();
    } catch (e) { toast.error(e?.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try { await axios.delete(`/api/users/${id}`); toast.success('User deactivated'); fetch(); }
    catch (e) { toast.error('Error'); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout title="Manage Users">
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search users…"
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', background: '#fff' }} />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff', cursor: 'pointer' }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}
          style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          + Add User
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: .5, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id} style={{ borderTop: '1px solid var(--border)', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFE'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}><Badge role={u.role} /></td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{u.department || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: u.isActive ? '#E8F5E9' : '#FFEBEE', color: u.isActive ? '#4CAF50' : '#EF5350', fontSize: 11, fontWeight: 600 }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department || '', rollNumber: u.rollNumber || '', semester: u.semester || 1, batch: u.batch || '' }); setEditId(u._id); setShowModal(true); }}
                        style={{ padding: '5px 12px', borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(u._id)}
                        style={{ padding: '5px 12px', borderRadius: 8, background: '#FFEBEE', color: '#EF5350', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>
          {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)', animation: 'fadeIn .25s ease' }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--text)' }}>{editId ? 'Edit User' : 'Add New User'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', span: 2 },
                { label: 'Email', key: 'email', type: 'email', span: 2 },
                { label: 'Password', key: 'password', type: 'password', span: 2, placeholder: editId ? 'Leave blank to keep' : 'Min 6 chars' },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder || ''}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Department</label>
                <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {form.role === 'student' && <>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Roll Number</label>
                  <input value={form.rollNumber} onChange={e => setForm(p => ({ ...p, rollNumber: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Semester</label>
                  <input type="number" min={1} max={8} value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </>}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditId(null); setForm(emptyForm); }}
                style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--primary)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageUsers;
