import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/feedback/my'),
      axios.get('/api/courses'),
    ]).then(([fb, co]) => {
      setFeedbacks(fb.data.data);
      setCourses(co.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const submittedCourseIds = feedbacks.map(f => f.course?._id);
  const pendingCourses = courses.filter(c => !submittedCourseIds.includes(c._id));
  const completionPct = courses.length ? Math.round((submittedCourseIds.length / courses.length) * 100) : 0;

  return (
    <Layout title={`Welcome, ${user?.name?.split(' ')[0]}! 👋`}>
      {/* Student Info Banner */}
      <div style={{ background: 'linear-gradient(135deg,#6C63FF,#9C6FFF)', borderRadius: 'var(--radius)', padding: '24px 32px', marginBottom: 28, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>🎓 Student Dashboard</h2>
          <p style={{ opacity: 0.85, fontSize: 14 }}>{user?.department} · Semester {user?.semester} · Batch {user?.batch}</p>
          {user?.rollNumber && <p style={{ opacity: 0.7, fontSize: 13, marginTop: 2 }}>Roll: {user.rollNumber}</p>}
        </div>
        <Link to="/student/submit" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '12px 28px', borderRadius: 30, background: '#fff', color: '#6C63FF', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>
            ✍️ Submit Feedback
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard title="Total Courses" value={courses.length} icon="📚" color="#6C63FF" bg="#EEF0FF" />
        <StatCard title="Feedback Submitted" value={feedbacks.length} icon="✅" color="#43CFBA" bg="#E6FAF8" />
        <StatCard title="Pending Feedback" value={pendingCourses.length} icon="⏳" color="#FFBE55" bg="#FFF8E6" />
        <StatCard title="Completion" value={`${completionPct}%`} icon="🎯" color="#FF6584" bg="#FFE8ED" />
      </div>

      {/* Progress bar */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Feedback Completion</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>{completionPct}%</span>
        </div>
        <div style={{ height: 10, background: 'var(--bg)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completionPct}%`, background: 'linear-gradient(90deg,#6C63FF,#FF6584)', borderRadius: 10, transition: 'width 1s ease' }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{feedbacks.length} of {courses.length} courses feedback submitted</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Pending courses */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            ⏳ Pending Feedbacks
            {pendingCourses.length > 0 && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#FFEBEE', color: '#EF5350', fontSize: 11, fontWeight: 700 }}>{pendingCourses.length}</span>}
          </h3>
          {loading ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
            : pendingCourses.length === 0 ? <p style={{ color: '#4CAF50', fontSize: 14, fontWeight: 500 }}>🎉 All feedbacks submitted!</p>
            : pendingCourses.map(c => (
              <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>👨‍🏫 {c.faculty?.name}</div>
                </div>
                <Link to="/student/submit" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '6px 14px', borderRadius: 8, background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Give Feedback</button>
                </Link>
              </div>
            ))}
        </div>

        {/* Past feedbacks */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>✅ Submitted Feedbacks</h3>
          {loading ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
            : feedbacks.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No feedbacks submitted yet</p>
            : feedbacks.map(f => (
              <div key={f._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{f.course?.name}</div>
                    <StarRating value={Math.round(f.averageRating)} readOnly size={14} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 8px', background: 'var(--bg)', borderRadius: 6 }}>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {f.comment && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>"{f.comment}"</p>}
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
