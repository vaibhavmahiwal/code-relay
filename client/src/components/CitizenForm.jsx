import { useState } from 'react';
import axios from 'axios';

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
        // fallback: Bengaluru center for demo
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
      alert('Error submitting report');
    }
    setLoading(false);
  };

  if (submitted) return (
    <div style={{ background: '#dcfce7', border: '1px solid #16a34a', borderRadius: 12, padding: 24 }}>
      <h2 style={{ color: '#15803d' }}>✅ Report Submitted</h2>
      <p>ID: <code>{submitted._id}</code></p>
      <p>Status: <strong>{submitted.status}</strong></p>
      <p style={{ color: '#555' }}>Help is on the way. Stay calm.</p>
      <button onClick={() => { setSubmitted(null); setCoords(null); }}
        style={{ marginTop: 12, padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        New Report
      </button>
    </div>
  );

  return (
    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: 24 }}>
      <h2 style={{ color: '#dc2626', marginTop: 0 }}>Report an Emergency</h2>

      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Incident Type</label>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setForm({ ...form, type: t })}
            style={{ padding: '8px 14px', borderRadius: 8, border: '2px solid', cursor: 'pointer',
              borderColor: form.type === t ? '#dc2626' : '#d1d5db',
              background: form.type === t ? '#dc2626' : '#fff',
              color: form.type === t ? '#fff' : '#374151' }}>
            {TYPE_ICONS[t]} {t}
          </button>
        ))}
      </div>

      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        Severity: <span style={{ color: '#dc2626' }}>{form.severity}/5</span>
      </label>
      <input type="range" min={1} max={5} value={form.severity}
        onChange={e => setForm({ ...form, severity: +e.target.value })}
        style={{ width: '100%', marginBottom: 20 }} />

      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Description</label>
      <textarea rows={3} value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Briefly describe what's happening..."
        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db', marginBottom: 20, boxSizing: 'border-box' }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <button onClick={getLocation} disabled={locating}
          style={{ padding: '8px 16px', background: coords ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          {locating ? '📡 Locating...' : coords ? '📍 Location Set' : '📍 Get My Location'}
        </button>
        {coords && <span style={{ color: '#555', fontSize: 13 }}>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>}
      </div>

      <button onClick={submit} disabled={loading || !coords}
        style={{ width: '100%', padding: '12px 0', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Sending...' : '🚨 Submit Report'}
      </button>
    </div>
  );
}