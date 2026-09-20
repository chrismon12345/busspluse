import IssueMap from '../components/map/IssueMap';

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-6.5rem)] -m-6 animate-fade-in relative">
      <IssueMap />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white border border-slate-200 rounded-xl p-4 text-xs font-semibold shadow-lg pointer-events-none">
        <h4 className="font-extrabold text-slate-900 mb-2.5 border-b border-slate-100 pb-1.5 uppercase tracking-wider text-[11px]">Severity Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-xs"></div>
            <span className="text-slate-700">Low Severity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-600 border border-white shadow-xs"></div>
            <span className="text-slate-700">Medium Severity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-orange-600 border border-white shadow-xs"></div>
            <span className="text-slate-700">High Severity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs animate-pulse"></div>
            <span className="text-red-700 font-extrabold">Critical Defect</span>
          </div>
        </div>
      </div>
    </div>
  );
}
