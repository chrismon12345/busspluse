import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoadIssue } from '../../types';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface IssueTableProps {
  issues: RoadIssue[];
}

export default function IssueTable({ issues }: IssueTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof RoadIssue>('last_detected_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof RoadIssue) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: keyof RoadIssue }) => {
    if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
          <tr>
            {['ID', 'Category', 'Severity', 'Verification Status', 'AI Confidence', 'Bus Count', 'Last Detected'].map((header) => {
              const fieldMap: Record<string, keyof RoadIssue> = {
                'ID': 'id', 'Category': 'issue_type', 'Severity': 'severity', 'Verification Status': 'status', 
                'AI Confidence': 'confidence', 'Bus Count': 'verification_count', 'Last Detected': 'last_detected_at'
              };
              const field = fieldMap[header];
              
              return (
                <th 
                  key={header} 
                  className="px-4 py-3 cursor-pointer group hover:bg-slate-100/60 transition-colors uppercase tracking-wider text-[11px]"
                  onClick={() => field && handleSort(field)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {field && <SortIcon field={field} />}
                  </div>
                </th>
              );
            })}
            <th className="px-4 py-3 font-bold text-right uppercase tracking-wider text-[11px]">Inspect</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {sortedIssues.map((issue) => (
            <tr 
              key={issue.id} 
              onClick={() => navigate(`/issues/${issue.id}`)}
              className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3 font-mono font-bold text-slate-500">#{issue.id}</td>
              <td className="px-4 py-3 font-extrabold text-slate-900 capitalize text-xs">
                {issue.issue_type.replace(/_/g, ' ')}
              </td>
              <td className="px-4 py-3"><SeverityBadge severity={issue.severity} /></td>
              <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
              <td className="px-4 py-3 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${issue.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-600 text-[11px]">{(issue.confidence * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td className="px-4 py-3 font-bold text-slate-900">{issue.verification_count} buses</td>
              <td className="px-4 py-3 text-slate-500 text-[11px] font-medium">
                {new Date(issue.last_detected_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </td>
              <td className="px-4 py-3 text-right">
                <button className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/60 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {sortedIssues.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-medium">
                No road issues match the selected filter criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
