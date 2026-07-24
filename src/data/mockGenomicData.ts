import { HospitalNode, PatientRecord, GenomicVariant, ResearchStudy, AgentInfo, AuditLog } from '../types/genomic';

export const MOCK_HOSPITAL_NODES: HospitalNode[] = [
  {
    id: 'node-1',
    name: 'Metro General Genomic Vault',
    code: 'HOSP-A',
    type: 'University Hospital',
    location: 'Boston, MA (Node #01)',
    datasetSize: 14250,
    status: 'ONLINE',
    privacyBudgetMax: 10.0,
    privacyBudgetUsed: 2.85,
    delta: 1e-5,
    localAccuracy: 94.2,
    encryptionKeyStatus: 'VERIFIED',
    lastGradientSync: '2 mins ago',
    hardware: 'NVIDIA H100 Tensor Cluster (Local)',
  },
  {
    id: 'node-2',
    name: 'St. Jude Children’s Genomic Research',
    code: 'HOSP-B',
    type: 'Cancer Research Center',
    location: 'Memphis, TN (Node #02)',
    datasetSize: 9800,
    status: 'ONLINE',
    privacyBudgetMax: 10.0,
    privacyBudgetUsed: 3.40,
    delta: 1e-5,
    localAccuracy: 92.8,
    encryptionKeyStatus: 'ROTATED',
    lastGradientSync: '1 min ago',
    hardware: 'Secure Enclave SGX-v2',
  },
  {
    id: 'node-3',
    name: 'Apex Precision Health & Biobank',
    code: 'HOSP-C',
    type: 'Biobank Lab',
    location: 'San Francisco, CA (Node #03)',
    datasetSize: 18600,
    status: 'ONLINE',
    privacyBudgetMax: 10.0,
    privacyBudgetUsed: 1.90,
    delta: 1e-5,
    localAccuracy: 95.6,
    encryptionKeyStatus: 'VERIFIED',
    lastGradientSync: 'Just now',
    hardware: 'AMD EPYC Confidential Compute',
  }
];

export const MOCK_AGENTS: AgentInfo[] = [
  {
    id: 'agent-fl',
    name: 'Federated Learning Agent',
    role: 'Coordinates distributed model updates (FedAvg) without raw data transfer.',
    status: 'ACTIVE',
    color: 'emerald',
    icon: 'Cpu',
    currentTask: 'Aggregating encrypted weights across 3 hospital nodes',
    processedCount: 1420,
  },
  {
    id: 'agent-privacy',
    name: 'Privacy Guard Agent',
    role: 'Calculates Laplace noise & enforces strict differential privacy (ε, δ) limits.',
    status: 'GUARDING',
    color: 'teal',
    icon: 'ShieldCheck',
    currentTask: 'Verifying Laplace noise (ε=0.5) on gradient tensor payload',
    processedCount: 3890,
  },
  {
    id: 'agent-consent',
    name: 'Consent Manager Agent',
    role: 'Enforces dynamic opt-in/opt-out patient policies in zero-knowledge space.',
    status: 'PROCESSING',
    color: 'purple',
    icon: 'UserCheck',
    currentTask: 'Filtering 42,650 cohort samples against active consent matrix',
    processedCount: 42650,
  },
  {
    id: 'agent-discovery',
    name: 'Research Discovery Agent',
    role: 'Scans institutional metadata to evaluate statistical power & cohort feasibility.',
    status: 'IDLE',
    color: 'cyan',
    icon: 'Search',
    currentTask: 'Ready for metadata queries across hospital nodes',
    processedCount: 840,
  }
];

