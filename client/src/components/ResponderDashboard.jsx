import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../socket';
import MapView from './MapView';

const SEV_COLOR = { 5: '#dc2626', 4: '#ea580c', 3: '#ca8a04', 2: '#16a34a', 1: '#6b7280' };
const STATUS_BADGE = {
  pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
  assigned: { bg: '#dbeafe', color: '#1e40af', label: '🚒 Assigned' },
  resolved: { bg: '#dcfce7', color: '#166534', label: '✅ Resolved' },
};

export default function ResponderDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/incidents').then(r => setIncidents(r.data));

    socket.on('new_incident', (inc) => {
      setIncidents(prev => [inc, ...prev].sort((a, b) => b.severity - a.severity));
      if (inc.severity >= 4) {
        setAlert(inc);
        // Play alert sound
        try { new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3').play(); } catch {}
        setTimeout(() => setAlert(null), 5000);
      }
    });

    socket.on('incident_updated', (updated) => {
      setIncidents(prev => prev.map(i => i._id === updated._id ? updated : i));
    });

    return () => { socket.off('new_incident'); socket.off('incident_updated'); };
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, {
      status,
      assignedTo: 'Responder Unit 1'
    });
  };

  return (
    <div>
      {alert && (
        <div style={{ background: '#dc2626', color: '#fff', borderRadius: 10, padding: '12px 20px', marginBottom: 16, fontWeight: 700, fontSize: 16 }}>
          🚨 HIGH SEVERITY ALERT: {alert.type.toUpperCase()} — Severity {alert.severity}/5
        </div>
      )}

      <MapView incidents={incidents} />

      <h2 style={{ marginTop: 24 }}>Live Incidents ({incidents.length})</h2>

      {incidents.map(inc => (
        <div key={inc._id} style={{
          border: `2px solid ${SEV_COLOR[inc.severity]}`,
          borderRadius: 10, padding: 16, marginBottom: 12,
          background: inc.status === 'resolved' ? '#f9fafb' : '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 16, color: SEV_COLOR[inc.severity] }}>
                SEV {inc.severity}
              </span>
              <span style={{ marginLeft: 12, fontWeight: 600, textTransform: 'uppercase' }}>{inc.type}</span>
              {inc.description && <p style={{ margin: '4px 0 0', color: '#555', fontSize: 14 }}>{inc.description}</p>}
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
                📍 {inc.location.lat.toFixed(4)}, {inc.location.lng.toFixed(4)} · {new Date(inc.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 13,
                background: STATUS_BADGE[inc.status].bg,
                color: STATUS_BADGE[inc.status].color
              }}>
                {STATUS_BADGE[inc.status].label}
              </span>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                {inc.status === 'pending' && (
                  <button onClick={() => updateStatus(inc._id, 'assigned')}
                    style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                    Assign
                  </button>
                )}
                {inc.status === 'assigned' && (
                  <button onClick={() => updateStatus(inc._id, 'resolved')}
                    style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {incidents.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No incidents yet.</p>}
    </div>
  );
}