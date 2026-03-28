import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import StarRating from '../components/StarRating';

const FeedbackReports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ semester: '', batch: '', status: '' });
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
      const { data } = await axios.get(`/api/feedback/all?${params}`);
      setFeedbacks(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filters]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/feedback/${id}/status`, { status });
      toast.success('Status updated');
      fetch();
    } catch { toast.error('Error updating status'); }
  };

  const filtered = feedbacks.filter(f =>
    (f.course?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.faculty?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = { pending: '#FFBE55', reviewed: '#43CFBA', actioned: '#4CAF50' };

  return (
    <Layout title="Feedback Reports">
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total', count: feedbacks.length, color: '#6C63FF' },
          { label: 'Pending', count: feedbacks.filter(f => f.status === 'pending').length, color: '#FFBE55' },
          { label: 'Reviewed', count: feedbacks.filter(f => f.status === 'reviewed').length, color: '#43CFBA' },
          { label: 'Actioned', count: feedbacks.filter(f => f.status === 'actioned').length, color: '#4CAF50' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: '18px 20px', boxShadow: 'var(--shadow)', border: `1px solid ${s.color}22`, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'Poppins,sans-serif' }}>{s.count}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by course or faculty…"
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, outline: 'none', background: '#fff' }} />
        <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="actioned">Actioned</option>
        </select>
        <select value={filters.semester} onChange={e => setFilters(p => ({ ...p, semester: e.target.value }))}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {/* Feedback Cards */}
      {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading feedbacks…</div>
        : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No feedbacks found</div>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(f => (
              <div key={f._id} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 700 }}>{f.course?.code}</span>
                      <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{f.course?.name}</h3>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>👨‍🏫 {f.faculty?.name} &nbsp;|&nbsp; 🎓 {f.isAnonymous ? 'Anonymous' : f.student?.name} &nbsp;|&nbsp; 📅 Sem {f.semester} · {f.batch}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ padding: '4px 14px', borderRadius: 20, background: `${statusColor[f.status]}22`, color: statusColor[f.status], fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{f.status}</span>
                    <select value={f.status} onChange={e => updateStatus(f._id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: '#fff', cursor: 'pointer' }}>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="actioned">Actioned</option>
                    </select>
                  </div>
                </div>

                {/* Ratings */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 14 }}>
                  {[
                    { label: 'Teaching Quality', val: f.ratings?.teachingQuality },
                    { label: 'Course Content', val: f.ratings?.courseContent },
                    { label: 'Accessibility', val: f.ratings?.accessibility },
                    { label: 'Communication', val: f.ratings?.communication },
                    { label: 'Overall', val: f.ratings?.overallSatisfaction },
                  ].map(r => (
                    <div key={r.label} style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{r.label}</div>
                      <StarRating value={r.val} readOnly size={16} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {f.comment && <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', flex: 1 }}>💬 "{f.comment}"</p>}
                  <div style={{ padding: '6px 16px', borderRadius: 20, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', color: '#fff', fontSize: 13, fontWeight: 700, marginLeft: 12 }}>
                    Avg: {f.averageRating}⭐
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </Layout>
  );
};

export default FeedbackReports;
