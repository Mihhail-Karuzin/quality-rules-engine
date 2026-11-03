export interface QualityGateResult {
  passed: boolean;
  passRatePassed: boolean;
  criticalFailuresPassed: boolean;
  maximumFailedTestsPassed?: boolean;
  actualPassRate: number;
  reasons: string[];
}
