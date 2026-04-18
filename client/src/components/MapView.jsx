import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SEV_COLOR = { 5: '#dc2626', 4: '#ea580c', 3: '#ca8a04', 2: '#16a34a', 1: '#6b7280' };

export default function MapView({ incidents }) {
  const active = incidents.filter(i => i.status !== 'resolved');

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: 320, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {active.map(inc => (
          <CircleMarker
            key={inc._id}
            center={[inc.location.lat, inc.location.lng]}
            radius={8 + inc.severity * 2}
            pathOptions={{ color: SEV_COLOR[inc.severity], fillColor: SEV_COLOR[inc.severity], fillOpacity: 0.7 }}
          >
            <Popup>
              <strong>{inc.type.toUpperCase()}</strong> — Severity {inc.severity}<br />
              {inc.description}<br />
              <em>{inc.status}</em>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}