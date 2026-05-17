import { useState } from 'react';
import CitizenForm from './components/CitizenForm';
import ResponderDashboard from './components/ResponderDashboard';
import AuthModal from './components/AuthModal';
import IncidentFeed from './components/IncidentFeed';

const FEATURES = [
  { icon: '📍', title: 'Live Location Pinning', color: '#22c55e',
    desc: 'The moment a citizen files a report, their GPS coordinates are captured and stored. No manual address — just instant, accurate location data on the map.' },
  { icon: '⚡', title: 'Zero-Refresh Real-Time', color: '#3b82f6',
    desc: 'Built on Socket.IO — every new incident appears on every active responder dashboard in under a second. No polling, no page refresh, no delay.' },
  { icon: '🗺️', title: 'Live Incident Map', color: '#f59e0b',
    desc: 'Leaflet-powered map view shows all active incidents as color-coded markers. Red for critical, amber for moderate, green for low. Zoom in and click for details.' },
  { icon: '🔔', title: 'Severity-Based Alerts', color: '#dc2626',
    desc: 'Severity 4–5 incidents trigger an audio alert on the responder dashboard the instant they come in — so critical cases never get buried in the list.' },
  { icon: '🚒', title: 'Assign & Dispatch', color: '#8b5cf6',
    desc: 'Responders can assign any incident to a unit with one click. The citizen\'s view updates live — they know help is coming before the unit even moves.' },
  { icon: '🗄️', title: 'Persistent MongoDB Backend', color: '#06b6d4',
    desc: 'Every incident is stored with type, severity, location, status, timestamps, and assignment logs. Full audit trail, exportable, queryable — built for real deployment.' },
  { icon: '🤖', title: 'AI Triage Engine', color: '#a78bfa',
    desc: 'Groq-powered Llama 3 analyzes each report — suggests severity level, recommends response units, flags risk factors, and generates command briefings in real time.' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🧑', title: 'Citizen Reports', color: '#dc2626',
    desc: 'Opens the app, selects incident type (fire / accident / medical), sets severity 1–5, adds a description, and hits submit. Location is captured automatically.' },
  { step: '02', icon: '🤖', title: 'AI Analyzes', color: '#8b5cf6',
    desc: 'Groq AI instantly validates severity, identifies risk factors, recommends response type and unit count — before the report even reaches the responder.' },
  { step: '03', icon: '📡', title: 'Instant Broadcast', color: '#3b82f6',
    desc: 'The report hits the Express API, gets saved to MongoDB, and is immediately broadcast via Socket.IO to every connected responder dashboard.' },
  { step: '04', icon: '🖥️', title: 'Responder Triages', color: '#f59e0b',
    desc: 'The responder sees the incident appear live with AI triage attached, sorted by severity. They view it on the map and decide how to respond.' },
  { step: '05', icon: '🚒', title: 'Dispatch & Resolve', color: '#22c55e',
    desc: 'Responder clicks Assign — the citizen\'s status updates to "Help is on the way." Once handled, the responder marks it resolved and the map pin clears.' },
];

