import { useState } from 'react';

export default function AuthModal({ onSuccess, onClose }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.username || !form.password) { setError('Both fields required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${tab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return; }
      onSuccess(data);
    } catch (err) {
      setError('Server unreachable — check backend');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#00000090', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 36, width: 360, border: '1px solid #334155', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' }}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#f8fafc' }}>Responder Access</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#0f172a', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontWeight: 700, fontSize: 14, textTransform: 'capitalize',
                background: tab === t ? '#3b82f6' : 'transparent',
                color: tab === t ? '#fff' : '#64748b'
              }}>
              {t === 'login' ? '🔑 Login' : '📋 Sign Up'}
            </button>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Operator ID</label>
        <input
          placeholder="e.g. Operator_04"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', marginBottom: 16, boxSizing: 'border-box', fontSize: 15 }}
        />

        <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', marginBottom: 8, boxSizing: 'border-box', fontSize: 15 }}
        />

        {error && <p style={{ color: '#fca5a5', fontSize: 13, margin: '0 0 12px' }}>⚠ {error}</p>}

        <button onClick={submit} disabled={loading}
          style={{ width: '100%', padding: '12px 0', marginTop: 8, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          {loading ? 'Please wait...' : tab === 'login' ? '🔑 Login' : '📋 Create Account'}
        </button>

        <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
          Access restricted to authorized emergency responders only.
        </p>
      </div>
    </div>
  );
}