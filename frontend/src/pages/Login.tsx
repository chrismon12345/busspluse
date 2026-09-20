import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('authority');
  const [email, setEmail] = useState('official@busplus.gov.in');
  const [password, setPassword] = useState('official123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'authority') {
      setEmail('official@busplus.gov.in');
      setPassword('official123');
    } else {
      setEmail('operator@busplus.transit');
      setPassword('transit123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole, email);
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img src="/logo.png" alt="BusPluse" className="h-12 w-auto object-contain" />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Road Infrastructure Monitoring Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Dual Portal Segmented Control */}
          <div className="mb-6">
            <div className="relative bg-slate-100 p-1 rounded-lg grid grid-cols-2">
              {/* Sliding Indicator */}
              <div
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-md shadow-xs transition-transform duration-200 ease-out"
                style={{
                  transform: selectedRole === 'operator' ? 'translateX(100%)' : 'translateX(0%)',
                }}
              />
              <button
                type="button"
                onClick={() => handleRoleSelect('authority')}
                className={`relative z-10 py-2 text-xs sm:text-sm text-center transition-colors cursor-pointer ${
                  selectedRole === 'authority'
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                Municipal Authority
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('operator')}
                className={`relative z-10 py-2 text-xs sm:text-sm text-center transition-colors cursor-pointer ${
                  selectedRole === 'operator'
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                Fleet Operator
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {selectedRole === 'authority' ? 'Official Government Email' : 'Operator Account ID / Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400 transition-colors"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400 transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-white text-sm transition-colors cursor-pointer disabled:opacity-60 ${
                selectedRole === 'authority'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to {selectedRole === 'authority' ? 'Authority Portal' : 'Fleet Operations'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Subtle Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2024 BusPluse • Kochi Municipal Corporation
        </p>
      </div>
    </div>
  );
}
