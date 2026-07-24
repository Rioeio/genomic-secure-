export interface HospitalNode {
  id: string;
  name: string;
  code: string;
  type: 'University Hospital' | 'Biobank Lab' | 'Cancer Research Center';
  location: string;
  datasetSize: number;
  status: 'ONLINE' | 'COMPUTING' | 'SYNCING' | 'OFFLINE';
  privacyBudgetMax: number; // Epsilon total
  privacyBudgetUsed: number; // Epsilon consumed
  delta: number; // DP delta parameter e.g. 1e-5
  localAccuracy: number;
  encryptionKeyStatus: 'ROTATED' | 'VERIFIED' | 'PENDING';
  lastGradientSync: string;
  hardware: string;
}

export interface PatientConsent {
  oncologyResearch: boolean;
  metabolicStudies: boolean;
  rareDiseases: boolean;
  cardiovascularResearch: boolean;
  commercialPharmaSharing: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  agentName: 'Federated Learning Agent' | 'Privacy Guard Agent' | 'Consent Manager Agent' | 'Research Discovery Agent';
  action: string;
  institution: string;
  privacyImpact: string;
  status: 'VERIFIED' | 'ALLOWED' | 'BLOCKED' | 'NOISE_INJECTED';
}

export interface PatientRecord {
  id: string;
  patientCode: string;
  sampleId: string;
  genomeType: 'Whole Genome (WGS)' | 'Exome (WES)' | 'Targeted Gene Panel';
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  condition: string;
  consents: PatientConsent;
  auditTrail: AuditLog[];
  registeredDate: string;
  anonymizedHash: string;
}

export interface GenomicVariant {
  rsId: string;
  chromosome: string;
  position: number;
  gene: string;
  pValue: number; // -log10(p-value) for Manhattan plot
  oddsRatio: number;
  riskAllele: string;
  trait: string;
  category: 'Significant' | 'Suggestive' | 'Benign';
}

export interface ResearchStudy {
  id: string;
  title: string;
  leadResearcher: string;
  targetDisease: string;
  requiredSamples: number;
  currentSamples: number;
  status: 'DRAFT' | 'DISCOVERING' | 'TRAINING' | 'COMPLETED';
  privacyEpsilonTarget: number;
  nodesParticipating: string[];
  roundsCompleted: number;
  totalRounds: number;
  finalAccuracy: number;
  createdDate: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: 'IDLE' | 'ACTIVE' | 'PROCESSING' | 'GUARDING';
  color: string;
  icon: string;
  currentTask: string;
  processedCount: number;
}

export interface FLRoundData {
  round: number;
  loss: number;
  accuracy: number;
  epsilonConsumed: number;
  nodesActive: number;
  timestamp: string;
  gradientHash: string;
  differentialPrivacyNoise: number;
}
