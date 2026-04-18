import { useState } from 'react';
import axios from 'axios';

export default function AIBriefing() {
  const [briefing, setBriefing] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [time,     setTime]     = useState('');

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/ai/summary');
      setBriefing(res.data.summary);
      setTime(new Date().toLocaleTimeString());
    } catch {
      setBriefing('Could not generate briefing — check server connection.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e3a5f', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '12px 20px', background: '#1d3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#60a5fa' }}>🤖 AI Command Briefing</span>
          {time && <span style={{ fontSize: 11, color: '#475569', marginLeft: 12 }}>Generated at {time}</span>}
        </div>
        <button onClick={generate} disabled={loading}
          style={{ padding: '7px 18px', background: loading ? '#1e293b' : '#2563eb', color: loading ? '#475569' : '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          {loading ? '⏳ Generating...' : '⚡ Generate Briefing'}
        </button>
      </div>

      {briefing ? (
        <div style={{ padding: '16px 20px' }}>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            {briefing}
          </p>
        </div>
      ) : (
        <div style={{ padding: '16px 20px', color: '#334155', fontSize: 13, textAlign: 'center' }}>
          Click "Generate Briefing" to get an AI summary of all active incidents for your command handover.
        </div>
      )}
    </div>
  );
}