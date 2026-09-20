import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  Map as MapIcon,
  Bus,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const primaryNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/monitoring', icon: Radio, label: 'Live Monitoring' },
    { to: '/issues', icon: AlertTriangle, label: 'Road Issues' },
    { to: '/map', icon: MapIcon, label: 'GIS Heatmap' },
    { to: '/buses', icon: Bus, label: 'Bus Fleet' },
  ];

  const secondaryNavItems = [
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const renderNavItem = (item: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 py-2.5 px-3.5 text-[13px] font-medium transition-colors ${
          collapsed ? 'justify-center px-0 rounded-lg' : ''
        } ${
          isActive
            ? 'bg-blue-50 text-blue-700 border-l-[3px] border-blue-600 rounded-r-lg'
            : 'border-l-[3px] border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={`w-4 h-4 flex-shrink-0 transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
            }`}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  return (
    <div
      className={`bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Logo */}
      <div className="h-14 px-4 flex items-center border-b border-slate-100 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center">
            <img src="/logo.png" alt="BusPlus" className="h-8 w-auto object-contain" />
          </div>
        ) : (
          <img
            src="/logo.png"
            alt="BusPlus"
            className="h-8 w-8 object-contain mx-auto rounded-lg"
          />
        )}
      </div>

      {/* Role Banner: subtle inline text instead of card */}
      {!collapsed ? (
        <div className="px-4 pt-3 pb-1 flex items-center gap-2 text-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              user.role === 'authority' ? 'bg-blue-600' : 'bg-amber-500'
            }`}
          />
          <span className="font-medium text-slate-700 truncate">
            {user.role === 'authority' ? 'Municipal Director' : 'Fleet Supervisor'}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[11px] text-slate-400 truncate">{user.department}</span>
        </div>
      ) : (
        <div className="pt-3 pb-1 flex justify-center">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              user.role === 'authority' ? 'bg-blue-600' : 'bg-amber-500'
            }`}
            title={
              user.role === 'authority'
                ? `Municipal Director · ${user.department}`
                : `Fleet Supervisor · ${user.department}`
            }
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-0.5 px-3">
          {primaryNavItems.map(renderNavItem)}

          {/* Thin separator between nav groups */}
          <div className="my-2 border-t border-slate-100" />

          {secondaryNavItems.map(renderNavItem)}
        </nav>
      </div>

      {/* Bottom collapse button */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
