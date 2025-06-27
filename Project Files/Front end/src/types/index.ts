export interface PatientData {
  id?: string;
  age: number;
  gender: 'Male' | 'Female';
  totalBilirubin: number;
  directBilirubin: number;
  alkalinePhosphatase: number;
  alanineAminotransferase: number;
  aspartateAminotransferase: number;
  totalProteins: number;
  albumin: number;
  albuminGlobulinRatio: number;
  stage?: 1 | 2 | 3 | 4;
  timestamp?: Date;
}

export interface PredictionResult {
  probability: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  stage: 1 | 2 | 3 | 4;
  confidence: number;
  recommendations: string[];
  keyFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface LabResult {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'Normal' | 'Elevated' | 'Low';
}