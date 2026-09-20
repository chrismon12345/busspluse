import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { RoadIssue } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import SeverityBadge from '../issues/SeverityBadge';
import { MapPin, ArrowRight, ShieldCheck, Wrench, CheckCircle2, Code2 } from 'lucide-react';

interface RecentIssuesProps {
  onInspectJson?: (issue: RoadIssue) => void;
}

export default function RecentIssues({ onInspectJson }: RecentIssuesProps) {
  const [issues, setIssues] = useState<RoadIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigned, setAssigned] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getRecentIssues().then(data => {
      setIssues(data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const handleQuickAssign = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAssigned(prev => ({ ...prev, [id]: true }));
  };

  const handleInspect = (e: React.MouseEvent, issue: RoadIssue) => {
    e.stopPropagation();
    if (onInspectJson) {
      onInspectJson(issue);
    } else {
      navigate(`/issues/${issue.id}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 h-full flex flex-col shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Priority Defect Stream</h3>
          <p className="text-xs text-slate-500 font-medium">Verified by edge camera vision</p>
        </div>
        <button 
          onClick={() => navigate('/issues')} 
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {issues.map(issue => (
          <div 
            key={issue.id}
            onClick={() => navigate(`/issues/${issue.id}`)}
            className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/80 cursor-pointer transition-all flex flex-col gap-2 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900 capitalize tracking-tight group-hover:text-blue-600 transition-colors">
                  {issue.issue_type.replace(/_/g, ' ')}
                </span>
                {issue.verification_count > 1 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200" title={`${issue.verification_count} buses detected this defect`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{issue.verification_count}x Verified</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <SeverityBadge severity={issue.severity} />
                {onInspectJson && (
                  <button
                    onClick={(e) => handleInspect(e, issue)}
                    className="p-1 rounded bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors"
                    title="Inspect API JSON Payload"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* AI Confidence progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    issue.severity === 'CRITICAL' ? 'bg-red-600' : issue.severity === 'HIGH' ? 'bg-orange-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${issue.confidence * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{(issue.confidence * 100).toFixed(0)}% AI Match</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/50">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="font-mono text-[10px]">{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
              </div>
              
              <button
                onClick={(e) => handleQuickAssign(e, issue.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                  assigned[issue.id]
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                {assigned[issue.id] ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Crew Dispatched</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-3 h-3 text-slate-500" />
                    <span>Assign PWD Crew</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
