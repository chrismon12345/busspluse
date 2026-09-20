import { useState, useEffect } from 'react';
import { Bus, Play, Pause, RotateCcw, AlertTriangle, X, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';

interface BusSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetectionAdded: () => void;
}

export default function BusSimulatorModal({ isOpen, onClose, onDetectionAdded }: BusSimulatorModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(15);
  const [currentSpeed, setCurrentSpeed] = useState(38);
  const [detectionsCount, setDetectionsCount] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(async () => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 5;
      });

      setCurrentSpeed(Math.floor(32 + Math.random() * 12));

      // Randomly trigger road hazard detection during trip
      if (Math.random() > 0.45) {
        const hazards = [
          { type: 'POTHOLE', label: '🕳️ Deep Pothole', severity: 'CRITICAL', conf: 0.94 },
          { type: 'WATERLOGGING', label: '🌊 Severe Waterlogging', severity: 'HIGH', conf: 0.89 },
          { type: 'ZEBRA_CROSSING_DAMAGE', label: '🦓 Faded Zebra Marking', severity: 'MEDIUM', conf: 0.91 },
          { type: 'BROKEN_STREETLIGHT', label: '💡 Damaged Streetlight', severity: 'HIGH', conf: 0.86 }
        ];
        const h = hazards[Math.floor(Math.random() * hazards.length)];

        setCurrentEvent(`AI Flagged: ${h.label} (${(h.conf * 100).toFixed(0)}% Conf)`);
        setDetectionsCount(c => c + 1);

        await apiService.createDetection({
          bus_id: 2,
          issue_type: h.type as any,
          severity: h.severity as any,
          latitude: 10.0150 + (Math.random() * 0.01),
          longitude: 76.3400 + (Math.random() * 0.01),
          confidence: h.conf,
          image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80',
          timestamp: new Date().toISOString()
        });

        onDetectionAdded();
        setTimeout(() => setCurrentEvent(null), 3000);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying, onDetectionAdded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Interactive Bus Inspection Drive Simulator</h3>
              <p className="text-xs text-blue-100 font-medium">Route #102: Aluva → Edapally → Fort Kochi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Simulated Video Feed Window */}
          <div className="relative h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-4 shadow-inner">
            {/* Live Status Overlay */}
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>CAM STREAM ONLINE</span>
              </div>
              <div className="px-3 py-1 bg-slate-900/80 rounded-full text-xs font-mono font-bold text-blue-300 border border-slate-700">
                SPEED: {currentSpeed} KM/H
              </div>
            </div>

            {/* AI Visual Box Overlay */}
            {currentEvent ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="border-4 border-red-500 bg-red-500/10 rounded-2xl p-4 animate-pulse flex flex-col items-center gap-1 shadow-2xl">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentEvent}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs font-semibold z-10 my-auto">
                {isPlaying ? '🚌 Bus Scanning Road Ahead... AI Vision Model Active' : 'Press Start Simulation to drive bus along inspection route.'}
              </div>
            )}

            {/* Progress Route Footer */}
            <div className="z-10 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Route Progress</span>
              <span className="font-bold text-blue-400">{progress}% Completed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>

          {/* Statistics summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Trip Detections</span>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">{detectionsCount} Hazards</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] font-bold text-blue-600 uppercase">Camera Status</span>
              <div className="text-xl font-extrabold text-blue-900 mt-0.5">30 FPS 1080p</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">GPS Accuracy</span>
              <div className="text-xl font-extrabold text-emerald-900 mt-0.5">± 1.2 meters</div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              setProgress(0);
              setDetectionsCount(0);
              setIsPlaying(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset Trip
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md transition-all ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start Bus Drive Inspection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
