import { useState } from 'react';
import { Search, Plus, Play, FileText, Users, Lock, TrendingUp } from 'lucide-react';
import { mockStudies, mockDatasetMetadata } from '../mockData';
import { ResearchStudy, DatasetMetadata } from '../types';
import { DefineStudy } from './DefineStudy';
import { DiscoverPartners } from './DiscoverPartners';
import { FederatedAnalysis } from './FederatedAnalysis';

export function ResearcherPortal() {
  const [activeTab, setActiveTab] = useState<'studies' | 'new' | 'discover' | 'analysis' | 'results'>('studies');
  const [studies, setStudies] = useState<ResearchStudy[]>(mockStudies);
  const [selectedStudy, setSelectedStudy] = useState<ResearchStudy | null>(null);

  const handleCreateStudy = (study: ResearchStudy) => {
    setStudies([study, ...studies]);
    setActiveTab('studies');
  };

  const handleDiscoverPartners = (studyId: string) => {
    setSelectedStudy(studies.find(s => s.id === studyId) || null);
    setActiveTab('discover');
  };

  const handleRunAnalysis = (studyId: string) => {
    setSelectedStudy(studies.find(s => s.id === studyId) || null);
    setActiveTab('analysis');
  };

  const handleViewResults = (studyId: string) => {
    setSelectedStudy(studies.find(s => s.id === studyId) || null);
    setActiveTab('results');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-zinc-900 text-white';
      case 'discovering': return 'bg-zinc-200 text-zinc-800 border border-zinc-300';
      case 'draft': return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
      case 'completed': return 'bg-white text-zinc-900 border border-zinc-300';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Researcher Portal</h1>
              <p className="mt-1.5 text-sm text-zinc-500">Secure collaborative genomic research platform</p>
            </div>
            <button
              onClick={() => setActiveTab('new')}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Study
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('studies')}
              className={`py-3.5 px-1 border-b-2 transition-colors text-sm font-medium ${
                activeTab === 'studies'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                My Studies
              </div>
            </button>
            {activeTab === 'new' && (
              <button
                className="py-3.5 px-1 border-b-2 border-zinc-900 text-zinc-900 text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Define Study
                </div>
              </button>
            )}
            {activeTab === 'discover' && (
              <button
                className="py-3.5 px-1 border-b-2 border-zinc-900 text-zinc-900 text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Discover Partners
                </div>
              </button>
            )}
            {activeTab === 'analysis' && (
              <button
                className="py-3.5 px-1 border-b-2 border-zinc-900 text-zinc-900 text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Federated Analysis
                </div>
              </button>
            )}
            {activeTab === 'results' && (
              <button
                className="py-3.5 px-1 border-b-2 border-zinc-900 text-zinc-900 text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Study Results
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'studies' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm font-medium">Active Studies</p>
                    <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">
                      {studies.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                    <TrendingUp className="w-5 h-5 text-zinc-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm font-medium">Total Partners</p>
                    <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">
                      {studies.reduce((sum, s) => sum + s.partnersFound, 0)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                    <Users className="w-5 h-5 text-zinc-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm font-medium">Privacy Level</p>
                    <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">High</p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                    <Lock className="w-5 h-5 text-zinc-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm font-medium">Avg Power</p>
                    <p className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">
                      {Math.round(studies.reduce((sum, s) => sum + s.statisticalPower, 0) / studies.length * 100)}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
                    <TrendingUp className="w-5 h-5 text-zinc-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Studies List */}
            <div className="space-y-4">
              {studies.map((study) => (
                <div key={study.id} className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{study.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(study.status)}`}>
                          {study.status}
                        </span>
                      </div>
                      <p className="text-zinc-600 mb-4 text-sm leading-relaxed">{study.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Users className="w-4 h-4" />
                          <span>{study.partnersFound} partners</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Lock className="w-4 h-4" />
                          <span>{study.privacyLevel} privacy</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.round(study.statisticalPower * 100)}% power</span>
                        </div>
                      </div>
                      {study.results && (
                        <div className="mt-5 p-4 bg-zinc-50 rounded-md border border-zinc-200">
                          <p className="text-xs font-semibold text-zinc-900 mb-1 uppercase tracking-wider">Results Available</p>
                          <p className="text-sm text-zinc-700">{study.results}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      {study.status === 'draft' && (
                        <button
                          onClick={() => handleDiscoverPartners(study.id)}
                          className="px-4 py-2 bg-white text-zinc-900 border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-sm font-medium shadow-sm"
                        >
                          Discover Partners
                        </button>
                      )}
                      {(study.status === 'discovering' || study.status === 'active') && (
                        <button
                          onClick={() => handleRunAnalysis(study.id)}
                          className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium shadow-sm"
                        >
                          Run Analysis
                        </button>
                      )}
                      {study.status === 'completed' && study.results && (
                        <button 
                          onClick={() => handleViewResults(study.id)}
                          className="px-4 py-2 bg-white text-zinc-900 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors text-sm font-medium shadow-sm"
                        >
                          View Results
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <DefineStudy onCreateStudy={handleCreateStudy} />
        )}

        {activeTab === 'discover' && selectedStudy && (
          <DiscoverPartners study={selectedStudy} datasets={mockDatasetMetadata} />
        )}

        {activeTab === 'analysis' && selectedStudy && (
          <FederatedAnalysis study={selectedStudy} />
        )}

        {activeTab === 'results' && selectedStudy && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{selectedStudy.title} - Final Results</h2>
                  <p className="text-sm text-zinc-500 mt-1">Federated analysis completed across {selectedStudy.participatingHospitals.length} institutions.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium">
                  <Lock className="w-4 h-4" />
                  Privacy Budget: ε=0.3 Used
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Patients</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">1,204</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Model AUC</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">0.87</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Biomarkers Checked</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">23</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Significant Findings</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">8</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 mb-4">Top Significant Genomic Variants (Differentially Private)</h3>
                  <div className="border border-zinc-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-zinc-900">Variant ID</th>
                          <th className="px-4 py-3 font-semibold text-zinc-900">Gene</th>
                          <th className="px-4 py-3 font-semibold text-zinc-900">Impact</th>
                          <th className="px-4 py-3 font-semibold text-zinc-900">Clinical Significance</th>
                          <th className="px-4 py-3 font-semibold text-zinc-900">Effect Size (Odds Ratio)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        <tr>
                          <td className="px-4 py-3 font-mono text-zinc-600">rs80357713</td>
                          <td className="px-4 py-3 font-medium text-zinc-900">PSEN1</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">High</span></td>
                          <td className="px-4 py-3">Pathogenic</td>
                          <td className="px-4 py-3 font-mono">3.42</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-zinc-600">rs63750066</td>
                          <td className="px-4 py-3 font-medium text-zinc-900">APP</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">High</span></td>
                          <td className="px-4 py-3">Pathogenic</td>
                          <td className="px-4 py-3 font-mono">2.89</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-zinc-600">rs104893877</td>
                          <td className="px-4 py-3 font-medium text-zinc-900">MAPT</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs font-medium">Moderate</span></td>
                          <td className="px-4 py-3">Likely Pathogenic</td>
                          <td className="px-4 py-3 font-mono">1.95</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-zinc-600">rs113993960</td>
                          <td className="px-4 py-3 font-medium text-zinc-900">SNCA</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium">Modifier</span></td>
                          <td className="px-4 py-3">Uncertain Significance</td>
                          <td className="px-4 py-3 font-mono">1.12</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200">
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 mb-2">Privacy Guarantee Verification</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    All variant frequencies and odds ratios displayed above have been processed through the Privacy Guard Agent. 
                    Laplace noise was calibrated to ε=0.3 to prevent reconstruction attacks. Statistical significance remains intact (p &lt; 0.05 protected) while ensuring zero individual patient records can be inferred from these aggregated metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
