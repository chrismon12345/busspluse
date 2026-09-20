import { Severity } from '../../types';

export default function SeverityBadge({ severity }: { severity: Severity }) {
  const base = "px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border";
  
  const styles: Record<Severity, string> = {
    LOW: `${base} bg-emerald-50 text-emerald-700 border-emerald-200`,
    MEDIUM: `${base} bg-amber-50 text-amber-700 border-amber-200`,
    HIGH: `${base} bg-orange-50 text-orange-700 border-orange-200`,
    CRITICAL: `${base} bg-red-50 text-red-700 border-red-200 animate-pulse`
  };

  return (
    <span className={styles[severity]}>
      {severity}
    </span>
  );
}
