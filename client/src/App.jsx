import { useState } from 'react';
import CitizenForm from './components/CitizenForm';
import ResponderDashboard from './components/ResponderDashboard';

export default function App() {
  const [view, setView] = useState('home');

  if (view === 'citizen') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <button onClick={() => setView('home')}
        style={{ marginBottom: 20, padding: '6px 16px', background: 'none', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', color: '#555' }}>
        ← Back
      </button>
      <CitizenForm />
    </div>
  );

  if (view === 'responder') return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <button onClick={() => setView('home')}
        style={{ marginBottom: 20, padding: '6px 16px', background: 'none', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', color: '#555' }}>
        ← Back
      </button>
      <ResponderDashboard />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: 1, color: '#f8fafc' }}>RAKSHAK</span>
        </div>
        <span style={{ fontSize: 13, color: '#64748b', background: '#1e293b', padding: '4px 12px', borderRadius: 20 }}>
          Real-Time Emergency Management
        </span>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ display: 'inline-block', background: '#dc262620', border: '1px solid #dc262640', borderRadius: 20, padding: '6px 18px', fontSize: 13, color: '#fca5a5', marginBottom: 24 }}>
          🔴 LIVE SYSTEM ACTIVE
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
          Every Second<br />
          <span style={{ color: '#dc2626' }}>Counts.</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7 }}>
          Rakshak bridges the gap between emergencies and responders — with live location reporting, real-time triage, and instant dispatch.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setView('citizen')}
            style={{
              padding: '18px 40px', fontSize: 18, fontWeight: 700,
              background: '#dc2626', color: '#fff',
              border: 'none', borderRadius: 12, cursor: 'pointer',
              boxShadow: '0 0 30px #dc262650',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            🚨 Report Emergency
          </button>
          <button onClick={() => setView('responder')}
            style={{
              padding: '18px 40px', fontSize: 18, fontWeight: 700,
              background: 'transparent', color: '#e2e8f0',
              border: '2px solid #334155', borderRadius: 12, cursor: 'pointer',
              transition: 'transform 0.15s, border-color 0.15s'
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.borderColor = '#60a5fa'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.borderColor = '#334155'; }}
          >
            🖥️ Responder Dashboard
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, margin: '0 auto 60px', maxWidth: 700 }}>
        {[
          { value: '< 10s', label: 'Alert Latency' },
          { value: '5 Levels', label: 'Severity Triage' },
          { value: 'Live', label: 'Map Tracking' },
          { value: '2-Way', label: 'Status Sync' },
        ].map((s, i, arr) => (
          <div key={s.label} style={{
            flex: 1, textAlign: 'center', padding: '20px 10px',
            borderLeft: i === 0 ? '1px solid #1e293b' : 'none',
            borderRight: '1px solid #1e293b',
            borderTop: '1px solid #1e293b',
            borderBottom: '1px solid #1e293b',
            borderRadius: i === 0 ? '12px 0 0 12px' : i === arr.length - 1 ? '0 12px 12px 0' : 0,
            background: '#0f172a'
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px 80px', maxWidth: 960, margin: '0 auto' }}>
        {[
          { icon: '📍', title: 'Live Location', desc: 'GPS-accurate incident pinning the moment a report is filed. No manual address entry.', color: '#22c55e' },
          { icon: '⚡', title: 'Real-Time Sync', desc: 'Socket.IO pushes every new report instantly to all active responder dashboards.', color: '#3b82f6' },
          { icon: '🗺️', title: 'Map View', desc: 'Leaflet map shows all active incidents with color-coded severity markers.', color: '#f59e0b' },
          { icon: '🔔', title: 'Smart Alerts', desc: 'Audio alert fires automatically for severity 4–5 incidents on the responder side.', color: '#dc2626' },
          { icon: '🚒', title: 'Dispatch & Triage', desc: 'Responders assign, track, and resolve incidents. Citizens see status update live.', color: '#8b5cf6' },
          { icon: '🗄️', title: 'MongoDB Backend', desc: 'All incidents persisted with timestamps, location, type, severity, and assignment logs.', color: '#06b6d4' },
        ].map(f => (
          <div key={f.title} style={{
            width: 260, background: '#1e293b', borderRadius: 14, padding: 24,
            border: '1px solid #334155'
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: f.color, marginBottom: 8 }}>{f.title}</div>
            <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 0 40px', color: '#334155', fontSize: 13, borderTop: '1px solid #1e293b' }}>
        Built for Catalysis 4.0 · Genesis Club · Coding Relay
      </div>
    </div>
  );
}