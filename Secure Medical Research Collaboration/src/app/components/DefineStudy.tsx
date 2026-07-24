import { useState } from 'react';
import { FileText, Database, Shield, CheckCircle } from 'lucide-react';
import { ResearchStudy } from '../types';

interface DefineStudyProps {
  onCreateStudy: (study: ResearchStudy) => void;
}

export function DefineStudy({ onCreateStudy }: DefineStudyProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researcher: '',
    institution: '',
    dataRequirements: [] as string[],
    privacyLevel: 'high' as 'high' | 'medium' | 'standard',
  });

  const availableDataTypes = [
    'Genomic Variants',
    'Clinical Outcomes',
    'Family History',
    'Demographics',
    'ECG Data',
    'Cardiac Imaging',
    'Brain Imaging',
    'Cognitive Assessments',
    'Diagnostic Records',
    'Clinical Notes',
    'Lab Results',
  ];

  const toggleDataRequirement = (dataType: string) => {
    setFormData(prev => ({
      ...prev,
      dataRequirements: prev.dataRequirements.includes(dataType)
        ? prev.dataRequirements.filter(d => d !== dataType)
        : [...prev.dataRequirements, dataType],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudy: ResearchStudy = {
      id: `rs${Date.now()}`,
      ...formData,
      status: 'draft',
      partnersFound: 0,
      participatingHospitals: [],
      statisticalPower: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onCreateStudy(newStudy);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-6">
          <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
            <FileText className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Define Research Study</h2>
            <p className="text-sm text-zinc-500 mt-1">Create a new privacy-preserving research study</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-2">
                Study Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 shadow-sm text-sm"
                placeholder="e.g., Cancer Genomics Consortium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 shadow-sm text-sm"
                rows={4}
                placeholder="Describe the research objectives and methodology..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-2">
                  Lead Researcher
                </label>
                <input
                  type="text"
                  value={formData.researcher}
                  onChange={(e) => setFormData({ ...formData, researcher: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 shadow-sm text-sm"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 shadow-sm text-sm"
                  placeholder="Massachusetts General Hospital"
                  required
                />
              </div>
            </div>
          </div>

          {/* Data Requirements */}
          <div className="pt-6 border-t border-zinc-100">
            <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-zinc-500" />
                Data Requirements
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableDataTypes.map((dataType) => (
                <button
                  key={dataType}
                  type="button"
                  onClick={() => toggleDataRequirement(dataType)}
                  className={`px-4 py-2.5 rounded-md border text-left transition-all ${
                    formData.dataRequirements.includes(dataType)
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dataType}</span>
                    {formData.dataRequirements.includes(dataType) && (
                      <CheckCircle className="w-4 h-4 text-zinc-300" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500 font-medium">
              Selected: {formData.dataRequirements.length} data types
            </p>
          </div>

          {/* Privacy Level */}
          <div className="pt-6 border-t border-zinc-100">
            <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-500" />
                Privacy Level
              </div>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['standard', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, privacyLevel: level })}
                  className={`px-4 py-4 rounded-md border transition-all ${
                    formData.privacyLevel === level
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-sm font-semibold mb-1 ${
                      formData.privacyLevel === level ? 'text-zinc-900' : 'text-zinc-700'
                    }`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </div>
                    <div className={`text-xs font-medium ${
                      formData.privacyLevel === level ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {level === 'standard' && 'ε = 1.0'}
                      {level === 'medium' && 'ε = 0.5'}
                      {level === 'high' && 'ε = 0.1'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500 font-medium">
              Higher privacy levels add more noise but provide stronger guarantees
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm"
            >
              Create Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
