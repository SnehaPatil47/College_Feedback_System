import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const DEPTS = ['CSE', 'Mathematics', 'Physics', 'Chemistry', 'ECE', 'Mechanical'];
const emptyForm = { name: '', code: '', department: 'CSE', semester: 1, faculty: '', credits: 3, description: '' };

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [c, f] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/users/faculty-list'),
      ]);
      setCourses(c.data.data);
      setFaculty(f.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.code) return toast.error('Name and code required');
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`/api/courses/${editId}`, form);
        toast.success('Course updated!');
      } else {
        await axios.post('/api/courses', form);
        toast.success('Course created!');
      }
      setShowModal(false); setForm(emptyForm); setEditId(null);
      fetchAll();
    } catch (e) { toast.error(e?.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this course?')) return;
    await axios.delete(`/api/courses/${id}`);
    toast.success('Course deactivated');
    fetchAll();
  };

  const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout title="Manage Courses">
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search courses…"
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', background: '#fff' }} />
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}
          style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          + Add Course
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
        {loading ? <div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading…</div>
          : filtered.map(c => (
            <div key={c._id} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 700 }}>{c.code}</span>
                  <span style={{ marginLeft: 8, padding: '3px 10px', borderRadius: 20, background: '#F0FAF8', color: '#43CFBA', fontSize: 11, fontWeight: 600 }}>Sem {c.semester}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.credits} credits</span>
              </div>
              <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 8, color: 'var(--text)' }}>{c.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>📁 {c.department}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>👨‍🏫 {c.faculty?.name || 'Not assigned'}</p>
              {c.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{c.description}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setForm({ name: c.name, code: c.code, department: c.department, semester: c.semester, faculty: c.faculty?._id || '', credits: c.credits, description: c.description || '' }); setEditId(c._id); setShowModal(true); }}
                  style={{ flex: 1, padding: '7px', borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(c._id)}
                  style={{ flex: 1, padding: '7px', borderRadius: 8, background: '#FFEBEE', color: '#EF5350', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 500, boxShadow: 'var(--shadow-lg)', animation: 'fadeIn .25s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>{editId ? 'Edit Course' : 'Add Course'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Course Name', key: 'name', span: 2 },
                { label: 'Course Code', key: 'code' },
                { label: 'Credits', key: 'credits', type: 'number' },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: `span ${f.span || 1}` }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Department</label>
                <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Semester</label>
                <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: Number(e.target.value) }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Faculty</label>
                <select value={form.faculty} onChange={e => setForm(p => ({ ...p, faculty: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
                  <option value="">-- Select Faculty --</option>
                  {faculty.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department})</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditId(null); setForm(emptyForm); }}
                style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '10px 22px', borderRadius: 10, background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageCourses;
