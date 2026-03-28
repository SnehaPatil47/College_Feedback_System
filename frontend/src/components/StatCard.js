import React from 'react';

const StatCard = ({ title, value, icon, color = 'var(--primary)', bg = 'var(--primary-light)', trend, subtitle }) => (
  <div style={{
    background: '#fff', borderRadius: 'var(--radius)', padding: '24px',
    boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: 12,
    transition: 'transform .2s, box-shadow .2s', cursor: 'default',
    border: '1px solid var(--border)',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Poppins,sans-serif', color: 'var(--text)', lineHeight: 1 }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {icon}
      </div>
    </div>
    {trend !== undefined && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: trend >= 0 ? '#4CAF50' : '#EF5350' }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs last month</span>
      </div>
    )}
  </div>
);

export default StatCard;
