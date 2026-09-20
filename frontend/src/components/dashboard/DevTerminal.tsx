import { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, Pause, Play, ChevronDown, ChevronUp } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'DEBUG' | 'ERROR';
  source: string;
  message: string;
}

export default function DevTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const initialLogs: LogEntry[] = [
    { id: '1', timestamp: new Date(Date.now() - 15000).toISOString(), level: 'INFO', source: 'edge.bus_04', message: 'Edge node connected. Telemetry stream verified over MQTT/gRPC.' },
    { id: '2', timestamp: new Date(Date.now() - 12000).toISOString(), level: 'DEBUG', source: 'yolo.v8x', message: 'Inference latency: 13.8ms | GPU Memory: 2.1GB / 8.0GB | Frame #10492' },
    { id: '3', timestamp: new Date(Date.now() - 9000).toISOString(), level: 'INFO', source: 'spatial.haversine', message: 'Clustering evaluation: lat:10.0159, lng:76.3419 within 20m of Issue #101 (dist: 4.2m)' },
    { id: '4', timestamp: new Date(Date.now() - 6000).toISOString(), level: 'WARN', source: 'category.disclaimer', message: 'Detected TRAFFIC_SIGNAL_DAMAGE (conf: 0.88). Requires visual verification.' },
    { id: '5', timestamp: new Date(Date.now() - 2000).toISOString(), level: 'INFO', source: 'verification.engine', message: 'Issue #101 promoted to VERIFIED_CANDIDATE (Pass count: 3 buses).' }
  ];

  useEffect(() => {
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      const busIds = [1, 2, 3, 4, 5, 8];
      const categories = ['POTHOLE', 'ZEBRA_CROSSING_DAMAGE', 'WATERLOGGING', 'ROAD_OBSTACLE'];
      const busId = busIds[Math.floor(Math.random() * busIds.length)];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const lat = (10.0150 + Math.random() * 0.01).toFixed(4);
      const lng = (76.3400 + Math.random() * 0.01).toFixed(4);
      const conf = (0.85 + Math.random() * 0.13).toFixed(2);
      const ms = (11.5 + Math.random() * 4).toFixed(1);

      const newEntry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        level: Math.random() > 0.8 ? 'WARN' : 'INFO',
        source: `edge.bus_0${busId}`,
        message: `Frame #${Math.floor(Math.random() * 50000 + 10000)}: Detected ${cat} (conf: ${conf}, bbox: [120, 340, 480, 520]) at (${lat}, ${lng}) in ${ms}ms`
      };

      setLogs(prev => [...prev.slice(-40), newEntry]);
    }, 4500);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (!collapsed) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, collapsed]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md font-mono text-xs">
      {/* Console Header */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>BusPlus Edge Telemetry Terminal Log</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!paused)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={paused ? 'Resume Stream' : 'Pause Stream'}
          >
            {paused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      {!collapsed && (
        <div className="p-4 h-44 overflow-y-auto space-y-1 bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/60 p-0.5 rounded">
              <span className="text-slate-500 shrink-0">
                [{log.timestamp.split('T')[1].split('.')[0]}]
              </span>
              <span className={`px-1 rounded text-[10px] font-bold shrink-0 ${
                log.level === 'WARN' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50' :
                log.level === 'ERROR' ? 'bg-red-900/60 text-red-300 border border-red-700/50' :
                'bg-blue-900/60 text-blue-300 border border-blue-700/50'
              }`}>
                {log.level}
              </span>
              <span className="text-emerald-400 font-semibold shrink-0">[{log.source}]</span>
              <span className="text-slate-200 break-all">{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
