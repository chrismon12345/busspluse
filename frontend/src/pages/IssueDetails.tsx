import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, MapPin, ShieldAlert, AlertTriangle, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { RoadIssue } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SeverityBadge from '../components/issues/SeverityBadge';
import StatusBadge from '../components/issues/StatusBadge';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<RoadIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiService.getIssue(Number(id)).then(data => {
        setIssue(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <LoadingSpinner className="h-full" />;
  if (!issue) return <div className="text-center p-8 text-slate-500 font-medium">Issue record not found.</div>;

  const requiresVisualVerification = ['TRAFFIC_SIGNAL_DAMAGE', 'BROKEN_STREETLIGHT'].includes(issue.issue_type);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <button 
        onClick={() => navigate('/issues')}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Issue Directory
      </button>

      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-slate-900 capitalize tracking-tight">{issue.issue_type.replace(/_/g, ' ')}</h1>
              <span className="text-slate-400 font-mono text-lg font-bold">#{issue.id}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <SeverityBadge severity={issue.severity} />
              <StatusBadge status={issue.status} />
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 border-l border-slate-200 pl-4">
                <MapPin className="w-4 h-4 text-blue-600" />
                {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[220px]">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Update Dispatch Status</label>
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none w-full shadow-xs"
              defaultValue={issue.status}
            >
              <option value="NEW">New (Single Bus Alert)</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified (Multi-Bus)</option>
              <option value="REPORTED">Reported to PWD Authority</option>
              <option value="IN_PROGRESS">Repair Crew Dispatched</option>
              <option value="RESOLVED">Resolved / Repaired</option>
              <option value="REJECTED">Rejected / False Positive</option>
            </select>
            <button className="btn-primary mt-2 w-full text-xs font-bold py-2.5">Save Status Update</button>
          </div>
        </div>
      </div>

      {requiresVisualVerification && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-xs font-medium shadow-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <p className="leading-relaxed">
            <strong className="font-extrabold block text-amber-900 mb-0.5">Visual Confirmation Required for Damage Category</strong>
            AI vision detected structural anomaly on {issue.issue_type.replace(/_/g, ' ').toLowerCase()}, but cannot confirm electrical function. Manual verification is recommended prior to work order assignment.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-3">AI Vision Detection Telemetry</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{(issue.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bus Passes</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{issue.verification_count}</span>
                  <span className="text-xs text-slate-500 font-semibold mb-1">buses</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">First Detected</p>
                <p className="text-xs font-bold text-slate-800">
                  {new Date(issue.first_detected_at).toLocaleDateString()}
                  <br/>
                  <span className="text-[11px] text-slate-500 font-medium">{new Date(issue.first_detected_at).toLocaleTimeString()}</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Confirmed</p>
                <p className="text-xs font-bold text-slate-800">
                  {new Date(issue.last_detected_at).toLocaleDateString()}
                  <br/>
                  <span className="text-[11px] text-slate-500 font-medium">{new Date(issue.last_detected_at).toLocaleTimeString()}</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Inspector Notes</h4>
              <p className="text-slate-600 text-xs bg-slate-50 p-4 rounded-xl min-h-[90px] border border-slate-200 leading-relaxed font-medium">
                {issue.description || "Automated AI detection logged from mobile camera unit mounted on bus."}
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-3">Multi-Bus Verification Audit Trail</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-blue-900">Initial Bus Camera Trigger</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{new Date(issue.first_detected_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">Logged by Bus B-102 (Route: Aluva - Fort Kochi)</p>
                  <div className="mt-1 text-[11px] font-bold text-blue-700">Frame Confidence: {(issue.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              {issue.verification_count > 1 && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-emerald-900">Spatial Haversine Clustering Confirmation</span>
                      <span className="text-[11px] text-slate-500 font-semibold">Multiple Bus Passes</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">Verified by {issue.verification_count - 1} additional transit buses within 20m radius.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-1 h-[280px] overflow-hidden shadow-xs">
            <MapContainer 
              center={[issue.latitude, issue.longitude]} 
              zoom={16} 
              style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker position={[issue.latitude, issue.longitude]} icon={defaultIcon} />
            </MapContainer>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-3">Quick Actions</h3>
            
            <div className="space-y-2.5">
              <button className="w-full btn-secondary flex items-center justify-between p-3 text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-800"><FileCheck className="w-4 h-4 text-blue-600" /> Export Defect Work Order</span>
              </button>
              <button className="w-full btn-primary flex items-center justify-between p-3 text-xs">
                <span className="flex items-center gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Mark Resolved</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
