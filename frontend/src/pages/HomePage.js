import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '✍️', title: 'Smart Feedback', desc: 'Structured multi-criteria rating system for meaningful insights.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time charts and reports for data-driven decisions.' },
  { icon: '🔒', title: 'Anonymous Option', desc: 'Students can submit anonymously for honest feedback.' },
  { icon: '👥', title: 'Role-based Access', desc: 'Separate dashboards for Admin, Faculty, Student & Coordinator.' },
];

const roles = [
  { role: 'admin', label: 'Admin', icon: '🛡️', desc: 'Manage users, courses & view all reports', color: '#6C63FF', light: '#EEF0FF' },
  { role: 'faculty', label: 'Faculty', icon: '👨‍🏫', desc: 'View feedback for your courses & analytics', color: '#43CFBA', light: '#E6FAF8' },
  { role: 'student', label: 'Student', icon: '🎓', desc: 'Submit feedback and track status', color: '#FF6584', light: '#FFE8ED' },
  { role: 'coordinator', label: 'Coordinator', icon: '📋', desc: 'Oversee departments and manage access', color: '#FFBE55', light: '#FFF8E6' },
];

const HomePage = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', overflowX: 'hidden' }}>
    {/* Nav */}
    <nav style={{ padding: '20px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#9C6FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎓</div>
        <span style={{ color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 22 }}>EduPulse</span>
      </div>
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <button style={{ padding: '10px 28px', borderRadius: 24, background: 'linear-gradient(135deg,#6C63FF,#9C6FFF)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(108,99,255,.4)' }}>
          Login →
        </button>
      </Link>
    </nav>

    {/* Hero */}
    <div style={{ textAlign: 'center', padding: '80px 20px 60px', animation: 'fadeIn .8s ease both' }}>
      <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 20, background: 'rgba(108,99,255,.25)', border: '1px solid rgba(108,99,255,.4)', color: '#A8A3FF', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
        🚀 Modern College Feedback Management
      </div>
      <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,6vw,72px)', color: '#fff', lineHeight: 1.1, marginBottom: 24 }}>
        Transform Academic<br />
        <span style={{ background: 'linear-gradient(90deg,#6C63FF,#FF6584,#43CFBA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Feedback Experience
        </span>
      </h1>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
        A powerful platform that bridges students, faculty and administration through intelligent feedback and real-time analytics.
      </p>
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <button style={{ padding: '16px 44px', borderRadius: 30, background: 'linear-gradient(135deg,#6C63FF,#9C6FFF)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: '0 8px 32px rgba(108,99,255,.5)', marginRight: 16 }}>
          Get Started Free
        </button>
      </Link>
    </div>

    {/* Role Cards */}
    <div style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 40 }}>Choose Your Role</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
        {roles.map(r => (
          <Link key={r.role} to="/login" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20, padding: '28px 24px', textAlign: 'center', cursor: 'pointer',
              transition: 'transform .25s, background .25s, box-shadow .25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,.3)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: 'Poppins,sans-serif', marginBottom: 8 }}>{r.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5 }}>{r.desc}</div>
              <div style={{ marginTop: 20, padding: '8px 20px', borderRadius: 20, background: r.color, color: '#fff', fontSize: 13, fontWeight: 600, display: 'inline-block' }}>
                Login as {r.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

    {/* Features */}
    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '60px 40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 40 }}>Why EduPulse?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      © 2024 EduPulse – College Feedback Management System
    </div>
  </div>
);

export default HomePage;