export default function App() {
  const [view,       setView]       = useState('home');
  const [showAuth,   setShowAuth]   = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,       setUser]       = useState(null);

  const handleAuthSuccess = (data) => {
    setUser(data);
    setIsLoggedIn(true);
    setShowAuth(false);
    setView('responder');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    setView('home');
  };

  const goResponder = () => {
    if (isLoggedIn) setView('responder');
    else setShowAuth(true);
  };

  const BackBar = ({ extra }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <button onClick={() => setView('home')}
        style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, cursor: 'pointer', color: '#94a3b8' }}>
        ← Back to Home
      </button>
      {extra}
    </div>
  );

  if (view === 'citizen') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: 20 }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <BackBar />
        <CitizenForm />
      </div>
    </div>
  );

  if (view === 'responder') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: 20 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <BackBar extra={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#94a3b8', background: '#1e293b', padding: '6px 14px', borderRadius: 20, border: '1px solid #334155' }}>
              🟢 {user?.username || 'Operator'}
            </span>
            <button onClick={handleSignOut}
              style={{ padding: '8px 16px', background: 'transparent', color: '#fca5a5', border: '1px solid #dc262640', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Sign Out
            </button>
          </div>
        } />
        <ResponderDashboard user={user} />
      </div>
    </div>
  );

  if (view === 'feed') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: 20 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <BackBar extra={<span style={{ fontSize: 13, color: '#64748b' }}>🔴 Updates live via Socket.IO</span>} />
        <h2 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 26 }}>📋 Live Incident Feed</h2>
        <IncidentFeed />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'sans-serif' }}>

      {showAuth && <AuthModal onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}

      {/* Nav */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, background: '#0f172aee', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1, color: '#f8fafc' }}>RAKSHAK</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setView('feed')}
            style={{ padding: '7px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            📋 Live Feed
          </button>
          <span style={{ fontSize: 12, color: '#64748b', background: '#1e293b', padding: '4px 12px', borderRadius: 20 }}>
            🔴 Live · AI-Powered
          </span>
          {!isLoggedIn ? (
            <button onClick={() => setShowAuth(true)}
              style={{ padding: '8px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              Responder Sign In
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>🟢 {user?.username}</span>
              <button onClick={handleSignOut}
                style={{ padding: '8px 16px', background: 'transparent', color: '#fca5a5', border: '1px solid #dc262640', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '90px 24px 70px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dc262618', border: '1px solid #dc262640', borderRadius: 20, padding: '6px 18px', fontSize: 13, color: '#fca5a5', marginBottom: 28 }}>
          <span>🔴 LIVE</span>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ color: '#a78bfa' }}>🤖 AI TRIAGE ACTIVE</span>
          <span style={{ color: '#334155' }}>|</span>
          <span>SOCKET.IO + MONGODB</span>
        </div>
        <h1 style={{ 
  fontSize: 62, 
  fontWeight: 900, 
  margin: '0 0 20px', 
  lineHeight: 1.1, 
  letterSpacing: -1,
  color: '#ffffff' // This makes "When Seconds Matter," pure white
}}>
  When Seconds Matter,<br />
  <span style={{ color: '#dc2626' }}>Every Detail Counts.</span> 
</h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 580, margin: '0 auto 16px', lineHeight: 1.8 }}>
          Rakshak is a two-sided emergency management platform — citizens report incidents with live GPS in seconds, AI validates severity, responders triage and dispatch in real time.
        </p>
        <p style={{ color: '#475569', fontSize: 15, maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.7 }}>
          No delays. No missed reports. No confusion about who's handling what.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setView('citizen')}
            style={{ padding: '18px 44px', fontSize: 18, fontWeight: 700, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 0 40px #dc262645' }}>
            🚨 Report Emergency
          </button>
          <button onClick={goResponder}
            style={{ padding: '18px 44px', fontSize: 18, fontWeight: 700, background: 'transparent', color: '#e2e8f0', border: '2px solid #334155', borderRadius: 12, cursor: 'pointer' }}>
            🖥️ Responder Dashboard {!isLoggedIn && <span style={{ fontSize: 13, color: '#64748b' }}> (Login required)</span>}
          </button>
          <button onClick={() => setView('feed')}
            style={{ padding: '18px 44px', fontSize: 18, fontWeight: 700, background: 'transparent', color: '#94a3b8', border: '2px solid #1e293b', borderRadius: 12, cursor: 'pointer' }}>
            📋 Live Incident Feed
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto 80px', border: '1px solid #1e293b', borderRadius: 14, overflow: 'hidden' }}>
        {[
          { value: '< 1s',    label: 'Report → Dashboard' },
          { value: '5',       label: 'Severity Levels' },
          { value: 'Live',    label: 'GPS Map Tracking' },
          { value: '2-Way',   label: 'Citizen ↔ Responder' },
          { value: 'Llama 3', label: 'AI Triage Model' },
        ].map((s, i, arr) => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '22px 10px', borderRight: i < arr.length - 1 ? '1px solid #1e293b' : 'none', background: '#0f172a' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.label === 'AI Triage Model' ? '#a78bfa' : '#f8fafc' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>How Rakshak Works</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 48, fontSize: 15 }}>
          Five steps from emergency to resolution — AI-validated, real-time, end-to-end.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} style={{ background: '#1e293b', borderRadius: 14, padding: 22, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: 2, marginBottom: 10 }}>STEP {step.step}</div>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{step.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 8 }}>{step.title}</div>
              <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ maxWidth: 1000, margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Built for Real Emergencies</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 48, fontSize: 15 }}>
          Every feature exists because a real gap exists between incident and response.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: '#1e293b', borderRadius: 14, padding: 24, border: '1px solid #334155' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: f.color, marginBottom: 10 }}>{f.title}</div>
              <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', padding: '60px 24px', background: '#0a1020', borderTop: '1px solid #1e293b' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Ready to respond?</h2>
        <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>Sign in as an operator to access the live AI-powered command center.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={goResponder}
            style={{ padding: '16px 40px', fontSize: 16, fontWeight: 700, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 0 30px #3b82f645' }}>
            🖥️ Open Responder Dashboard
          </button>
          <button onClick={() => setView('feed')}
            style={{ padding: '16px 40px', fontSize: 16, fontWeight: 700, background: 'transparent', color: '#94a3b8', border: '2px solid #1e293b', borderRadius: 12, cursor: 'pointer' }}>
            📋 View Live Feed
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid #1e293b', background: '#0f172a' }}>
        <span style={{ color: '#334155', fontSize: 12 }}>Built for Catalysis 4.0 · Genesis Club · Coding Relay · Rakshak v1.0 · AI by Groq</span>
      </div>
    </div>
  );
}