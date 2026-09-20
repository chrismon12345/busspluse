import { useState } from 'react';
import { X, MapPin, Wrench, CheckCircle2, ShieldCheck, AlertOctagon, ArrowRight } from 'lucide-react';
import { RoadIssue } from '../../types';
import SeverityBadge from '../issues/SeverityBadge';
import StatusBadge from '../issues/StatusBadge';

interface InteractiveHazardModalProps {
  issue: RoadIssue | null;
  onClose: () => void;
  onStatusUpdate?: (id: number, status: string) => void;
}

export default function InteractiveHazardModal({ issue, onClose, onStatusUpdate }: InteractiveHazardModalProps) {
  const [assigned, setAssigned] = useState(false);
  const [resolved, setResolved] = useState(false);

  if (!issue) return null;

  const handleAssign = () => {
    setAssigned(true);
    if (onStatusUpdate) onStatusUpdate(issue.id, 'IN_PROGRESS');
  };

  const handleResolve = () => {
    setResolved(true);
    if (onStatusUpdate) onStatusUpdate(issue.id, 'RESOLVED');
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg tracking-tight capitalize">{issue.issue_type.replace(/_/g, ' ')}</h3>
                <span className="text-slate-400 font-mono text-sm">#{issue.id}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <SeverityBadge severity={issue.severity} />
                <StatusBadge status={resolved ? 'RESOLVED' : assigned ? 'IN_PROGRESS' : issue.status} />
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Photo Preview / Inspection Frame */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
            <img 
              src={(issue as any).image_url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80"} 
              alt={issue.issue_type} 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{(issue.confidence * 100).toFixed(0)}% Vision Match</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Independent Buses</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{issue.verification_count} Bus Passes</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-400 uppercase text-[10px]">First Reported</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {new Date(issue.first_detected_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {!resolved ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAssign}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${
                    assigned
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>{assigned ? 'PWD Crew Dispatched ✓' : 'Dispatch Repair Crew'}</span>
                </button>

                <button
                  onClick={handleResolve}
                  className="py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Road Fixed</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 font-extrabold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Road Hazard Successfully Marked as Repaired & Resolved!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Kochi Road Maintenance Authority</span>
          <a href={`/issues/${issue.id}`} className="text-blue-600 hover:underline flex items-center gap-1 font-bold">
            Full Incident Record <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
