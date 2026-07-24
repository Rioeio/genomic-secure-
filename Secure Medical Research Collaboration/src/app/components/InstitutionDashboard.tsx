import { Database, Users, TrendingUp, Shield, Activity, Award } from 'lucide-react';
import { mockHospitals } from '../mockData';

export function InstitutionDashboard() {
  const hospital = mockHospitals[0];

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Institution Dashboard</h1>
            <p className="mt-1.5 text-sm text-zinc-500">{hospital.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Database className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Genomic Samples</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">{hospital.genomicSamplesCount.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-1.5">From {hospital.patientsCount.toLocaleString()} patients</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Activity className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Active Projects</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">{hospital.researchProjects}</p>
            <p className="text-xs text-zinc-500 mt-1.5">+3 this month</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Shield className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Privacy Budget Used</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">{Math.round(hospital.privacyBudgetUsed * 100)}%</p>
            <div className="mt-2.5 w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
              <div
                className="bg-zinc-900 h-full rounded-full"
                style={{ width: `${hospital.privacyBudgetUsed * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                <Award className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">Research Impact</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">High</p>
            <p className="text-xs text-zinc-500 mt-1.5">Contributing to science</p>
          </div>
        </div>

        {/* Data Contributions */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <Database className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Data Contributions</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Available Data Types</p>
                <div className="space-y-2.5">
                  {['Genomic Variants', 'Clinical Outcomes', 'Family History', 'Demographics', 'Lab Results'].map(type => (
                    <div key={type} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></div>
                      <span className="text-sm font-medium text-zinc-700">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Data Quality Metrics</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-600">Completeness</span>
                      <span className="text-zinc-900">93%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
                      <div className="bg-zinc-800 h-full rounded-full" style={{ width: '93%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-600">Accuracy</span>
                      <span className="text-zinc-900">96%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
                      <div className="bg-zinc-600 h-full rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-600">Diversity</span>
                      <span className="text-zinc-900">87%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 border border-zinc-200 overflow-hidden">
                      <div className="bg-zinc-400 h-full rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Contribution Stats</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-600">Total Queries</span>
                    <span className="font-semibold text-zinc-900">1,247</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-600">Avg Response Time</span>
                    <span className="font-semibold text-zinc-900">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-600">Collaboration Partners</span>
                    <span className="font-semibold text-zinc-900">12</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                    <span className="text-zinc-600">Publications</span>
                    <span className="font-semibold text-zinc-900">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Budget Management */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <Shield className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Privacy Budget Management</h2>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Current Privacy Budget</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {hospital.privacyBudgetUsed.toFixed(2)} <span className="text-zinc-400 font-normal text-lg">/ {hospital.privacyBudgetTotal.toFixed(2)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Remaining Budget</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {(hospital.privacyBudgetTotal - hospital.privacyBudgetUsed).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2 border border-zinc-300 overflow-hidden">
                <div
                  className="bg-zinc-900 h-full rounded-full transition-all"
                  style={{ width: `${(hospital.privacyBudgetUsed / hospital.privacyBudgetTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-zinc-200 rounded-lg bg-white">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Budget Allocation by Project</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-50">
                    <span className="text-zinc-700 font-medium">Cancer Genomics</span>
                    <span className="font-mono text-zinc-600">0.15</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-50">
                    <span className="text-zinc-700 font-medium">Cardiovascular Study</span>
                    <span className="font-mono text-zinc-600">0.12</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-50">
                    <span className="text-zinc-700 font-medium">Alzheimer's Research</span>
                    <span className="font-mono text-zinc-600">0.15</span>
                  </div>
                </div>
              </div>
              <div className="p-5 border border-zinc-200 rounded-lg bg-white">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Privacy Guarantees</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                    <span className="text-zinc-700 font-medium">Differential Privacy Enabled</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                    <span className="text-zinc-700 font-medium">No Raw Data Exposure</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                    <span className="text-zinc-700 font-medium">Audit Logs Maintained</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Impact */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-100 pb-4">
            <TrendingUp className="w-5 h-5 text-zinc-900" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Research Impact</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Publications Enabled</p>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">8</p>
              <p className="text-xs text-zinc-500 mt-1.5">In peer-reviewed journals</p>
            </div>
            <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Discoveries Made</p>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">12</p>
              <p className="text-xs text-zinc-500 mt-1.5">Novel genetic associations</p>
            </div>
            <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Patients Helped</p>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">~50K</p>
              <p className="text-xs text-zinc-500 mt-1.5">Through research insights</p>
            </div>
          </div>

          <div className="mt-6 p-5 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-sm font-semibold tracking-tight text-zinc-900 mb-3">Recent Achievements</p>
            <ul className="space-y-3 text-sm text-zinc-700">
              <li className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Contributed to breakthrough in rare disease diagnosis <span className="text-zinc-500">(March 2026)</span></span>
              </li>
              <li className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Enabled multi-institutional cancer genomics study with 200K+ samples</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Maintained 100% patient privacy compliance across all research projects</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
