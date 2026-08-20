import React, { useState } from 'react';
import { Microscope, Heart, Building2, Lock, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Portal } from '../App';
import { apiClient } from '../../services/apiClient';

export const LoginScreen = ({ 
  onLogin,
  activePortal,
  setActivePortal
}: { 
  onLogin: (portal: 'researcher' | 'patient' | 'institution') => void;
  activePortal: 'researcher' | 'patient' | 'institution';
  setActivePortal: (portal: 'researcher' | 'patient' | 'institution') => void;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credential hints — passwords are NOT stored here, only shown as UI hints.
  // Actual validation happens server-side via /auth/login.
  const demoHints = {
    researcher: [
      { name: 'Dr. Sarah Smith', user: 'dr.smith@genome.edu', pass: 'secure123' },
      { name: 'Dr. James Chen', user: 'j.chen@research.org', pass: 'secure123' }
    ],
    patient: [
      { name: 'Alice Walker', user: 'alice.w@email.com', pass: 'health123' },
      { name: 'Marcus Johnson', user: 'm.johnson@email.com', pass: 'health123' }
    ],
    institution: [
      { name: 'Mayo Clinic Admin', user: 'admin@mayoclinic.org', pass: 'admin123' },
      { name: 'Broad Institute', user: 'compliance@broad.edu', pass: 'admin123' }
    ]
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.login(username, password);
      // JWT token is now stored in apiClient automatically
      const userRole = response.user.role as 'researcher' | 'patient' | 'institution';
      setActivePortal(userRole);
      onLogin(userRole);
    } catch (err: any) {
      if (err.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.status === 0) {
        setError('Cannot reach the backend server. Is it running on port 8000?');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill credentials helper (for demo convenience only)
  const preFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <Microscope className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Med-Link</h2>
          <p className="mt-2 text-sm text-zinc-500 font-medium tracking-wide uppercase">Privacy-Preserving Platform</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex p-1 bg-zinc-100 rounded-lg mb-8">
            <button
              onClick={() => { setActivePortal('researcher'); setError(''); setUsername(''); setPassword(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                activePortal === 'researcher' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Microscope className="w-4 h-4" />
              Researcher
            </button>
            <button
              onClick={() => { setActivePortal('patient'); setError(''); setUsername(''); setPassword(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                activePortal === 'patient' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              Patient
            </button>
            <button
              onClick={() => { setActivePortal('institution'); setError(''); setUsername(''); setPassword(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                activePortal === 'institution' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Institution
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm bg-zinc-50/50 transition-colors"
                  placeholder={demoHints[activePortal][0].user}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm bg-zinc-50/50 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <p className="text-xs text-zinc-400 mb-3 font-medium uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-3">
              {demoHints[activePortal].map((cred, idx) => (
                <div 
                  key={idx}
                  onClick={() => preFill(cred.user, cred.pass)}
                  className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 border-dashed cursor-pointer hover:bg-zinc-100 transition-colors"
                >
                  <div className="text-sm font-medium text-zinc-900 mb-2">
                    {cred.name}
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600 mb-1">
                    <span className="font-medium text-zinc-900">Email:</span>
                    <span className="font-mono">{cred.user}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span className="font-medium text-zinc-900">Password:</span>
                    <span className="font-mono">{cred.pass}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
