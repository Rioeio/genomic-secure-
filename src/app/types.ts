export interface Hospital {
  id: string;
  name: string;
  patientsCount: number;
  genomicSamplesCount: number;
  researchProjects: number;
  privacyBudgetUsed: number;
  privacyBudgetTotal: number;
}

export interface Patient {
  id: string;
  anonymizedId: string;
  dataTypes: string[];
  consentedProjects: string[];
  dataAccessLog: DataAccessEvent[];
}

export interface DataAccessEvent {
  id: string;
  studyId: string;
  studyName: string;
  accessDate: string;
  dataUsed: string[];
  purpose: string;
}

export interface ResearchStudy {
  id: string;
  title: string;
  researcher: string;
  institution: string;
  description: string;
  dataRequirements: string[];
  status: 'draft' | 'discovering' | 'active' | 'completed';
  partnersFound: number;
  participatingHospitals: string[];
  privacyLevel: 'high' | 'medium' | 'standard';
  statisticalPower: number;
  results?: string;
  createdAt: string;
}

export interface FederatedAnalysis {
  id: string;
  studyId: string;
  iteration: number;
  modelAccuracy: number;
  participatingNodes: number;
  privacyBudgetConsumed: number;
  status: 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface DatasetMetadata {
  hospitalId: string;
  hospitalName: string;
  dataTypes: string[];
  sampleSize: number;
  demographicDiversity: number;
  qualityScore: number;
  availableForStudy: boolean;
}
