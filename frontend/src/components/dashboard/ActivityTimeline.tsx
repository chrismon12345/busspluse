import { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getActivity().then(data => {
      setActivities(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 h-full flex flex-col shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-extrabold text-slate-900">AI Verification Audit Trail</h3>
        <p className="text-xs text-slate-500 font-medium">Cross-bus detections & automated alerts</p>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 flex-shrink-0 ring-4 ring-blue-50" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-xs text-slate-900 truncate">{activity.type}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{activity.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
