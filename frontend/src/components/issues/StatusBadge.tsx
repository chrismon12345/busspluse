import { IssueStatus } from '../../types';

export default function StatusBadge({ status }: { status: IssueStatus }) {
  const styles: Record<IssueStatus, string> = {
    NEW: 'bg-blue-50 text-blue-700 border border-blue-200',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700 border border-amber-200',
    VERIFIED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    REPORTED: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    IN_PROGRESS: 'bg-orange-50 text-orange-700 border border-orange-200',
    RESOLVED: 'bg-green-50 text-green-700 border border-green-200',
    REJECTED: 'bg-slate-100 text-slate-600 border border-slate-200'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
