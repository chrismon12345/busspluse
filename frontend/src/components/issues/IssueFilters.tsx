import { Filter, X } from 'lucide-react';

export default function IssueFilters() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-xs">
      <div className="flex flex-wrap gap-3 items-center flex-1">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Search & Filter:</span>
        </div>
        
        <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 p-2 outline-none">
          <option value="">All Detection Types (7 Classes)</option>
          <option value="POTHOLE">Potholes</option>
          <option value="ZEBRA_CROSSING_DAMAGE">Zebra Crossing Damage</option>
          <option value="TRAFFIC_SIGNAL_DAMAGE">Traffic Signal Damage</option>
          <option value="ROAD_SIGN_OR_MARKING_DAMAGE">Road Sign Damage</option>
          <option value="BROKEN_STREETLIGHT">Broken Streetlights</option>
          <option value="WATERLOGGING">Waterlogging</option>
          <option value="ROAD_OBSTACLE">Road Obstacles</option>
        </select>
        
        <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 p-2 outline-none">
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        
        <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 p-2 outline-none">
          <option value="">All Verification Statuses</option>
          <option value="NEW">New (Single Pass)</option>
          <option value="VERIFIED">Verified Candidate (Multi-Bus)</option>
          <option value="IN_PROGRESS">Work Order Dispatched</option>
          <option value="RESOLVED">Resolved / Repaired</option>
        </select>
      </div>
      
      <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
        <X className="w-3.5 h-3.5" />
        Reset Filters
      </button>
    </div>
  );
}
