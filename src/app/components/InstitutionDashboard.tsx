import { useState } from 'react';
import { Database, Users, TrendingUp, Shield, Activity, Award, Cpu, Lock, CheckCircle2, Server } from 'lucide-react';
import { mockHospitals } from '../mockData';

export function InstitutionDashboard() {
  const [selectedHospitalId, setSelectedHospitalId] = useState(mockHospitals[0].id);
  const hospital = mockHospitals.find(h => h.id === selectedHospitalId) || mockHospitals[0];

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Hospital Institution Node Dashboard</h1>
                <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold rounded-md flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-teal-600" />
                  Confidential Enclave Active
                </span>
              </div>
              <p className="text-sm text-zinc-500">Manage hospital node status, local data vaults, and Differential Privacy budget allocations</p>
            </div>

            {/* Institution Switcher */}
            <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
              {mockHospitals.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHospitalId(h.id)}
                  className={`px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${
                    selectedHospitalId === h.id
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Database className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Encrypted Vault
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Genomic Samples</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">{hospital.genomicSamplesCount.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-1.5">From {hospital.patientsCount.toLocaleString()} consented patient records</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Activity className="w-5 h-5 text-zinc-700" />
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200">
                FL Workers Online
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Active Consortium Projects</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">{hospital.researchProjects}</p>
            <p className="text-xs text-zinc-500 mt-1.5">+3 multi-center studies active</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center border border-emerald-200">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                ε Target = {hospital.privacyBudgetTotal}
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Privacy Budget Used</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">{Math.round(hospital.privacyBudgetUsed * 100)}%</p>
            <div className="mt-2.5 w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${hospital.privacyBudgetUsed * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Cpu className="w-5 h-5 text-zinc-700" />
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200">
                SGX Enclave
              </span>
            </div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Hardware Attestation</p>
            <p className="text-2xl font-semibold tracking-tight text-emerald-600 mt-1">Verified</p>
            <p className="text-xs text-zinc-500 mt-1.5">Intel SGX / AMD SEV Confidential Compute</p>
          </div>
        </div>

        {/* Data Contributions */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <Database className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{hospital.name} — Data Vault Metrics</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Available Genomic Formats</p>
                <div className="space-y-2.5">
                  {['Whole Genome Sequences (VCF/GRCh38)', 'ClinVar Pathogenicity Matrix', 'Exome Variants (WES)', 'Phenotype & Clinical Outcomes', 'RNA-Seq Count Matrix'].map(type => (
                    <div key={type} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-zinc-800">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Data Quality & Security Ratings</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-600">Completeness Score</span>
                      <span className="text-zinc-900 font-semibold">96%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-600">Variant Call Accuracy</span>
                      <span className="text-zinc-900 font-semibold">98.4%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full" style={{ width: '98.4%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-600">Demographic Diversity</span>
                      <span className="text-zinc-900 font-semibold">89%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
                      <div className="bg-zinc-600 h-full rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Node Execution Stats</p>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-600">Total FL Gradient Updates</span>
                    <span className="font-mono font-semibold text-zinc-900">1,842 iterations</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-600">Avg Compute Response</span>
                    <span className="font-mono font-semibold text-zinc-900">1.8s / batch</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-600">Confidential Node Enclave</span>
                    <span className="font-semibold text-emerald-600">Hardware SGX Attested</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-600">Zero Raw Exposure Audit</span>
                    <span className="font-semibold text-emerald-600">100% Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
