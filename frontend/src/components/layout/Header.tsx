import { Bell, Search, LogOut, ArrowRightLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, switchRole, logout } = useAuth();
  const path = location.pathname;

  const getPageTitle = () => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/monitoring')) return 'Live Monitoring';
    if (path.startsWith('/issues')) return 'Road Issues';
    if (path.startsWith('/map')) return 'Map';
    if (path.startsWith('/buses')) return 'Bus Fleet';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    return 'BusPlus';
  };

  return (
    <header className="h-14 bg-white flex items-center justify-between px-6 border-b border-slate-200 flex-shrink-0">
      <h1 className="text-sm font-semibold text-slate-800">{getPageTitle()}</h1>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-52 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white"
          />
        </div>

        <button
          title="Notifications"
          className="relative text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <button
          onClick={() => switchRole(user.role === 'authority' ? 'operator' : 'authority')}
          title="Switch Role"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Switch Role</span>
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-medium text-slate-700 leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400">{user.roleTitle}</div>
          </div>
          <div
            className={`w-7 h-7 rounded-full ${user.avatarBg} flex items-center justify-center text-white text-[11px] font-medium`}
          >
            {user.name.charAt(0)}
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            title="Sign Out"
            className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
