import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../socket';

const TYPE_ICON = { fire: '🔥', accident: '🚗', medical: '🏥', other: '⚠️' };
const SEV_COLOR = { 5: '#dc2626', 4: '#ea580c', 3: '#ca8a04', 2: '#16a34a', 1: '#6b7280' };
const SEV_LABEL = { 5: 'CRITICAL', 4: 'HIGH', 3: 'MODERATE', 2: 'LOW', 1: 'MINIMAL' };
const STATUS_STYLE = {
  pending:  { bg: '#451a03', color: '#fbbf24', label: '⏳ Pending' },
  assigned: { bg: '#1e3a5f', color: '#60a5fa', label: '🚒 Responding' },
  resolved: { bg: '#14532d', color: '#4ade80', label: '✅ Resolved' },
};

const FILTERS = ['all', 'pending', 'assigned', 'resolved'];
const TYPES   = ['all', 'fire', 'accident', 'medical', 'other'];

export default function IncidentFeed() {
  const [incidents, setIncidents]   = useState([]);
  const [statusF,  setStatusF]      = useState('all');
  const [typeF,    setTypeF]        = useState('all');
  const [search,   setSearch]       = useState('');
  const [newPing,  setNewPing]      = useState(false);
  const [stats,    setStats]        = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/incidents').then(r => {
      setIncidents(r.data);
      calcStats(r.data);
    });

    socket.on('new_incident', inc => {
      setIncidents(prev => {
        const updated = [inc, ...prev];
        calcStats(updated);
        return updated;
      });
      setNewPing(true);
      setTimeout(() => setNewPing(false), 3000);
    });

    socket.on('incident_updated', updated => {
      setIncidents(prev => {
        const next = prev.map(i => i._id === updated._id ? updated : i);
        calcStats(next);
        return next;
      });
    });

    return () => { socket.off('new_incident'); socket.off('incident_updated'); };
  }, []);

  const calcStats = (data) => setStats({
    total:    data.length,
    pending:  data.filter(i => i.status === 'pending').length,
    assigned: data.filter(i => i.status === 'assigned').length,
    resolved: data.filter(i => i.status === 'resolved').length,
  });

  const filtered = incidents.filter(i => {
    const matchStatus = statusF === 'all' || i.status === statusF;
    const matchType   = typeF   === 'all' || i.type   === typeF;
    const matchSearch = !search || i.description?.toLowerCase().includes(search.toLowerCase()) || i.type.includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    return `${Math.floor(diff/3600)}h ago`;
  };

  return (
    <div>
      {/* Live ping banner */}
      {newPing && (
        <div style={{ background: '#dc2626', color: '#fff', textAlign: 'center', padding: '10px', fontWeight: 700, borderRadius: 10, marginBottom: 16, animation: 'pulse 0.5s ease' }}>
          🔴 NEW INCIDENT REPORTED — LIVE UPDATE
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Reports', value: stats.total,    color: '#94a3b8' },
          { label: 'Pending',       value: stats.pending,  color: '#fbbf24' },
          { label: 'Responding',    value: stats.assigned, color: '#60a5fa' },
          { label: 'Resolved',      value: stats.resolved, color: '#4ade80' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1e293b', borderRadius: 12, padding: '16px 20px', border: '1px solid #334155' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        <input
          placeholder="🔍 Search incidents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#f1f5f9', fontSize: 14, flex: 1, minWidth: 180 }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setStatusF(f)}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                borderColor: statusF === f ? '#3b82f6' : '#334155',
                background:  statusF === f ? '#1d3a5f' : '#1e293b',
                color:       statusF === f ? '#60a5fa' : '#64748b' }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeF(t)}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, textTransform: 'capitalize',
                borderColor: typeF === t ? '#f59e0b' : '#334155',
                background:  typeF === t ? '#3f2a00' : '#1e293b',
                color:       typeF === t ? '#fbbf24' : '#64748b' }}>
              {t === 'all' ? 'All Types' : `${TYPE_ICON[t]} ${t}`}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: '#475569', fontSize: 13, marginBottom: 16 }}>
        Showing {filtered.length} of {incidents.length} incidents — updates live
      </p>

      {/* Incident cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(inc => (
          <IncidentCard key={inc._id} inc={inc} timeAgo={timeAgo} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#334155' }}>
            No incidents match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function IncidentCard({ inc, timeAgo }) {
  const [expanded, setExpanded] = useState(false);
  const isUnattended = inc.status === 'pending' && (Date.now() - new Date(inc.createdAt)) > 60000;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: '#1e293b', borderRadius: 12, padding: '16px 20px',
        border: `1px solid ${isUnattended ? '#dc2626' : '#334155'}`,
        cursor: 'pointer',
        boxShadow: isUnattended ? '0 0 12px #dc262630' : 'none',
        transition: 'border-color 0.2s'
      }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 28 }}>{TYPE_ICON[inc.type]}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', textTransform: 'uppercase' }}>{inc.type}</span>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                background: SEV_COLOR[inc.severity] + '25', color: SEV_COLOR[inc.severity] }}>
                {SEV_LABEL[inc.severity]}
              </span>
              {isUnattended && (
                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#dc262625', color: '#dc2626', animation: 'blink 1s infinite' }}>
                  ⚠ UNATTENDED
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              📍 {inc.location.lat.toFixed(4)}, {inc.location.lng.toFixed(4)} · {timeAgo(inc.createdAt)}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: STATUS_STYLE[inc.status].bg, color: STATUS_STYLE[inc.status].color }}>
            {STATUS_STYLE[inc.status].label}
          </span>
          <span style={{ color: '#475569', fontSize: 18 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded: timeline */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #334155' }}>
          {inc.description && (
            <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
              "{inc.description}"
            </p>
          )}
          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
            {[
              { label: 'Reported',   time: inc.createdAt, done: true,                         color: '#dc2626' },
              { label: 'Assigned',   time: inc.updatedAt, done: inc.status !== 'pending',      color: '#3b82f6' },
              { label: 'Resolved',   time: inc.updatedAt, done: inc.status === 'resolved',     color: '#22c55e' },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                    background: step.done ? step.color : '#1e293b',
                    border: `2px solid ${step.done ? step.color : '#334155'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13 }}>
                    {step.done ? '✓' : '○'}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: step.done ? step.color : '#334155' }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                    {step.done ? new Date(step.time).toLocaleTimeString() : '—'}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ height: 2, flex: 0.3, background: step.done && arr[i+1].done ? '#334155' : '#1e293b', marginBottom: 20 }} />
                )}
              </div>
            ))}
          </div>
          {inc.assignedTo && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#60a5fa' }}>
              🚒 Assigned to: <strong>{inc.assignedTo}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}