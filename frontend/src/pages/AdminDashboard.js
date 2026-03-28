import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/stats/overview'),
      axios.get('/api/feedback/analytics'),
    ]).then(([s, a]) => {
      setStats(s.data.data);
      setAnalytics(a.data);
    }).finally(() => setLoading(false));
  }, []);

  const monthlyData = {
    labels: (analytics?.monthlyTrend || []).map(m => MONTHS[m._id - 1]),
    datasets: [{
      label: 'Feedbacks Submitted',
      data: (analytics?.monthlyTrend || []).map(m => m.count),
      borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.12)',
      fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#6C63FF',
    }],
  };

  const courseData = {
    labels: (analytics?.analytics || []).slice(0, 6).map(a => a.course?.code || 'N/A'),
    datasets: [{
      label: 'Avg Rating',
      data: (analytics?.analytics || []).slice(0, 6).map(a => +a.avgOverall.toFixed(2)),
      backgroundColor: ['#6C63FF','#FF6584','#43CFBA','#FFBE55','#9C6FFF','#FF9800'],
      borderRadius: 8,
    }],
  };

  const deptData = {
    labels: (stats?.deptStats || []).map(d => d._id || 'Other'),
    datasets: [{
      data: (stats?.deptStats || []).map(d => d.count),
      backgroundColor: ['#6C63FF','#FF6584','#43CFBA','#FFBE55','#9C6FFF'],
      borderWidth: 0,
    }],
  };

  const chartOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#F0F0F0' }, beginAtZero: true } } };

  if (loading) return <Layout title="Admin Dashboard"><div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading dashboard…</div></Layout>;

  return (
    <Layout title="Admin Dashboard">
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon="🎓" color="#6C63FF" bg="#EEF0FF" trend={5} />
        <StatCard title="Total Faculty" value={stats?.totalFaculty || 0} icon="👨‍🏫" color="#43CFBA" bg="#E6FAF8" trend={2} />
        <StatCard title="Active Courses" value={stats?.totalCourses || 0} icon="📚" color="#FF6584" bg="#FFE8ED" />
        <StatCard title="Total Feedbacks" value={stats?.totalFeedbacks || 0} icon="📝" color="#FFBE55" bg="#FFF8E6" trend={12} />
        <StatCard title="Avg Rating" value={`${stats?.avgRating || 0}⭐`} icon="⭐" color="#9C6FFF" bg="#F3EEFF" />
        <StatCard title="Pending Review" value={stats?.pendingFeedbacks || 0} icon="⏳" color="#FF9800" bg="#FFF3E0" subtitle="Needs attention" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20, color: 'var(--text)' }}>Monthly Feedback Trend</h3>
          <Line data={monthlyData} options={{ ...chartOpts, plugins: { legend: { display: true } } }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20, color: 'var(--text)' }}>Feedbacks by Dept.</h3>
          {(stats?.deptStats || []).length > 0
            ? <Doughnut data={deptData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }, cutout: '65%' }} />
            : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No data yet</div>}
        </div>
      </div>

      {/* Course Ratings */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20, color: 'var(--text)' }}>Course Average Ratings</h3>
        {(analytics?.analytics || []).length > 0
          ? <Bar data={courseData} options={{ ...chartOpts, scales: { x: { grid: { display: false } }, y: { min: 0, max: 5, grid: { color: '#F0F0F0' } } } }} />
          : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No feedback data yet</div>}
      </div>

      {/* Top Rated Courses Table */}
      {(analytics?.analytics || []).length > 0 && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Top Rated Courses</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['#', 'Course', 'Dept.', 'Avg Rating', 'Feedbacks'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(analytics.analytics || []).slice(0, 8).map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{row.course?.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{row.course?.department}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 60, height: 6, borderRadius: 3, background: '#EEE', overflow: 'hidden', display: 'inline-block' }}>
                        <span style={{ display: 'block', height: '100%', width: `${(row.avgOverall / 5) * 100}%`, background: 'linear-gradient(90deg,#6C63FF,#FF6584)', borderRadius: 3 }} />
                      </span>
                      {row.avgOverall?.toFixed(1)} ⭐
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>{row.totalFeedbacks}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
