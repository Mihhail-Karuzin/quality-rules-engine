import type { TestResult } from "./test-result.js";
import type { QualityGateResult } from "./quality-gate-result.js";

export interface QualityGateReport {
    summary: TestResult;
    minimumPassRate: number;
    qualityGate: QualityGateResult;
}