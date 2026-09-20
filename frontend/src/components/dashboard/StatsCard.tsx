import { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'amber' | 'emerald' | 'purple';
  trend?: number;
  sparklineData?: number[];
}

const themeConfig: Record<StatsCardProps['color'], { borderLeft: string; iconBg: string }> = {
  blue: {
    borderLeft: 'border-l-[3px] border-l-blue-600',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  red: {
    borderLeft: 'border-l-[3px] border-l-red-600',
    iconBg: 'bg-red-50 text-red-600',
  },
  amber: {
    borderLeft: 'border-l-[3px] border-l-amber-500',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  emerald: {
    borderLeft: 'border-l-[3px] border-l-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  purple: {
    borderLeft: 'border-l-[3px] border-l-purple-600',
    iconBg: 'bg-purple-50 text-purple-600',
  },
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const [count, setCount] = useState(0);

  const conf = themeConfig[color] || themeConfig.blue;

  useEffect(() => {
    if (value <= 0) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${conf.borderLeft} p-4 shadow-sm flex items-start justify-between`}>
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{count.toLocaleString()}</h3>
          {trend !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      </div>
      <div className={`p-2 rounded-lg ${conf.iconBg}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
}
