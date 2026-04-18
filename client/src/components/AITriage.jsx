import { useState } from 'react';
import axios from 'axios';

const RESPONSE_ICONS = {
  'Police': '👮', 'Fire Brigade': '🚒', 'Ambulance': '🚑',
  'Disaster Response': '🆘', 'Multiple Units': '🚨'
};

export default function AITriage({ type, description, severity, onAccept }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/ai/triage', { type, description, severity });
      setResult(res.data);
    } catch {
      setError('AI analysis unavailable — submit manually.');
    }
    setLoading(false);
  };

  if (!result) return (
    <div style={{ marginTop: 16, padding: '14px 18px', background: '#0f172a', borderRadius: 10, border: '1px solid #1e3a5f' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#60a5fa' }}>🤖 AI Triage Analysis</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Let AI validate severity and suggest response units</div>
        </div>
        <button onClick={analyze} disabled={loading}
          style={{ padding: '8px 18px', background: '#1d3a5f', color: '#60a5fa', border: '1px solid #2563eb40', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
          {loading ? '⏳ Analyzing...' : '🤖 Analyze'}
        </button>
      </div>
      {error && <p style={{ color: '#fca5a5', fontSize: 12, margin: '8px 0 0' }}>{error}</p>}
    </div>
  );

  const sevDiff = result.suggestedSeverity - severity;

  return (
    <div style={{ marginTop: 16, background: '#0f172a', borderRadius: 12, border: '1px solid #2563eb40', overflow: 'hidden' }}>
      <div style={{ padding: '10px 18px', background: '#1d3a5f', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>🤖 AI Triage Result</span>
        <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>Powered by Groq · Llama 3</span>
      </div>

      <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Suggested severity */}
        <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', border: '1px solid #334155' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>SUGGESTED SEVERITY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: result.suggestedSeverity >= 4 ? '#dc2626' : result.suggestedSeverity >= 3 ? '#f59e0b' : '#22c55e' }}>
              {result.suggestedSeverity}/5
            </span>
            {sevDiff !== 0 && (
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6,
                background: sevDiff > 0 ? '#dc262620' : '#22c55e20',
                color: sevDiff > 0 ? '#fca5a5' : '#86efac' }}>
                {sevDiff > 0 ? `▲ +${sevDiff} from yours` : `▼ ${sevDiff} from yours`}
              </span>
            )}
          </div>
        </div>

        {/* Response type */}
        <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', border: '1px solid #334155' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>RECOMMENDED RESPONSE</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>
            {RESPONSE_ICONS[result.responseType] || '🚨'} {result.responseType}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{result.estimatedUnits} unit{result.estimatedUnits > 1 ? 's' : ''} suggested</div>
        </div>

        {/* Priority action */}
        <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>PRIORITY ACTION</div>
          <div style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600 }}>⚡ {result.priorityAction}</div>
        </div>

        {/* Risk factors */}
        {result.riskFactors?.length > 0 && (
          <div style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>RISK FACTORS</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {result.riskFactors.map(r => (
                <span key={r} style={{ padding: '3px 10px', borderRadius: 6, background: '#dc262618', color: '#fca5a5', fontSize: 12, border: '1px solid #dc262630' }}>
                  ⚠ {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 18px', borderTop: '1px solid #1e293b', display: 'flex', gap: 10 }}>
        <button onClick={() => onAccept(result.suggestedSeverity)}
          style={{ flex: 1, padding: '10px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          ✓ Use AI Severity ({result.suggestedSeverity})
        </button>
        <button onClick={() => onAccept(severity)}
          style={{ padding: '10px 18px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
          Keep Mine ({severity})
        </button>
      </div>
    </div>
  );
}