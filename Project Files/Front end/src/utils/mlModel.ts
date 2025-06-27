import { PatientData, PredictionResult } from '../types';

// Simulated ML model - In production, this would connect to your trained model API
export class LiverCirrhosisPredictor {
  private static normalRanges = {
    totalBilirubin: { min: 0.3, max: 1.2 },
    directBilirubin: { min: 0.1, max: 0.3 },
    alkalinePhosphatase: { min: 44, max: 147 },
    alanineAminotransferase: { min: 7, max: 56 },
    aspartateAminotransferase: { min: 10, max: 40 },
    totalProteins: { min: 6.0, max: 8.3 },
    albumin: { min: 3.5, max: 5.0 },
    albuminGlobulinRatio: { min: 1.1, max: 2.5 }
  };

  static predict(data: PatientData): PredictionResult {
    // Simulate advanced ML prediction logic
    let riskScore = 0;
    const factors = [];

    // Age factor
    if (data.age > 50) riskScore += 0.15;
    if (data.age > 65) riskScore += 0.1;

    // Bilirubin analysis
    const bilirubinRatio = data.totalBilirubin / this.normalRanges.totalBilirubin.max;
    if (bilirubinRatio > 1) {
      const impact = Math.min((bilirubinRatio - 1) * 0.3, 0.25);
      riskScore += impact;
      factors.push({
        factor: 'Elevated Total Bilirubin',
        impact: impact * 100,
        description: 'Indicates potential liver dysfunction and bile processing issues'
      });
    }

    // Liver enzyme analysis
    const altRatio = data.alanineAminotransferase / this.normalRanges.alanineAminotransferase.max;
    const astRatio = data.aspartateAminotransferase / this.normalRanges.aspartateAminotransferase.max;
    
    if (altRatio > 1 || astRatio > 1) {
      const enzymeImpact = Math.min((Math.max(altRatio, astRatio) - 1) * 0.2, 0.2);
      riskScore += enzymeImpact;
      factors.push({
        factor: 'Elevated Liver Enzymes',
        impact: enzymeImpact * 100,
        description: 'Suggests liver cell damage and inflammation'
      });
    }

    // Protein synthesis analysis
    const albuminRatio = data.albumin / this.normalRanges.albumin.min;
    if (albuminRatio < 1) {
      const proteinImpact = Math.min((1 - albuminRatio) * 0.25, 0.2);
      riskScore += proteinImpact;
      factors.push({
        factor: 'Low Albumin Levels',
        impact: proteinImpact * 100,
        description: 'Indicates reduced liver protein synthesis capacity'
      });
    }

    // Alkaline phosphatase
    const alpRatio = data.alkalinePhosphatase / this.normalRanges.alkalinePhosphatase.max;
    if (alpRatio > 1.5) {
      const alpImpact = Math.min((alpRatio - 1.5) * 0.15, 0.15);
      riskScore += alpImpact;
      factors.push({
        factor: 'Elevated Alkaline Phosphatase',
        impact: alpImpact * 100,
        description: 'May indicate bile duct obstruction or liver disease'
      });
    }

    // Calculate final probability and risk level
    const probability = Math.min(riskScore * 100, 95);
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    let stage: 1 | 2 | 3 | 4;

    if (probability < 25) {
      riskLevel = 'Low';
      stage = 1;
    } else if (probability < 50) {
      riskLevel = 'Moderate';
      stage = 2;
    } else if (probability < 75) {
      riskLevel = 'High';
      stage = 3;
    } else {
      riskLevel = 'Critical';
      stage = 4;
    }

    const recommendations = this.generateRecommendations(riskLevel, factors);
    const confidence = Math.max(85 + Math.random() * 10, 90);

    return {
      probability,
      riskLevel,
      stage,
      confidence,
      recommendations,
      keyFactors: factors.slice(0, 3) // Top 3 factors
    };
  }

  private static generateRecommendations(riskLevel: string, factors: any[]): string[] {
    const baseRecommendations = [
      'Regular monitoring of liver function tests',
      'Maintain a healthy diet low in sodium and processed foods',
      'Avoid alcohol consumption completely',
      'Stay hydrated and maintain regular exercise'
    ];

    const riskSpecificRecommendations = {
      Low: [
        'Continue current lifestyle and schedule annual check-ups',
        'Consider hepatitis vaccination if not already vaccinated'
      ],
      Moderate: [
        'Schedule follow-up appointments every 6 months',
        'Consider consultation with a hepatologist',
        'Monitor for symptoms like fatigue, abdominal swelling, or jaundice'
      ],
      High: [
        'Immediate consultation with a liver specialist required',
        'Consider advanced imaging studies (CT/MRI)',
        'Discuss treatment options to slow disease progression'
      ],
      Critical: [
        'Urgent medical attention required',
        'Immediate hospitalization may be necessary',
        'Liver transplant evaluation should be considered'
      ]
    };

    return [...baseRecommendations, ...riskSpecificRecommendations[riskLevel as keyof typeof riskSpecificRecommendations]];
  }
}