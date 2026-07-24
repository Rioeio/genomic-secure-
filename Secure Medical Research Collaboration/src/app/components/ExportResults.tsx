import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, X, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { ResearchStudy } from '../types';

interface ExportResultsProps {
  study: ResearchStudy;
  onClose: () => void;
}

export interface ExportData {
  studyMetadata: {
    studyId: string;
    title: string;
    researcher: string;
    institution: string;
    completedDate: string;
    participatingInstitutions: string[];
    totalSamples: number;
    privacyBudget: string;
  };
  privacyGuarantees: {
    mechanism: string;
    epsilonValue: number;
    deltaValue: number;
    noiseCalibration: string;
    kAnonymity: number;
    lDiversity: number;
  };
  statisticalSummary: {
    modelPerformance: {
      auc: number;
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
    };
    cohortStatistics: {
      totalParticipants: number;
      averageAge: string;
      genderDistribution: { male: number; female: number; other: number };
      ethnicityDiversity: number;
    };
    qualityMetrics: {
      sequencingDepth: string;
      coverageUniformity: number;
      variantCallQuality: number;
    };
  };
  genomicVariants: Array<{
    variantId: string;
    rsId: string;
    chromosome: string;
    position: string;
    gene: string;
    proteinChange: string;
    impact: string;
    clinicalSignificance: string;
    alleleFrequency: number;
    oddsRatio: number;
    confidenceInterval: string;
    pValue: string;
    privacyNoiseApplied: boolean;
  }>;
  pathwayAnalysis: Array<{
    pathwayId: string;
    pathwayName: string;
    genesInvolved: string[];
    enrichmentScore: number;
    adjustedPValue: string;
    biologicalProcess: string;
  }>;
  institutionalContributions: Array<{
    institutionId: string;
    institutionName: string;
    samplesContributed: number;
    dataTypes: string[];
    privacyBudgetUsed: number;
    computeContribution: number;
  }>;
  exportMetadata: {
    exportedBy: string;
    exportDate: string;
    dataVersion: string;
    privacyCompliance: string[];
    intendedUse: string;
  };
}

