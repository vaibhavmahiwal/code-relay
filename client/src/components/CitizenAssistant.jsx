import { useState } from 'react';
import axios from 'axios';

export default function CitizenAssistant({ incidentType, onFillDescription }) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: `I'm here to help you describe your ${incidentType} emergency clearly. What's happening right now?` }
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/assist', {
        message: input,
        incidentType
      });
      setMessages(prev => [...prev, { from: 'ai', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'ai', text: 'Connection issue — please describe the emergency in the text box directly.' }]);
    }
    setLoading(false);
  };

  const useAsDescription = () => {
    const userTexts = messages.filter(m => m.from === 'user').map(m => m.text).join('. ');
    onFillDescription(userTexts);
    setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ width: '100%', padding: '10px 0', background: '#1e293b', color: '#60a5fa', border: '1px dashed #2563eb60', borderRadius: 8, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
      🤖 Not sure what to write? Let AI help you describe it →
    </button>
  );

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e3a5f', marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: '#1d3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#60a5fa' }}>🤖 AI Emergency Assistant</span>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>

      <div style={{ height: 200, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '8px 12px', borderRadius: 10, fontSize: 13, lineHeight: 1.5,
              background: m.from === 'user' ? '#2563eb' : '#1e293b',
              color: m.from === 'user' ? '#fff' : '#94a3b8'
            }}>
              {m.from === 'ai' && <span style={{ fontSize: 11, color: '#3b82f6' }}>🤖 AI  </span>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: 10, width: 60, color: '#475569', fontSize: 13 }}>
            ● ● ●
          </div>
        )}
      </div>

      <div style={{ padding: '10px 14px', borderTop: '1px solid #1e293b', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type what's happening..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 13 }} />
        <button onClick={send} disabled={loading}
          style={{ padding: '8px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
          →
        </button>
      </div>
      <div style={{ padding: '8px 14px', borderTop: '1px solid #1e293b' }}>
        <button onClick={useAsDescription}
          style={{ width: '100%', padding: '8px 0', background: '#14532d', color: '#4ade80', border: '1px solid #16a34a40', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          ✓ Use this conversation as my description
        </button>
      </div>
    </div>
  );
}