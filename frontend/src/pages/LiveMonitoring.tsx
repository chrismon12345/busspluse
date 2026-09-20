import { useEffect, useState } from 'react';
import { Bus, Video, VideoOff, Activity, AlertCircle } from 'lucide-react';
import { Bus as BusType } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LiveMonitoring() {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    apiService.getBuses().then(data => {
      setBuses(data);
      setLoading(false);
    });

    // Simulated live updates
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => ({
        ...bus,
        last_latitude: (bus.last_latitude || 0) + (Math.random() - 0.5) * 0.001,
        last_longitude: (bus.last_longitude || 0) + (Math.random() - 0.5) * 0.001,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner className="h-full" />;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Camera Stream Telemetry</h2>
          <p className="text-xs text-slate-500 font-medium">Real-time computer vision processing from mobile bus inspection units</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
          <Activity className="w-3.5 h-3.5 animate-pulse text-blue-600" />
          <span>{buses.filter(b => b.status === 'ACTIVE').length} Active Bus Feeds Transmitting</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {buses.map(bus => (
          <div key={bus.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col hover:border-slate-300 transition-all">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{bus.bus_number}</h3>
                  <p className="text-xs text-slate-500 font-medium">{bus.route_name}</p>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                bus.camera_status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                'bg-red-50 text-red-700 border-red-200'
              }`}>
                {bus.camera_status === 'ONLINE' ? <Video className="w-3 h-3 text-emerald-600" /> : <VideoOff className="w-3 h-3 text-red-600" />}
                {bus.camera_status}
              </div>
            </div>
            
            {/* Simulated camera feed */}
            <div className="relative h-48 bg-slate-900 flex flex-col items-center justify-center">
              {bus.camera_status === 'ONLINE' ? (
                <>
                  <div className="absolute top-2 left-2 text-[10px] font-mono font-bold text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    REC • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 flex flex-col items-end">
                    <span>LAT: {bus.last_latitude?.toFixed(4)}</span>
                    <span>LNG: {bus.last_longitude?.toFixed(4)}</span>
                    <span>SPEED: {Math.floor(Math.random() * 20 + 20)} km/h</span>
                  </div>
                  
                  {/* Bounding Box for Vision AI */}
                  {Math.random() > 0.4 && (
                    <div className="absolute border-2 border-red-500 rounded-lg w-20 h-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-red-500/30">
                      <div className="absolute -top-5 left-[-2px] bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-t tracking-wider uppercase">
                        POTHOLE (94%)
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-500 gap-2">
                  <AlertCircle className="w-8 h-8 text-slate-600" />
                  <span className="text-xs font-semibold">Camera Stream Disconnected</span>
                </div>
              )}
            </div>
            
            <div className="p-3.5 bg-slate-50/80 flex-1 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Latest AI Detections:</span>
              <span className="font-bold text-slate-900">Pothole (2 mins ago)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