export const MOCK_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'p-101',
    patientCode: 'PAT-88402',
    sampleId: 'GS-WGS-2026-88',
    genomeType: 'Whole Genome (WGS)',
    age: 44,
    gender: 'Female',
    condition: 'BRCA1/2 Predisposition Cohort',
    registeredDate: '2025-11-12',
    anonymizedHash: '0x8f4a...e91c',
    consents: {
      oncologyResearch: true,
      metabolicStudies: true,
      rareDiseases: false,
      cardiovascularResearch: true,
      commercialPharmaSharing: false,
    },
    auditTrail: [
      {
        id: 'aud-1',
        timestamp: '17:22:10',
        agentName: 'Consent Manager Agent',
        action: 'Verified Oncology Consent for FL Round #4',
        institution: 'St. Jude Children’s Research',
        privacyImpact: 'Zero Raw Exposure',
        status: 'ALLOWED'
      },
      {
        id: 'aud-2',
        timestamp: '16:45:00',
        agentName: 'Privacy Guard Agent',
        action: 'Applied Laplace Noise (ε=0.2) to summary stats',
        institution: 'Metro General Vault',
        privacyImpact: '+0.05 DP Budget Used',
        status: 'NOISE_INJECTED'
      }
    ]
  },
  {
    id: 'p-102',
    patientCode: 'PAT-92105',
    sampleId: 'GS-WES-2026-14',
    genomeType: 'Exome (WES)',
    age: 58,
    gender: 'Male',
    condition: 'Type 2 Diabetes GWAS Study',
    registeredDate: '2026-01-20',
    anonymizedHash: '0x3c1b...7a2d',
    consents: {
      oncologyResearch: true,
      metabolicStudies: true,
      rareDiseases: true,
      cardiovascularResearch: true,
      commercialPharmaSharing: true,
    },
    auditTrail: [
      {
        id: 'aud-3',
        timestamp: '17:15:40',
        agentName: 'Federated Learning Agent',
        action: 'Included sample tensor in Local Training Batch #128',
        institution: 'Apex Precision Health',
        privacyImpact: 'FedAvg Secure Aggregation',
        status: 'VERIFIED'
      }
    ]
  },
  {
    id: 'p-103',
    patientCode: 'PAT-74091',
    sampleId: 'GS-WGS-2026-99',
    genomeType: 'Whole Genome (WGS)',
    age: 36,
    gender: 'Female',
    condition: 'Hypertrophic Cardiomyopathy',
    registeredDate: '2026-03-05',
    anonymizedHash: '0x9d8e...11ab',
    consents: {
      oncologyResearch: false,
      metabolicStudies: false,
      rareDiseases: true,
      cardiovascularResearch: true,
      commercialPharmaSharing: false,
    },
    auditTrail: [
      {
        id: 'aud-4',
        timestamp: '15:30:12',
        agentName: 'Consent Manager Agent',
        action: 'Blocked Query for Commercial BioTech Project',
        institution: 'Metro General Vault',
        privacyImpact: 'Consent Policy Enforced',
        status: 'BLOCKED'
      }
    ]
  }
];

export const MOCK_STUDIES: ResearchStudy[] = [
  {
    id: 'study-1',
    title: 'Multi-Cohort GWAS on Type 2 Diabetes Susceptibility Variants',
    leadResearcher: 'Dr. Manoj G & Team Wisemen',
    targetDisease: 'Type 2 Diabetes',
    requiredSamples: 35000,
    currentSamples: 42650,
    status: 'TRAINING',
    privacyEpsilonTarget: 2.5,
    nodesParticipating: ['node-1', 'node-2', 'node-3'],
    roundsCompleted: 8,
    totalRounds: 10,
    finalAccuracy: 94.6,
    createdDate: '2026-07-20'
  },
  {
    id: 'study-2',
    title: 'Privacy-Preserving Deep Learning for BRCA1 Pathogenic Mutation Classification',
    leadResearcher: 'Dr. Elena Rostova',
    targetDisease: 'Breast & Ovarian Cancer',
    requiredSamples: 15000,
    currentSamples: 24050,
    status: 'COMPLETED',
    privacyEpsilonTarget: 1.8,
    nodesParticipating: ['node-1', 'node-2'],
    roundsCompleted: 15,
    totalRounds: 15,
    finalAccuracy: 97.2,
    createdDate: '2026-06-10'
  },
  {
    id: 'study-3',
    title: 'Federated Risk Prediction Model for Early-Onset Coronary Artery Disease',
    leadResearcher: 'Dr. Marcus Vance',
    targetDisease: 'Cardiovascular Disease',
    requiredSamples: 20000,
    currentSamples: 18600,
    status: 'DISCOVERING',
    privacyEpsilonTarget: 3.0,
    nodesParticipating: ['node-1', 'node-3'],
    roundsCompleted: 0,
    totalRounds: 12,
    finalAccuracy: 0.0,
    createdDate: '2026-07-24'
  }
];

