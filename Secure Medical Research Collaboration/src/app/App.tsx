import { useState } from 'react';
import { Microscope, Heart, Building2, LogOut } from 'lucide-react';
import { ResearcherPortal } from './components/ResearcherPortal';
import { PatientPortal } from './components/PatientPortal';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { LoginScreen } from './components/LoginScreen';

export type Portal = 'researcher' | 'patient' | 'institution';

export default function App() {
  const [activePortal, setActivePortal] = useState<Portal>('researcher');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  if (!isAuthenticated) {
    return (
      <LoginScreen
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        onLogin={(portal) => {
          setActivePortal(portal);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="size-full flex flex-col bg-zinc-50 font-sans text-zinc-900">
      {/* Main Navigation */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 text-white rounded-md flex items-center justify-center shadow-sm">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">GenomeSecure</h1>
                <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase mt-0.5">Privacy-Preserving Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                <button
                  onClick={() => setActivePortal('researcher')}
                  className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${
                    activePortal === 'researcher'
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Microscope className="w-4 h-4" />
                  Researcher
                </button>
                <button
                  onClick={() => setActivePortal('patient')}
                  className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${
                    activePortal === 'patient'
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Patient
                </button>
                <button
                  onClick={() => setActivePortal('institution')}
                  className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${
                    activePortal === 'institution'
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Institution
                </button>
              </div>
              <div className="h-6 w-px bg-zinc-200"></div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Content */}
      {activePortal === 'researcher' && <ResearcherPortal />}
      {activePortal === 'patient' && <PatientPortal />}
      {activePortal === 'institution' && <InstitutionDashboard />}
    </div>
  );
}
