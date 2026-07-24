import { useState, useEffect } from 'react';
import { Users, Database, TrendingUp, CheckCircle, Search, Sparkles } from 'lucide-react';
import { ResearchStudy, DatasetMetadata } from '../types';

interface DiscoverPartnersProps {
  study: ResearchStudy;
  datasets: DatasetMetadata[];
}

export function DiscoverPartners({ study, datasets }: DiscoverPartnersProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedDatasets, setMatchedDatasets] = useState<(DatasetMetadata & { matchScore: number })[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  useEffect(() => {
    // Simulate discovery process
    setIsSearching(true);
    setTimeout(() => {
      const matched = datasets
        .map(dataset => {
          const dataTypeMatches = study.dataRequirements.filter(req =>
            dataset.dataTypes.includes(req)
          ).length;
          const matchScore = (dataTypeMatches / study.dataRequirements.length) * 100;
          return { ...dataset, matchScore };
        })
        .filter(dataset => dataset.matchScore > 30)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedDatasets(matched);
      setIsSearching(false);
    }, 2000);
  }, [study, datasets]);

  const togglePartner = (hospitalId: string) => {
    setSelectedPartners(prev =>
      prev.includes(hospitalId)
        ? prev.filter(id => id !== hospitalId)
        : [...prev, hospitalId]
    );
  };

  const calculateStatisticalPower = () => {
    const totalSamples = matchedDatasets
      .filter(d => selectedPartners.includes(d.hospitalId))
      .reduce((sum, d) => sum + d.sampleSize, 0);
    return Math.min(0.95, 0.5 + (totalSamples / 200000));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-zinc-200 p-8 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
          <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
            <Users className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Discover Research Partners</h2>
            <p className="text-sm text-zinc-500 mt-1">AI-powered dataset matching for: <span className="font-medium text-zinc-900">{study.title}</span></p>
          </div>
        </div>

        {/* Research Discovery Agent Status */}
        <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-zinc-700" />
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-tight text-zinc-900">Research Discovery Agent</p>
              <p className="text-sm text-zinc-600 mt-0.5">
                {isSearching
                  ? 'Analyzing metadata across participating institutions...'
                  : `Found ${matchedDatasets.length} compatible datasets`}
              </p>
            </div>
            {isSearching && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-900"></div>
            )}
          </div>
        </div>
      </div>

      {/* Data Requirements */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-6 shadow-sm">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900 mb-4 uppercase tracking-wider">Study Requirements</h3>
        <div className="flex flex-wrap gap-2">
          {study.dataRequirements.map((req) => (
            <span
              key={req}
              className="px-3 py-1 bg-zinc-100 text-zinc-800 rounded-md text-xs font-medium border border-zinc-200"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Matched Datasets */}
      {!isSearching && (
        <>
          <div className="space-y-4 mb-6">
            {matchedDatasets.map((dataset) => {
              const isSelected = selectedPartners.includes(dataset.hospitalId);
              return (
                <div
                  key={dataset.hospitalId}
                  className={`bg-white rounded-lg border transition-all ${
                    isSelected
                      ? 'border-zinc-900 ring-1 ring-zinc-900 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{dataset.hospitalName}</h3>
                          <span className="px-2.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-md text-xs font-medium">
                            {Math.round(dataset.matchScore)}% match
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Sample Size</p>
                            <p className="font-semibold text-zinc-900">{dataset.sampleSize.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Diversity Score</p>
                            <p className="font-semibold text-zinc-900">{Math.round(dataset.demographicDiversity * 100)}%</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Data Quality</p>
                            <p className="font-semibold text-zinc-900">{Math.round(dataset.qualityScore * 100)}%</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePartner(dataset.hospitalId)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm ${
                          isSelected
                            ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        {isSelected ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Selected
                          </div>
                        ) : (
                          'Select'
                        )}
                      </button>
                    </div>

                    {/* Available Data Types */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
                      {dataset.dataTypes.map((dataType) => {
                        const isRequired = study.dataRequirements.includes(dataType);
                        return (
                          <span
                            key={dataType}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                              isRequired
                                ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                                : 'bg-white border-zinc-200 text-zinc-500'
                            }`}
                          >
                            {dataType}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistical Power Estimate */}
          {selectedPartners.length > 0 && (
            <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-5 border-b border-zinc-100 pb-3">Collaboration Estimate</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-zinc-500 text-sm font-medium mb-1">Selected Partners</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">{selectedPartners.length}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-medium mb-1">Total Sample Size</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {matchedDatasets
                      .filter(d => selectedPartners.includes(d.hospitalId))
                      .reduce((sum, d) => sum + d.sampleSize, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-medium mb-1">Statistical Power</p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {Math.round(calculateStatisticalPower() * 100)}%
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-100">
                <button className="w-full px-6 py-3 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm">
                  Send Collaboration Invitations
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
