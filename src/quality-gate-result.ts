export interface QualityGateResult {
    passed: boolean;
    passRatePassed: boolean;
    criticalFailuresPassed: boolean;
    actualPassRate: number;
    reasons: string[];
}