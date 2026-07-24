import React, { useState } from 'react';
import { Microscope, Heart, Building2, Lock, ArrowRight, User } from 'lucide-react';
import { Portal } from '../App'; // Wait, Portal type is defined in App.tsx

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
  const [error, setError] = useState(false);

  const credentials = {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsers = credentials[activePortal];
    const isValid = validUsers.some(creds => creds.user === username && creds.pass === password);
    
    if (isValid) {
      setError(false);
      onLogin(activePortal);
    } else {
      setError(true);
    }
  };

  // Pre-fill credentials helper
  const preFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <Microscope className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">GenomeSecure</h2>
          <p className="mt-2 text-sm text-zinc-500 font-medium tracking-wide uppercase">Privacy-Preserving Platform</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex p-1 bg-zinc-100 rounded-lg mb-8">
            <button
              onClick={() => { setActivePortal('researcher'); setError(false); setUsername(''); setPassword(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                activePortal === 'researcher' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Microscope className="w-4 h-4" />
              Researcher
            </button>
            <button
              onClick={() => { setActivePortal('patient'); setError(false); setUsername(''); setPassword(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                activePortal === 'patient' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              Patient
            </button>
            <button
              onClick={() => { setActivePortal('institution'); setError(false); setUsername(''); setPassword(''); }}
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
                  placeholder={credentials[activePortal][0].user}
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
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                Invalid credentials. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <div className="space-y-3">
              {credentials[activePortal].map((cred, idx) => (
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
