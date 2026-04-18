import { useState } from 'react';
import axios from 'axios';
// Add to imports at top
import AITriage from './AITriage';
import CitizenAssistant from './CitizenAssistant';

const TYPES = ['fire', 'accident', 'medical', 'other'];
const TYPE_ICONS = { fire: '🔥', accident: '🚗', medical: '🏥', other: '⚠️' };

export default function CitizenForm() {
  const [form, setForm] = useState({ type: 'medical', severity: 3, description: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);

  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        // fallback: Bengaluru center for demo (DSCE area approx)
        setCoords({ lat: 12.9716, lng: 77.5946 });
        setLocating(false);
      }
    );
  };

  const submit = async () => {
    if (!coords) { alert('Please get your location first'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/incidents', {
        ...form,
        location: { lat: coords.lat, lng: coords.lng }
      });
      setSubmitted(res.data);
    } catch (err) {
      alert('Error submitting report. Check if backend is running on port 5000.');
    }
    setLoading(false);
  };

  if (submitted) return (
    <div style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: 12, padding: 24, color: '#ecfdf5' }}>
      <h2 style={{ color: '#34d399', marginTop: 0 }}>✅ Report Submitted</h2>
      <p>Incident ID: <code style={{ background: '#065f46', padding: '2px 6px', borderRadius: 4 }}>{submitted._id}</code></p>
      <p>Status: <strong style={{ color: '#fbbf24' }}>{submitted.status.toUpperCase()}</strong></p>
      <p style={{ opacity: 0.9 }}>Responders have been notified. Please stay on the line if contacted.</p>
      <button onClick={() => { setSubmitted(null); setCoords(null); }}
        style={{ marginTop: 12, padding: '10px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
        File Another Report
      </button>
    </div>
  );

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24, color: '#f1f5f9' }}>
      <h2 style={{ color: '#ef4444', marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>🚨</span> Report Emergency
      </h2>

      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Incident Type</label>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setForm({ ...form, type: t })}
            style={{ 
              padding: '10px 16px', borderRadius: 8, border: '2px solid', cursor: 'pointer',
              borderColor: form.type === t ? '#ef4444' : '#475569',
              background: form.type === t ? '#ef4444' : '#0f172a',
              color: '#fff',
              transition: 'all 0.2s',
              flex: '1 1 auto'
            }}>
            {TYPE_ICONS[t]} {t.toUpperCase()}
          </button>
        ))}
      </div>

      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        Manual Severity: <span style={{ color: '#ef4444' }}>{form.severity}/5</span>
      </label>
      <input type="range" min={1} max={5} value={form.severity}
        onChange={e => setForm({ ...form, severity: +e.target.value })}
        style={{ width: '100%', marginBottom: 20, accentColor: '#ef4444' }} />

      {/* AI Integrated Section */}
      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Description</label>
      <CitizenAssistant
        incidentType={form.type}
        onFillDescription={(text) => setForm({ ...form, description: text })}
      />
      <textarea rows={3} value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Briefly describe what's happening..."
        style={{ 
          width: '100%', padding: 12, borderRadius: 8, border: '1px solid #334155', 
          background: '#0f172a', color: '#f1f5f9', marginBottom: 12, boxSizing: 'border-box',
          fontSize: '15px'
        }} />

      <AITriage
        type={form.type}
        description={form.description}
        severity={form.severity}
        onAccept={(sev) => setForm({ ...form, severity: sev })}
      />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
        <button onClick={getLocation} disabled={locating}
          style={{ 
            padding: '10px 20px', 
            background: coords ? '#059669' : '#3b82f6', 
            color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
            fontWeight: 600, flex: 1
          }}>
          {locating ? '📡 Locating...' : coords ? '📍 Location Locked' : '📍 Pin My Location'}
        </button>
        {coords && (
          <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', fontSize: 12, color: '#94a3b8' }}>
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </div>
        )}
      </div>

      <button onClick={submit} disabled={loading || !coords}
        style={{ 
          width: '100%', padding: '16px 0', 
          background: !coords ? '#475569' : '#ef4444', 
          color: '#fff', border: 'none', borderRadius: 12, 
          fontSize: 18, fontWeight: 800, cursor: coords ? 'pointer' : 'not-allowed',
          boxShadow: coords ? '0 4px 20px rgba(239, 68, 68, 0.4)' : 'none',
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => coords && (e.target.style.transform = 'scale(0.98)')}
        onMouseUp={e => coords && (e.target.style.transform = 'scale(1)')}
      >
        {loading ? 'Submitting...' : '🚀 Dispatch Emergency Help'}
      </button>
    </div>
  );
}