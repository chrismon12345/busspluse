import { Info, Settings as SettingsIcon, Database, Eye } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Configuration</h2>
        <p className="text-xs text-slate-500 font-medium">Manage AI vision confidence thresholds and spatial clustering parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <div className="p-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-3 shadow-xs">
            <SettingsIcon className="w-4 h-4" /> General Settings
          </div>
          <div className="p-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-3 transition-colors cursor-pointer">
            <Database className="w-4 h-4 text-slate-500" /> AI Vision Model
          </div>
          <div className="p-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-3 transition-colors cursor-pointer">
            <Eye className="w-4 h-4 text-slate-500" /> Appearance & Theme
          </div>
          <div className="p-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-3 transition-colors cursor-pointer">
            <Info className="w-4 h-4 text-slate-500" /> System Architecture
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-3">General Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Backend API Endpoint</label>
                <input type="text" value="http://localhost:8000/api" disabled className="w-full bg-slate-50 border border-slate-200 text-slate-600 font-mono text-xs rounded-lg px-3 py-2 cursor-not-allowed" />
              </div>
              
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Mock AI Pipeline Active</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Using simulated computer vision telemetry for competition prototype</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-not-allowed">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 border-b border-slate-100 pb-3">AI Defect Detection & Verification Thresholds</h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Minimum AI Confidence Score</label>
                  <span className="text-xs font-bold text-blue-600">85%</span>
                </div>
                <input type="range" min="50" max="99" defaultValue="85" disabled className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-not-allowed" />
                <p className="text-[11px] text-slate-500 mt-1.5">Note: Thresholds are configurable operational settings, not scientifically validated physics bounds.</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Multi-Bus Verification Clustering Radius</label>
                  <span className="text-xs font-bold text-blue-600">20 meters</span>
                </div>
                <input type="range" min="5" max="50" defaultValue="20" disabled className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-not-allowed" />
                <p className="text-[11px] text-slate-500 mt-1.5">Haversine GPS clustering promotes 1 bus pass to POSSIBLE, 2 to HIGH CONFIDENCE, and 3+ to VERIFIED CANDIDATE.</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 font-medium">
                <Info className="w-4 h-4 inline text-blue-600 mr-1.5" />
                Multi-class classification disclaimers apply to traffic signal & streetlight damage categories.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