// Mock GWAS Manhattan Plot dataset across chromosomes 1 to 22
export const MOCK_MANHATTAN_VARIANTS: GenomicVariant[] = [
  { rsId: 'rs1801282', chromosome: 'Chr 3', position: 1234567, gene: 'PPARG', pValue: 14.2, oddsRatio: 1.45, riskAllele: 'Pro12Ala', trait: 'Type 2 Diabetes', category: 'Significant' },
  { rsId: 'rs7903146', chromosome: 'Chr 10', position: 114758349, gene: 'TCF7L2', pValue: 22.8, oddsRatio: 1.72, riskAllele: 'T', trait: 'Type 2 Diabetes', category: 'Significant' },
  { rsId: 'rs13266634', chromosome: 'Chr 8', position: 118185025, gene: 'SLC30A8', pValue: 11.5, oddsRatio: 1.32, riskAllele: 'C', trait: 'Type 2 Diabetes', category: 'Significant' },
  { rsId: 'rs10811661', chromosome: 'Chr 9', position: 22134000, gene: 'CDKN2A/B', pValue: 9.8, oddsRatio: 1.28, riskAllele: 'T', trait: 'Glucose Regulation', category: 'Significant' },
  { rsId: 'rs8050136', chromosome: 'Chr 16', position: 53820521, gene: 'FTO', pValue: 18.4, oddsRatio: 1.55, riskAllele: 'A', trait: 'Adiposity & BMI', category: 'Significant' },
  { rsId: 'rs2237892', chromosome: 'Chr 11', position: 2800000, gene: 'KCNQ1', pValue: 8.9, oddsRatio: 1.24, riskAllele: 'C', trait: 'Insulin Secretion', category: 'Significant' },
  
  // Suggestive variants
  { rsId: 'rs458291', chromosome: 'Chr 1', position: 450123, gene: 'NOTCH2', pValue: 6.4, oddsRatio: 1.15, riskAllele: 'G', trait: 'Pancreatic Islet', category: 'Suggestive' },
  { rsId: 'rs1121980', chromosome: 'Chr 2', position: 890123, gene: 'THADA', pValue: 5.9, oddsRatio: 1.12, riskAllele: 'A', trait: 'Metabolic Trait', category: 'Suggestive' },
  { rsId: 'rs501120', chromosome: 'Chr 4', position: 991230, gene: 'CXCL12', pValue: 5.4, oddsRatio: 1.10, riskAllele: 'T', trait: 'Vascular Risk', category: 'Suggestive' },
  { rsId: 'rs740112', chromosome: 'Chr 6', position: 320194, gene: 'HLA-DQB1', pValue: 6.8, oddsRatio: 1.18, riskAllele: 'C', trait: 'Autoimmune Factor', category: 'Suggestive' },
  { rsId: 'rs912831', chromosome: 'Chr 12', position: 412030, gene: 'HNF1A', pValue: 7.1, oddsRatio: 1.21, riskAllele: 'G', trait: 'Maturity Onset Diabetes', category: 'Suggestive' },
  { rsId: 'rs382910', chromosome: 'Chr 17', position: 102938, gene: 'HNF1B', pValue: 5.8, oddsRatio: 1.11, riskAllele: 'C', trait: 'Renal/Pancreatic', category: 'Suggestive' },

  // Background non-significant variants
  ...Array.from({ length: 45 }).map((_, i) => ({
    rsId: `rs${100000 + i}`,
    chromosome: `Chr ${(i % 22) + 1}`,
    position: (i + 1) * 150000,
    gene: `LOC${100 + i}`,
    pValue: 1.2 + (Math.sin(i) * 2 + 2), // p-values between 1.2 and 5.2
    oddsRatio: 1.0 + (i % 10) * 0.02,
    riskAllele: ['A', 'C', 'G', 'T'][i % 4],
    trait: 'Background Variation',
    category: 'Benign' as const
  }))
];
