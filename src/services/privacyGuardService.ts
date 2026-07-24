/**
 * Privacy Guard Service implementing Differential Privacy (DP)
 * Laplace Noise Mechanism: Noise ~ Laplace(0, b) where b = Sensitivity / Epsilon
 */

export interface DPNoiseResult {
  originalValue: number;
  noisyValue: number;
  noiseAdded: number;
  epsilonUsed: number;
  reIdRiskScore: number; // 0 to 100%
  privacyLevel: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
}

export class PrivacyGuardService {
  /**
   * Sample from Laplace distribution: Laplace(0, b)
   */
  public static sampleLaplace(b: number): number {
    const u = Math.random() - 0.5;
    return -b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }

  /**
   * Apply Differential Privacy to a numeric query/stat (e.g. allele frequency or mean)
   * @param value Original metric
   * @param sensitivity Query sensitivity (\Delta f)
   * @param epsilon Privacy budget parameter \epsilon
   */
  public static applyLaplaceDP(value: number, sensitivity: number = 1.0, epsilon: number = 0.5): DPNoiseResult {
    const scale = sensitivity / Math.max(epsilon, 0.01);
    const noise = this.sampleLaplace(scale);
    const noisyValue = Math.max(0, value + noise);

    // Estimate re-identification risk: lower epsilon = lower risk
    const reIdRiskScore = Math.min(99.9, Math.max(0.1, (epsilon / 10.0) * 100 * (1 + (Math.random() * 0.1 - 0.05))));

    let privacyLevel: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
    if (epsilon <= 0.5) privacyLevel = 'VERY HIGH';
    else if (epsilon <= 1.5) privacyLevel = 'HIGH';
    else if (epsilon <= 4.0) privacyLevel = 'MODERATE';
    else privacyLevel = 'LOW';

    return {
      originalValue: Number(value.toFixed(4)),
      noisyValue: Number(noisyValue.toFixed(4)),
      noiseAdded: Number(noise.toFixed(4)),
      epsilonUsed: epsilon,
      reIdRiskScore: Number(reIdRiskScore.toFixed(2)),
      privacyLevel
    };
  }

  /**
   * Evaluate if query can proceed given remaining node privacy budget
   */
  public static evaluateBudgetAvailability(budgetMax: number, budgetUsed: number, requestedEpsilon: number): boolean {
    return (budgetUsed + requestedEpsilon) <= budgetMax;
  }
}
