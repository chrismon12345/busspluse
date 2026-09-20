import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoadIssue } from '../../types';
import { apiService } from '../../services/api';
import SeverityBadge from '../issues/SeverityBadge';
import StatusBadge from '../issues/StatusBadge';
import { Layers } from 'lucide-react';
import HeatmapLayer from './HeatmapLayer';

// Custom colored div icon for light map
const customIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const getSeverityColor = (severity: string) => {
  switch(severity) {
    case 'LOW': return '#059669';
    case 'MEDIUM': return '#d97706';
    case 'HIGH': return '#ea580c';
    case 'CRITICAL': return '#dc2626';
    default: return '#2563eb';
  }
};

export default function IssueMap() {
  const [issues, setIssues] = useState<RoadIssue[]>([]);
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');
  const center: [number, number] = [10.0159, 76.3419];

  useEffect(() => {
    apiService.getIssues().then(setIssues);
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white">
      <div className="absolute top-4 right-4 z-[1000] bg-white border border-slate-200 rounded-xl p-1.5 shadow-md flex gap-1">
        <button 
          onClick={() => setViewMode('markers')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'markers' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Individual Incidents
        </button>
        <button 
          onClick={() => setViewMode('heatmap')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'heatmap' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Layers className="w-3.5 h-3.5" /> Severity Heatmap
        </button>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {viewMode === 'markers' ? (
          issues.map(issue => (
            <Marker 
              key={issue.id} 
              position={[issue.latitude, issue.longitude]} 
              icon={customIcon(getSeverityColor(issue.severity))}
            >
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-extrabold text-slate-900 capitalize text-sm">{issue.issue_type.replace(/_/g, ' ')}</h4>
                  </div>
                  <div className="flex gap-1.5 mb-3">
                    <SeverityBadge severity={issue.severity} />
                    <StatusBadge status={issue.status} />
                  </div>
                  <div className="text-xs text-slate-600 mb-1">
                    <span className="font-semibold text-slate-700">AI Confidence:</span> {(issue.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600 mb-3">
                    <span className="font-semibold text-slate-700">Bus Verifications:</span> {issue.verification_count} buses
                  </div>
                  <a href={`/issues/${issue.id}`} className="block w-full text-center bg-blue-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs">
                    Inspect Full Details
                  </a>
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          <HeatmapLayer points={issues.map(i => ({ latitude: i.latitude, longitude: i.longitude, intensity: i.severity === 'CRITICAL' ? 1 : i.severity === 'HIGH' ? 0.8 : i.severity === 'MEDIUM' ? 0.5 : 0.2, issue_type: i.issue_type }))} />
        )}
      </MapContainer>
    </div>
  );
}
