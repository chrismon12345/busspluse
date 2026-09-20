import { useEffect, useState } from 'react';
import IssueFilters from '../components/issues/IssueFilters';
import IssueTable from '../components/issues/IssueTable';
import { apiService } from '../services/api';
import { RoadIssue } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Issues() {
  const [issues, setIssues] = useState<RoadIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getIssues().then(data => {
      setIssues(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-7.5rem)]">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Road Infrastructure Defect Directory</h2>
        <p className="text-xs text-slate-500 font-medium">Comprehensive audit trail of AI-detected road hazards, pothole GPS clusters, and verification counts.</p>
      </div>
      
      <IssueFilters />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <IssueTable issues={issues} />
          </div>
        )}
      </div>
    </div>
  );
}
