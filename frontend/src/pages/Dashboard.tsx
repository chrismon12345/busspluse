import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  Play,
  ArrowRight,
  MapPin,
  Check
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import MiniMap from '../components/dashboard/MiniMap';
import BusSimulatorModal from '../components/dashboard/BusSimulatorModal';
import InteractiveHazardModal from '../components/dashboard/InteractiveHazardModal';
import { apiService } from '../services/api';
import { DashboardStats, RoadIssue } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SeverityBadge from '../components/issues/SeverityBadge';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [issues, setIssues] = useState<RoadIssue[]>([]);
  const [showSimulator, setShowSimulator] = useState(false);
  const [activeHazard, setActiveHazard] = useState<RoadIssue | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assignedIssues, setAssignedIssues] = useState<Record<number, boolean>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    const s = await apiService.getDashboardStats();
    const iss = await apiService.getRecentIssues();
    setStats(s);
    setIssues(iss.slice(0, 5));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAssign = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAssignedIssues(prev => ({ ...prev, [id]: true }));
    setToastMessage(`Repair crew dispatched for Issue #${id}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!stats) return <LoadingSpinner className="h-full" />;

  return (
    <div className="space-y-5 pb-8 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[3000] bg-slate-800 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <BusSimulatorModal
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        onDetectionAdded={loadData}
      />

      <InteractiveHazardModal
        issue={activeHazard}
        onClose={() => setActiveHazard(null)}
        onStatusUpdate={loadData}
      />

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's what's happening with your road network today.
          </p>
        </div>
        <button
          onClick={() => setShowSimulator(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700"
        >
          <Play className="w-3.5 h-3.5" />
          Run Inspection
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Issues" value={stats.total_issues} icon={AlertTriangle} color="blue" trend={12} />
        <StatsCard title="Critical" value={stats.critical_issues} icon={AlertOctagon} color="red" trend={-5} />
        <StatsCard title="Under Repair" value={stats.under_repair} icon={Wrench} color="amber" trend={8} />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle2} color="emerald" trend={24} />
      </div>

      {/* Map + Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 min-h-[400px]">
          <MiniMap />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-800">Recent Issues</h3>
            <button
              onClick={() => navigate('/issues')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {issues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setActiveHazard(issue)}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-sm font-medium text-slate-800 capitalize group-hover:text-blue-600">
                    {issue.issue_type.replace(/_/g, ' ')}
                  </span>
                  <SeverityBadge severity={issue.severity} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                  </div>

                  <button
                    onClick={(e) => handleQuickAssign(e, issue.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                      assignedIssues[issue.id]
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {assignedIssues[issue.id] ? (
                      <><Check className="w-3 h-3" /> Sent</>
                    ) : (
                      <><Wrench className="w-3 h-3" /> Assign</>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {issues.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-400">
                No issues found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
