import { Cpu, Activity, GitBranch, Server, Zap } from 'lucide-react';

export default function SystemTelemetryBar() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-xs shadow-xs flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Backend Stack Badge */}
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400 font-bold">FastAPI Server:</span>
          <span className="text-emerald-400 font-semibold">uvicorn :8000</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">SQLite WAL</span>
        </div>

        {/* Vision Inference Speed */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 font-bold">YOLOv8 Inference:</span>
          <span className="text-amber-300 font-semibold">13.8ms</span>
          <span className="text-[10px] text-slate-500">(30 FPS Stream)</span>
        </div>

        {/* Spatial Algorithm */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4 hidden md:flex">
          <GitBranch className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400 font-bold">Spatial Engine:</span>
          <span className="text-purple-300 font-semibold">Haversine 20m</span>
        </div>

        {/* VRAM GPU Utilization */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4 hidden lg:flex">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 font-bold">Edge VRAM:</span>
          <span className="text-slate-200">2.4 / 8.0 GB</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">gRPC MQTT Stream: Active</span>
        </div>
      </div>
    </div>
  );
}
