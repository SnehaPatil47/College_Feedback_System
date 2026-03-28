import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CoordinatorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/stats/overview'),
      axios.get('/api/feedback/analytics'),
    ]).then(([s, a]) => {
      setStats(s.data.data);
      setAnalytics(a.data.analytics || []);
    }).finally(() => setLoading(false));
  }, []);

  const actions = [
    { label: 'Manage Courses', icon: '📚', path: '/coordinator/courses', color: '#6C63FF', desc: 'Add, edit or assign faculty to courses' },
    { label: 'Feedback Reports', icon: '📊', path: '/coordinator/reports', color: '#43CFBA', desc: 'View and manage all feedback submissions' },
    { label: 'Department Stats', icon: '🏛️', path: '#', color: '#FFBE55', desc: 'Overview of department performance' },
  ];

  const deptBarData = {
    labels: (stats?.deptStats || []).map(d => d._id),
    datasets: [{
      label: 'Feedbacks',
      data: (stats?.deptStats || []).map(d => d.count),
      backgroundColor: ['#6C63FF','#FF6584','#43CFBA','#FFBE55','#9C6FFF'],
      borderRadius: 8,
    }],
  };

  return (
    <Layout title="Coordinator Dashboard">
      <div style={{ background: 'linear-gradient(135deg,#FFBE55,#FF9800)', borderRadius: 'var(--radius)', padding: '24px 32px', marginBottom: 28, color: '#fff' }}>
        <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>📋 Coordinator Panel</h2>
        <p style={{ opacity: 0.85, fontSize: 14 }}>Manage courses, assignments, and monitor feedback activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon="🎓" color="#6C63FF" bg="#EEF0FF" />
        <StatCard title="Total Faculty" value={stats?.totalFaculty || 0} icon="👨‍🏫" color="#43CFBA" bg="#E6FAF8" />
        <StatCard title="Active Courses" value={stats?.totalCourses || 0} icon="📚" color="#FFBE55" bg="#FFF8E6" />
        <StatCard title="Total Feedbacks" value={stats?.totalFeedbacks || 0} icon="📝" color="#FF6584" bg="#FFE8ED" />
        <StatCard title="Pending Review" value={stats?.pendingFeedbacks || 0} icon="⏳" color="#9C6FFF" bg="#F3EEFF" subtitle="Needs attention" />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 28 }}>
        {actions.map(a => (
          <Link key={a.label} to={a.path} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
              <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 6, color: a.color }}>{a.label}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Dept feedback chart */}
      {(stats?.deptStats || []).length > 0 && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Feedbacks by Department</h3>
          <Bar data={deptBarData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#F0F0F0' } }, x: { grid: { display: false } } } }} />
        </div>
      )}

      {/* Top rated */}
      {analytics.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Course Performance Summary</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Course', 'Dept', 'Feedbacks', 'Avg Teaching', 'Avg Content', 'Avg Overall'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analytics.map((a, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{a.course?.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{a.course?.department}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>{a.totalFeedbacks}</span></td>
                    <td style={{ padding: '12px 16px' }}>{a.avgTeaching?.toFixed(1)} ⭐</td>
                    <td style={{ padding: '12px 16px' }}>{a.avgContent?.toFixed(1)} ⭐</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: a.avgOverall >= 4 ? '#4CAF50' : a.avgOverall >= 3 ? '#FFBE55' : '#EF5350' }}>{a.avgOverall?.toFixed(1)} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CoordinatorDashboard;
