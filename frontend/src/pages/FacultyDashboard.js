import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ courseId: '', batch: '', semester: '' });

  const fetchFeedback = async () => {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filter).filter(([, v]) => v)));
    const { data } = await axios.get(`/api/feedback/faculty?${params}`);
    setFeedbacks(data.data);
  };

  useEffect(() => {
    Promise.all([
      axios.get('/api/feedback/analytics'),
      axios.get('/api/courses'),
    ]).then(([a, c]) => {
      setAnalytics(a.data.analytics || []);
      setCourses(c.data.data);
    }).finally(() => setLoading(false));
    fetchFeedback();
  }, []);

  useEffect(() => { fetchFeedback(); }, [filter]);

  const avgRating = feedbacks.length ? (feedbacks.reduce((a, f) => a + f.averageRating, 0) / feedbacks.length).toFixed(1) : 0;

  const radarData = analytics.length > 0 ? {
    labels: ['Teaching', 'Content', 'Accessibility', 'Communication', 'Overall'],
    datasets: [{
      label: 'Avg Score',
      data: [
        +(analytics.reduce((a, c) => a + c.avgTeaching, 0) / analytics.length).toFixed(2),
        +(analytics.reduce((a, c) => a + c.avgContent, 0) / analytics.length).toFixed(2),
        +(analytics.reduce((a, c) => a + c.avgAccessibility, 0) / analytics.length).toFixed(2),
        +(analytics.reduce((a, c) => a + c.avgCommunication, 0) / analytics.length).toFixed(2),
        +(analytics.reduce((a, c) => a + c.avgOverall, 0) / analytics.length).toFixed(2),
      ],
      backgroundColor: 'rgba(108,99,255,0.2)',
      borderColor: '#6C63FF',
      pointBackgroundColor: '#6C63FF',
    }],
  } : null;

  const barData = {
    labels: analytics.slice(0, 6).map(a => a.course?.code || 'N/A'),
    datasets: [{
      label: 'Avg Rating',
      data: analytics.slice(0, 6).map(a => +a.avgOverall.toFixed(2)),
      backgroundColor: ['#6C63FF','#FF6584','#43CFBA','#FFBE55','#9C6FFF','#FF9800'],
      borderRadius: 8,
    }],
  };

  return (
    <Layout title="Faculty Dashboard">
      <div style={{ background: 'linear-gradient(135deg,#43CFBA,#2BB5A0)', borderRadius: 'var(--radius)', padding: '24px 32px', marginBottom: 28, color: '#fff' }}>
        <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>👨‍🏫 {user?.name}</h2>
        <p style={{ opacity: 0.85, fontSize: 14 }}>{user?.department} Department</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard title="My Courses" value={courses.length} icon="📚" color="#43CFBA" bg="#E6FAF8" />
        <StatCard title="Total Feedbacks" value={feedbacks.length} icon="📝" color="#6C63FF" bg="#EEF0FF" />
        <StatCard title="Avg Rating" value={`${avgRating} ⭐`} icon="⭐" color="#FFBE55" bg="#FFF8E6" />
        <StatCard title="Response Rate" value={feedbacks.length > 0 ? '85%' : '0%'} icon="📊" color="#FF6584" bg="#FFE8ED" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {radarData && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Performance Radar</h3>
            <Radar data={radarData} options={{ responsive: true, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } }} />
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Course Ratings</h3>
          {analytics.length > 0 ? <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 5, grid: { color: '#F0F0F0' } }, x: { grid: { display: false } } } }} />
            : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No data yet</div>}
        </div>
      </div>

      {/* Feedback Filter & List */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Student Feedbacks</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <select value={filter.courseId} onChange={e => setFilter(p => ({ ...p, courseId: e.target.value }))}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: '#fff' }}>
            <option value="">All Courses</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={filter.batch} onChange={e => setFilter(p => ({ ...p, batch: e.target.value }))}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: '#fff' }}>
            <option value="">All Batches</option>
            {['2021','2022','2023','2024'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filter.semester} onChange={e => setFilter(p => ({ ...p, semester: e.target.value }))}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: '#fff' }}>
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>
        {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          : feedbacks.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>No feedbacks found for selected filters</p>
          : feedbacks.map(f => (
            <div key={f._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{f.course?.name}</span>
                  <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-muted)' }}>by {f.student?.name || 'Anonymous'} · Batch {f.batch}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarRating value={Math.round(f.averageRating)} readOnly size={16} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{f.averageRating}⭐</span>
                </div>
              </div>
              {f.comment && <p style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{f.comment}"</p>}
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default FacultyDashboard;
