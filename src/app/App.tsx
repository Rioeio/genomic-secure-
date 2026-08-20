import { useState } from 'react';
import { Microscope, Heart, Building2, LogOut, Cpu, ShieldCheck, UserCheck, Search, Database, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResearcherPortal } from './components/ResearcherPortal';
import { PatientPortal } from './components/PatientPortal';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { LoginScreen } from './components/LoginScreen';
import realGenomicVariants from './realGenomicDataset.json';
import { apiClient } from '../services/apiClient';

export type Portal = 'researcher' | 'patient' | 'institution';

export default function App() {
  const [activePortal, setActivePortal] = useState<Portal>('researcher');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const agentDetails = {
    fl: {
      name: 'Federated Learning Agent',
      icon: Cpu,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      algorithm: 'Federated Averaging (FedAvg)',
      description: 'Coordinates multi-institutional model training. Collects local PyTorch gradient weight updates (ΔW) from hospital nodes and performs weighted tensor aggregation without transferring raw patient data.',
      status: 'ACTIVE — Syncing 3 Hospital Enclaves',
      parameters: [
        { key: 'Global Model Architecture', val: '1D-CNN Genomic Classifier' },
        { key: 'Aggregation Protocol', val: 'Weighted FedAvg (N_k / N_total)' },
        { key: 'Connected Nodes', val: 'Metro General, St. Jude, Apex Biobank' }
      ]
    },
    privacy: {
      name: 'Privacy Guard Agent',
      icon: ShieldCheck,
      color: 'text-teal-400',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      algorithm: 'Laplace Differential Privacy (DP)',
      description: 'Calculates mathematical noise calibrated to sensitivity over epsilon (Noise ~ Laplace(0, Sensitivity/ε)). Prevents reconstruction and membership inference attacks on patient data.',
      status: 'GUARDING — Laplace Noise (ε=0.3, δ=1e-5)',
      parameters: [
        { key: 'Target Epsilon (ε)', val: '0.3 (Strict Privacy Guarantee)' },
        { key: 'Target Delta (δ)', val: '1e-5' },
        { key: 'Re-Id Risk Threshold', val: '< 3.4% Maximum Exposure' }
      ]
    },
    consent: {
      name: 'Consent Manager Agent',
      icon: UserCheck,
      color: 'text-purple-400',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      algorithm: 'Zero-Knowledge Dynamic Consent Filter',
      description: 'Enforces dynamic patient opt-in and opt-out preferences. Intercepts local training batch generation and immediately excludes samples when a patient revokes research consent.',
      status: 'VERIFYING — 42,650 Cohort Consent Vectors',
      parameters: [
        { key: 'Active Cohort Samples', val: '42,650 Verified Records' },
        { key: 'Revocation Sync Speed', val: 'Instantaneous (< 50ms)' },
        { key: 'Audit Protocol', val: 'Immutable Ledger Output' }
      ]
    },
    discovery: {
      name: 'Research Discovery Agent',
      icon: Search,
      color: 'text-sky-400',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      algorithm: 'Privacy-Preserving Statistical Power Estimator',
      description: 'Queries metadata schemas across hospital nodes to evaluate statistical power and cohort feasibility prior to launching federated training rounds.',
      status: 'IDLE — Statistical Power Estimated at 94%',
      parameters: [
        { key: 'Target Sample Feasibility', val: '35,000 Minimum Cohort' },
        { key: 'Matched Partners', val: '3 Medical Research Centers' },
        { key: 'Metadata Query Type', val: 'Zero-Exposure Metadata Homomorphic Match' }
      ]
    }
  };

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
    <div className="size-full flex flex-col bg-zinc-50 font-sans text-zinc-900 min-h-screen">
      {/* Platform Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-transparent flex items-center justify-center">
                <img src="/logo.png" alt="Med-Link Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900">Med-Link</h1>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                    OPEN SOURCE FRAMEWORK
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-medium tracking-wide">
                  Privacy-Preserving Federated Genomic Research Platform
                </p>
              </div>
            </div>

            {/* Portal Switcher & System Status */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
                <Database className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-zinc-900">{realGenomicVariants.length} Real Ensembl/ClinVar Variants Loaded</span>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
                <button
                  onClick={() => setActivePortal('researcher')}
                  className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-semibold ${
                    activePortal === 'researcher'
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Microscope className="w-3.5 h-3.5" />
                  Researcher Portal
                </button>
                <button
                  onClick={() => setActivePortal('patient')}
                  className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-semibold ${
                    activePortal === 'patient'
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  Patient App
                </button>
                <button
                  onClick={() => setActivePortal('institution')}
                  className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-semibold ${
                    activePortal === 'institution'
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Institution Node
                </button>
              </div>

              <div className="h-6 w-px bg-zinc-200"></div>
              <button
                onClick={() => { apiClient.logout(); setIsAuthenticated(false); }}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Log out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Agent Orchestration Live Bar */}
        <div className="bg-zinc-900 text-white border-t border-zinc-800 text-xs py-2 px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-zinc-200">MULTI-AGENT ENGINE:</span>
            </div>

            <div className="flex items-center gap-6 overflow-x-auto">
              <div 
                onClick={() => setSelectedAgent(agentDetails.fl)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer transition-colors group"
                title="Click to inspect Federated Learning Agent"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium underline decoration-emerald-500/50">FL Agent:</span>
                <span className="text-zinc-400 group-hover:text-zinc-200">FedAvg Syncing</span>
              </div>

              <div 
                onClick={() => setSelectedAgent(agentDetails.privacy)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer transition-colors group"
                title="Click to inspect Privacy Guard Agent"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium underline decoration-teal-500/50">Privacy Guard:</span>
                <span className="text-zinc-400 group-hover:text-zinc-200">Laplace (ε=0.3)</span>
              </div>

              <div 
                onClick={() => setSelectedAgent(agentDetails.consent)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer transition-colors group"
                title="Click to inspect Consent Manager Agent"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium underline decoration-purple-500/50">Consent Agent:</span>
                <span className="text-zinc-400 group-hover:text-zinc-200">42,650 Verified</span>
              </div>

              <div 
                onClick={() => setSelectedAgent(agentDetails.discovery)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer transition-colors group"
                title="Click to inspect Research Discovery Agent"
              >
                <Search className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium underline decoration-sky-500/50">Discovery Agent:</span>
                <span className="text-zinc-400 group-hover:text-zinc-200">Power = 94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Portal Views */}
      <main className="flex-1 flex flex-col">
        {activePortal === 'researcher' && <ResearcherPortal />}
        {activePortal === 'patient' && <PatientPortal />}
        {activePortal === 'institution' && <InstitutionDashboard />}
      </main>

      {/* Agent Inspector Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-900 text-white p-6 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <selectedAgent.icon className={`w-5 h-5 ${selectedAgent.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{selectedAgent.algorithm}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Agent Role & Responsibilities</p>
                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-lg border border-zinc-200">
                  {selectedAgent.description}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Live Agent Runtime Parameters</p>
                <div className="space-y-2">
                  {selectedAgent.parameters.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-zinc-50 rounded-md border border-zinc-200 font-mono">
                      <span className="text-zinc-600 font-medium">{p.key}:</span>
                      <span className="font-semibold text-zinc-900">{p.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedAgent.status}</span>
              </div>
            </div>

            <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Footer */}
      <footer className="bg-white border-t border-zinc-200 text-xs text-zinc-500 py-4 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© 2026 Med-Link • Created by Manoj • Open-Source Federated Biomedical Framework</p>
          <div className="flex items-center gap-4">
            <span>Powered by PyTorch, Differential Privacy & Ensembl GRCh38 API</span>
            <a href="/realGenomicDataset.json" target="_blank" className="text-teal-600 hover:underline font-medium">
              View Real Ensembl VCF Dataset
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
