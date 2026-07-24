import { useState } from 'react';
import { FileText, Database, Shield, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { ResearchStudy } from '../types';

interface DefineStudyProps {
  onCreateStudy: (study: ResearchStudy) => void;
}

export function DefineStudy({ onCreateStudy }: DefineStudyProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researcher: 'Dr. Manoj G',
    institution: 'SAEC Bio Genomics',
    dataRequirements: ['Genomic Variants', 'Clinical Outcomes'] as string[],
    privacyLevel: 'high' as 'high' | 'medium' | 'standard',
  });

  const availableDataTypes = [
    'Genomic Variants (Ensembl GRCh38)',
    'ClinVar Pathogenicity Records',
    'Whole Exome Sequencing (WES)',
    'Whole Genome Sequencing (WGS)',
    'Clinical Outcomes',
    'Family History',
    'Demographics',
    'Cardiac Imaging',
    'Diagnostic Records',
    'Pharmacogenomic Profiles',
  ];

  // Pre-configured open-source genomic study templates for researchers
  const openSourceTemplates = [
    {
      title: 'Ensembl BRCA1/2 Hereditary Breast & Ovarian Cancer Study',
      description: 'Federated GWAS & variant classification across Chr 17 & Chr 13 using Ensembl GRCh38 & ClinVar open-source datasets.',
      dataRequirements: ['Genomic Variants (Ensembl GRCh38)', 'ClinVar Pathogenicity Records', 'Clinical Outcomes'],
      privacyLevel: 'high' as const
    },
    {
      title: 'TCF7L2 & PPARG Multi-Cohort Type 2 Diabetes GWAS',
      description: 'Polygenic risk score modeling for T2D susceptibility across multi-center biobank records (dbSNP & gnomAD).',
      dataRequirements: ['Genomic Variants (Ensembl GRCh38)', 'Whole Genome Sequencing (WGS)', 'Clinical Outcomes'],
      privacyLevel: 'medium' as const
    },
    {
      title: 'APOE & PCSK9 Cardiovascular Polygenic Risk Prediction',
      description: 'Federated Machine Learning for early-onset coronary artery disease and lipid metabolism variants.',
      dataRequirements: ['Genomic Variants (Ensembl GRCh38)', 'Cardiac Imaging', 'Pharmacogenomic Profiles'],
      privacyLevel: 'high' as const
    }
  ];

  const applyTemplate = (template: typeof openSourceTemplates[0]) => {
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
      dataRequirements: template.dataRequirements,
      privacyLevel: template.privacyLevel
    });
  };

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
      title: formData.title || 'Untitled Genomic Study',
      description: formData.description || 'Federated genomic research study utilizing open-source Ensembl and dbSNP data.',
      researcher: formData.researcher || 'Dr. Researcher',
      institution: formData.institution || 'Genomic Consortium',
      dataRequirements: formData.dataRequirements,
      privacyLevel: formData.privacyLevel,
      status: 'active',
      partnersFound: 3,
      participatingHospitals: ['h1', 'h2', 'h3'],
      statisticalPower: 0.92,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onCreateStudy(newStudy);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quick Open-Source Study Templates */}
      <div className="bg-gradient-to-r from-teal-900 to-zinc-900 text-white rounded-lg p-6 shadow-md border border-teal-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold tracking-tight">Open-Source Genomic Research Templates</h3>
        </div>
        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
          Select a pre-configured template using real Ensembl (GRCh38), dbSNP, and ClinVar variant repositories to launch your federated study instantly:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {openSourceTemplates.map((t, idx) => (
            <div
              key={idx}
              onClick={() => applyTemplate(t)}
              className="bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 p-3.5 rounded-md cursor-pointer transition-all hover:border-teal-500 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-teal-300 mb-1 line-clamp-1">{t.title}</p>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{t.description}</p>
              </div>
              <span className="mt-3 inline-block text-[10px] text-teal-400 font-mono font-medium">Click to Load →</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-6">
          <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
            <FileText className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Define Research Study</h2>
            <p className="text-sm text-zinc-500 mt-1">Configure study parameters, open-source dataset requirements, and differential privacy guarantees</p>
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
                placeholder="e.g., Multi-Center BRCA1 Variant Association Study"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-2">
                Description & Research Methodology
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 shadow-sm text-sm"
                rows={4}
                placeholder="Describe the research objectives, target genomic markers, and federated learning approach..."
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
                  placeholder="Dr. Manoj G"
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
                  placeholder="SAEC Genomic Research Consortium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Data Requirements */}
          <div className="pt-6 border-t border-zinc-100">
            <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                Select Required Open-Source Genomic Datasets & Data Types
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
                      ? 'border-teal-700 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{dataType}</span>
                    {formData.dataRequirements.includes(dataType) && (
                      <CheckCircle className="w-4 h-4 text-teal-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500 font-medium">
              Selected: {formData.dataRequirements.length} dataset types
            </p>
          </div>

          {/* Privacy Level */}
          <div className="pt-6 border-t border-zinc-100">
            <label className="block text-sm font-semibold tracking-tight text-zinc-900 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                Differential Privacy Protection Target (Laplace Noise Calibration)
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
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-sm font-semibold mb-1 ${
                      formData.privacyLevel === level ? 'text-zinc-900' : 'text-zinc-700'
                    }`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)} Privacy
                    </div>
                    <div className={`text-xs font-medium ${
                      formData.privacyLevel === level ? 'text-teal-700' : 'text-zinc-400'
                    }`}>
                      {level === 'standard' && 'ε = 1.0 (Standard DP)'}
                      {level === 'medium' && 'ε = 0.5 (Enhanced DP)'}
                      {level === 'high' && 'ε = 0.1 (Strict Zero-Knowledge DP)'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              Create & Launch Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
