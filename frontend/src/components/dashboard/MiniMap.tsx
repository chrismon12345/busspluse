import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from '../../services/api';
import { RoadIssue, Bus } from '../../types';
import { Maximize2, Bus as BusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const issueIcon = (severity: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${
    severity === 'CRITICAL' ? '#dc2626' : severity === 'HIGH' ? '#ea580c' : severity === 'MEDIUM' ? '#d97706' : '#059669'
  }; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); animate: pulse 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const busIcon = L.divIcon({
  className: 'custom-bus-icon',
  html: `<div style="background-color: #2563eb; color: white; width: 22px; height: 22px; border-radius: 6px; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; box-shadow: 0 2px 6px rgba(37,99,235,0.4);">🚌</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

export default function MiniMap() {
  const [issues, setIssues] = useState<RoadIssue[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'verified'>('all');
  const [showBuses, setShowBuses] = useState(true);
  const center: [number, number] = [10.0159, 76.3419];
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getRecentIssues().then(setIssues);
    apiService.getBuses().then(setBuses);
  }, []);

  const filteredIssues = issues.filter(issue => {
    if (filter === 'critical') return issue.severity === 'CRITICAL';
    if (filter === 'verified') return issue.verification_count > 1;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 h-full flex flex-col shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">GIS Spatial Incident Map</h3>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE FEED
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time GPS telemetry from active bus vision sensors</p>
        </div>

        {/* Map View Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Hazards ({issues.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              filter === 'critical' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-red-600'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setShowBuses(!showBuses)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
              showBuses ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <BusIcon className="w-3 h-3" /> Fleet ({buses.length})
          </button>
          <button
            onClick={() => navigate('/map')}
            title="Expand Full GIS Heatmap"
            className="p-1 text-slate-500 hover:text-blue-600 rounded"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 min-h-[340px] relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          {filteredIssues.map(issue => (
            <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={issueIcon(issue.severity)}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-bold text-slate-900 capitalize block text-sm">{issue.issue_type.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] font-semibold text-slate-500">{(issue.confidence * 100).toFixed(0)}% AI Confidence</span>
                  <a href={`/issues/${issue.id}`} className="mt-2 block text-center bg-blue-600 text-white font-bold text-[10px] py-1 rounded">View Incident</a>
                </div>
              </Popup>
            </Marker>
          ))}

          {showBuses && buses.map(bus => bus.last_latitude && bus.last_longitude && (
            <Marker key={`bus-${bus.id}`} position={[bus.last_latitude, bus.last_longitude]} icon={busIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-extrabold text-blue-700 block">{bus.bus_number}</span>
                  <span className="text-slate-600 text-[10px]">{bus.route_name}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
