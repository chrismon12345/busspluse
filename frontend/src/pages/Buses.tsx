import { useEffect, useState } from 'react';
import { Bus as BusType } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Bus, MapPin, Clock, Video, VideoOff } from 'lucide-react';

export default function Buses() {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getBuses().then(data => {
      setBuses(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner className="h-full" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Public Transit Bus Fleet</h2>
          <p className="text-xs text-slate-500 font-medium">Mobile road-inspection camera equipment status & route telemetry</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg p-2 outline-none shadow-xs">
            <option>All Fleet Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map(bus => (
          <div key={bus.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-xs">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{bus.bus_number}</h3>
                  <span className="text-xs font-mono text-slate-500">{bus.registration_number}</span>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider ${
                bus.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {bus.status}
              </span>
            </div>
            
            <div className="space-y-2.5 mb-5 flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{bus.route_name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last telemetry ping: {new Date(bus.last_seen || '').toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <div className="text-slate-500 font-medium">Operator: <span className="font-bold text-slate-800">{bus.operator}</span></div>
              <div className={`flex items-center gap-1.5 font-bold ${
                bus.camera_status === 'ONLINE' ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {bus.camera_status === 'ONLINE' ? <Video className="w-3.5 h-3.5 text-emerald-600" /> : <VideoOff className="w-3.5 h-3.5 text-red-600" />}
                Camera {bus.camera_status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