export function ExportResults({ study, onClose }: ExportResultsProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'summary'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Generate comprehensive de-identified export data
  const generateExportData = (): ExportData => {
    return {
      studyMetadata: {
        studyId: study.id,
        title: study.title,
        researcher: study.researcher,
        institution: study.institution,
        completedDate: '2026-03-20',
        participatingInstitutions: ['Mayo Clinic Research', 'Stanford Med Center', 'Johns Hopkins Medical'],
        totalSamples: 1204,
        privacyBudget: 'ε=0.3, δ=1e-5'
      },
      privacyGuarantees: {
        mechanism: 'Laplace Differential Privacy',
        epsilonValue: 0.3,
        deltaValue: 0.00001,
        noiseCalibration: 'Sensitivity-based with gradient clipping',
        kAnonymity: 5,
        lDiversity: 3
      },
      statisticalSummary: {
        modelPerformance: {
          auc: 0.87,
          accuracy: 0.84,
          precision: 0.82,
          recall: 0.79,
          f1Score: 0.805
        },
        cohortStatistics: {
          totalParticipants: 1204,
          averageAge: '62.4 ± 8.3 years',
          genderDistribution: { male: 578, female: 621, other: 5 },
          ethnicityDiversity: 0.76
        },
        qualityMetrics: {
          sequencingDepth: '125X mean coverage',
          coverageUniformity: 0.94,
          variantCallQuality: 0.96
        }
      },
      genomicVariants: [
        {
          variantId: 'VAR_001',
          rsId: 'rs80357713',
          chromosome: 'chr14',
          position: '73,638,311',
          gene: 'PSEN1',
          proteinChange: 'p.Ala246Glu',
          impact: 'High',
          clinicalSignificance: 'Pathogenic',
          alleleFrequency: 0.0042,
          oddsRatio: 3.42,
          confidenceInterval: '2.89-4.05',
          pValue: '1.3e-12',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_002',
          rsId: 'rs63750066',
          chromosome: 'chr21',
          position: '25,891,796',
          gene: 'APP',
          proteinChange: 'p.Val717Ile',
          impact: 'High',
          clinicalSignificance: 'Pathogenic',
          alleleFrequency: 0.0038,
          oddsRatio: 2.89,
          confidenceInterval: '2.41-3.47',
          pValue: '2.7e-10',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_003',
          rsId: 'rs104893877',
          chromosome: 'chr17',
          position: '46,048,540',
          gene: 'MAPT',
          proteinChange: 'p.Pro301Leu',
          impact: 'Moderate',
          clinicalSignificance: 'Likely Pathogenic',
          alleleFrequency: 0.0056,
          oddsRatio: 1.95,
          confidenceInterval: '1.62-2.35',
          pValue: '4.2e-7',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_004',
          rsId: 'rs113993960',
          chromosome: 'chr4',
          position: '89,724,099',
          gene: 'SNCA',
          proteinChange: 'p.Ala53Thr',
          impact: 'Modifier',
          clinicalSignificance: 'Uncertain Significance',
          alleleFrequency: 0.0089,
          oddsRatio: 1.12,
          confidenceInterval: '0.94-1.34',
          pValue: '0.047',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_005',
          rsId: 'rs63751039',
          chromosome: 'chr14',
          position: '73,681,963',
          gene: 'PSEN1',
          proteinChange: 'p.Met146Leu',
          impact: 'High',
          clinicalSignificance: 'Pathogenic',
          alleleFrequency: 0.0034,
          oddsRatio: 3.18,
          confidenceInterval: '2.67-3.78',
          pValue: '8.9e-11',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_006',
          rsId: 'rs121908231',
          chromosome: 'chr14',
          position: '73,674,327',
          gene: 'PSEN1',
          proteinChange: 'p.Ile143Thr',
          impact: 'High',
          clinicalSignificance: 'Pathogenic',
          alleleFrequency: 0.0029,
          oddsRatio: 2.76,
          confidenceInterval: '2.23-3.41',
          pValue: '3.4e-9',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_007',
          rsId: 'rs63750424',
          chromosome: 'chr1',
          position: '227,076,621',
          gene: 'PSEN2',
          proteinChange: 'p.Asn141Ile',
          impact: 'Moderate',
          clinicalSignificance: 'Likely Pathogenic',
          alleleFrequency: 0.0067,
          oddsRatio: 1.84,
          confidenceInterval: '1.51-2.24',
          pValue: '1.1e-6',
          privacyNoiseApplied: true
        },
        {
          variantId: 'VAR_008',
          rsId: 'rs121918389',
          chromosome: 'chr17',
          position: '46,052,687',
          gene: 'MAPT',
          proteinChange: 'p.Arg406Trp',
          impact: 'Moderate',
          clinicalSignificance: 'Likely Pathogenic',
          alleleFrequency: 0.0051,
          oddsRatio: 1.67,
          confidenceInterval: '1.38-2.03',
          pValue: '8.5e-6',
          privacyNoiseApplied: true
        }
      ],
      pathwayAnalysis: [
        {
          pathwayId: 'KEGG:05010',
          pathwayName: 'Alzheimer Disease Pathway',
          genesInvolved: ['APP', 'PSEN1', 'PSEN2', 'MAPT', 'APOE'],
          enrichmentScore: 4.73,
          adjustedPValue: '1.2e-8',
          biologicalProcess: 'Amyloid-beta processing and tau phosphorylation'
        },
        {
          pathwayId: 'GO:0006915',
          pathwayName: 'Apoptotic Process Regulation',
          genesInvolved: ['PSEN1', 'APP', 'MAPT'],
          enrichmentScore: 3.42,
          adjustedPValue: '5.6e-6',
          biologicalProcess: 'Programmed cell death in neural tissue'
        },
        {
          pathwayId: 'GO:0007215',
          pathwayName: 'Glutamate Receptor Signaling',
          genesInvolved: ['SNCA', 'PSEN1', 'APP'],
          enrichmentScore: 2.98,
          adjustedPValue: '2.3e-5',
          biologicalProcess: 'Excitatory synaptic transmission'
        },
        {
          pathwayId: 'REACTOME:R-HSA-5674404',
          pathwayName: 'GABA Receptor Activation',
          genesInvolved: ['MAPT', 'PSEN2'],
          enrichmentScore: 2.31,
          adjustedPValue: '0.00042',
          biologicalProcess: 'Inhibitory neurotransmission'
        }
      ],
      institutionalContributions: [
        {
          institutionId: 'h2',
          institutionName: 'Mayo Clinic Research',
          samplesContributed: 487,
          dataTypes: ['Whole Genome Sequencing', 'RNA-Seq', 'Neurology Records'],
          privacyBudgetUsed: 0.12,
          computeContribution: 0.38
        },
        {
          institutionId: 'h3',
          institutionName: 'Stanford Med Center',
          samplesContributed: 412,
          dataTypes: ['Single Cell Genomics', 'Spatial Transcriptomics', 'Oncology Records'],
          privacyBudgetUsed: 0.09,
          computeContribution: 0.35
        },
        {
          institutionId: 'h1',
          institutionName: 'Johns Hopkins Medical',
          samplesContributed: 305,
          dataTypes: ['Whole Exome Sequencing', 'Targeted Panels', 'Clinical Outcomes'],
          privacyBudgetUsed: 0.09,
          computeContribution: 0.27
        }
      ],
      exportMetadata: {
        exportedBy: study.researcher,
        exportDate: new Date().toISOString().split('T')[0],
        dataVersion: 'v2.4.1',
        privacyCompliance: ['HIPAA', 'GDPR', 'NIH Genomic Data Sharing Policy', 'ISO 27001'],
        intendedUse: 'Scientific publication and regulatory submission'
      }
    };
  };

  const handleExport = () => {
    setIsExporting(true);
    const exportData = generateExportData();

    setTimeout(() => {
      if (selectedFormat === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, `${study.id}_deidentified_results.json`);
      } else if (selectedFormat === 'csv') {
        const csvContent = convertToCSV(exportData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadFile(blob, `${study.id}_deidentified_results.csv`);
      } else if (selectedFormat === 'summary') {
        const summaryContent = generateTextSummary(exportData);
        const blob = new Blob([summaryContent], { type: 'text/plain' });
        downloadFile(blob, `${study.id}_executive_summary.txt`);
      }

      setIsExporting(false);
      setExportComplete(true);
    }, 1500);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: ExportData): string => {
    let csv = 'Study De-Identified Results Export\n\n';
    
    // Genomic Variants Table
    csv += 'GENOMIC VARIANTS\n';
    csv += 'Variant ID,rsID,Chromosome,Position,Gene,Protein Change,Impact,Clinical Significance,Allele Frequency,Odds Ratio,Confidence Interval,P-Value,Privacy Noise Applied\n';
    data.genomicVariants.forEach(v => {
      csv += `${v.variantId},${v.rsId},${v.chromosome},${v.position},${v.gene},${v.proteinChange},${v.impact},${v.clinicalSignificance},${v.alleleFrequency},${v.oddsRatio},${v.confidenceInterval},${v.pValue},${v.privacyNoiseApplied}\n`;
    });

    csv += '\n\nPATHWAY ANALYSIS\n';
    csv += 'Pathway ID,Pathway Name,Genes Involved,Enrichment Score,Adjusted P-Value,Biological Process\n';
    data.pathwayAnalysis.forEach(p => {
      csv += `${p.pathwayId},${p.pathwayName},"${p.genesInvolved.join('; ')}",${p.enrichmentScore},${p.adjustedPValue},${p.biologicalProcess}\n`;
    });

    csv += '\n\nINSTITUTIONAL CONTRIBUTIONS\n';
    csv += 'Institution Name,Samples Contributed,Data Types,Privacy Budget Used,Compute Contribution\n';
    data.institutionalContributions.forEach(i => {
      csv += `${i.institutionName},${i.samplesContributed},"${i.dataTypes.join('; ')}",${i.privacyBudgetUsed},${i.computeContribution}\n`;
    });

    csv += '\n\nSTATISTICAL SUMMARY\n';
    csv += `AUC,${data.statisticalSummary.modelPerformance.auc}\n`;
    csv += `Accuracy,${data.statisticalSummary.modelPerformance.accuracy}\n`;
    csv += `Precision,${data.statisticalSummary.modelPerformance.precision}\n`;
    csv += `Recall,${data.statisticalSummary.modelPerformance.recall}\n`;
    csv += `F1 Score,${data.statisticalSummary.modelPerformance.f1Score}\n`;

    csv += '\n\nPRIVACY GUARANTEES\n';
    csv += `Mechanism,${data.privacyGuarantees.mechanism}\n`;
    csv += `Epsilon,${data.privacyGuarantees.epsilonValue}\n`;
    csv += `Delta,${data.privacyGuarantees.deltaValue}\n`;
    csv += `K-Anonymity,${data.privacyGuarantees.kAnonymity}\n`;
    csv += `L-Diversity,${data.privacyGuarantees.lDiversity}\n`;

    return csv;
  };

  const generateTextSummary = (data: ExportData): string => {
    return `
==================================================================
        DE-IDENTIFIED GENOMIC RESEARCH RESULTS
           EXECUTIVE SUMMARY REPORT
==================================================================

Study Information
------------------------------------------------------------------
Title:                ${data.studyMetadata.title}
Study ID:             ${data.studyMetadata.studyId}
Principal Investigator: ${data.studyMetadata.researcher}
Lead Institution:     ${data.studyMetadata.institution}
Completion Date:      ${data.studyMetadata.completedDate}
Total Samples:        ${data.studyMetadata.totalSamples}

Privacy Guarantees
------------------------------------------------------------------
Privacy Mechanism:    ${data.privacyGuarantees.mechanism}
Epsilon (ε):          ${data.privacyGuarantees.epsilonValue}
Delta (δ):            ${data.privacyGuarantees.deltaValue}
K-Anonymity:          ${data.privacyGuarantees.kAnonymity}
L-Diversity:          ${data.privacyGuarantees.lDiversity}
Noise Calibration:    ${data.privacyGuarantees.noiseCalibration}

Model Performance Metrics
------------------------------------------------------------------
Area Under Curve (AUC):     ${data.statisticalSummary.modelPerformance.auc}
Accuracy:                   ${data.statisticalSummary.modelPerformance.accuracy}
Precision:                  ${data.statisticalSummary.modelPerformance.precision}
Recall:                     ${data.statisticalSummary.modelPerformance.recall}
F1 Score:                   ${data.statisticalSummary.modelPerformance.f1Score}

Cohort Statistics
------------------------------------------------------------------
Total Participants:   ${data.statisticalSummary.cohortStatistics.totalParticipants}
Average Age:          ${data.statisticalSummary.cohortStatistics.averageAge}
Gender Distribution:  Male: ${data.statisticalSummary.cohortStatistics.genderDistribution.male}, 
                      Female: ${data.statisticalSummary.cohortStatistics.genderDistribution.female}
Ethnicity Diversity:  ${data.statisticalSummary.cohortStatistics.ethnicityDiversity}

Key Genomic Findings
------------------------------------------------------------------
${data.genomicVariants.map((v, idx) => `
${idx + 1}. ${v.gene} (${v.rsId})
   Position: ${v.chromosome}:${v.position}
   Protein Change: ${v.proteinChange}
   Clinical Significance: ${v.clinicalSignificance}
   Odds Ratio: ${v.oddsRatio} (95% CI: ${v.confidenceInterval})
   P-Value: ${v.pValue}
   Impact: ${v.impact}
`).join('')}

Top Enriched Pathways
------------------------------------------------------------------
${data.pathwayAnalysis.map((p, idx) => `
${idx + 1}. ${p.pathwayName} (${p.pathwayId})
   Genes: ${p.genesInvolved.join(', ')}
   Enrichment Score: ${p.enrichmentScore}
   Adjusted P-Value: ${p.adjustedPValue}
   Process: ${p.biologicalProcess}
`).join('')}

Participating Institutions
------------------------------------------------------------------
${data.institutionalContributions.map((i, idx) => `
${idx + 1}. ${i.institutionName}
   Samples: ${i.samplesContributed}
   Privacy Budget Used: ${i.privacyBudgetUsed}
   Compute Contribution: ${(i.computeContribution * 100).toFixed(1)}%
`).join('')}

Export Metadata
------------------------------------------------------------------
Exported By:          ${data.exportMetadata.exportedBy}
Export Date:          ${data.exportMetadata.exportDate}
Data Version:         ${data.exportMetadata.dataVersion}
Privacy Compliance:   ${data.exportMetadata.privacyCompliance.join(', ')}
Intended Use:         ${data.exportMetadata.intendedUse}

==================================================================
This report contains de-identified, privacy-preserved genomic
research results. All data has been processed through differential
privacy mechanisms to ensure individual patient privacy while
maintaining statistical validity.
==================================================================
`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200">
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200">
              <Download className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Export De-Identified Results</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Privacy-preserved genomic research data</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Privacy Notice */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex gap-3">
            <Lock className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1">Privacy Guarantees Applied</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All exported data has been processed through Laplace differential privacy (ε=0.3, δ=1e-5) with k-anonymity=5 
                and l-diversity=3. Individual patient records cannot be reconstructed from this aggregated data.
              </p>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="text-sm font-semibold text-zinc-900 mb-3 block">Select Export Format</label>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFormat('json')}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'json'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedFormat === 'json' ? 'border-zinc-900' : 'border-zinc-300'
                }`}>
                  {selectedFormat === 'json' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                </div>
                <FileJson className="w-5 h-5 text-zinc-700" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">JSON Format</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Structured data for programmatic analysis</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedFormat('csv')}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'csv'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedFormat === 'csv' ? 'border-zinc-900' : 'border-zinc-300'
                }`}>
                  {selectedFormat === 'csv' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                </div>
                <FileSpreadsheet className="w-5 h-5 text-zinc-700" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">CSV Format</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Compatible with Excel and statistical software</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedFormat('summary')}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'summary'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedFormat === 'summary' ? 'border-zinc-900' : 'border-zinc-300'
                }`}>
                  {selectedFormat === 'summary' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                </div>
                <FileText className="w-5 h-5 text-zinc-700" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">Executive Summary</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Human-readable report for presentations</p>
                </div>
              </button>
            </div>
          </div>

          {/* Export Contents Preview */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Included Data Elements</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Study Metadata</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Privacy Guarantees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">8 Genomic Variants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Model Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Pathway Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Cohort Statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Institutional Contributions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
                <span className="text-zinc-700">Quality Metrics</span>
              </div>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1">Compliance & Usage</h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-2">
                This export is compliant with HIPAA, GDPR, and NIH Genomic Data Sharing Policy.
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                <strong>Intended Use:</strong> Scientific publication, regulatory submission, and collaborative research only.
              </p>
            </div>
          </div>

          {/* Success Message */}
          {exportComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-green-900 mb-1">Export Successful</h3>
                <p className="text-xs text-green-700">
                  De-identified results have been downloaded to your device.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
