import type { TestResult } from "./test-result.js";
import type { QualityGateReport } from "./quality-gate-report.js";

import { evaluateQualityGateDetailed } from "./quality-gate-detailed.js";

export function buildQualityGateReport(
    result: TestResult,
    minimumPassRate: number
): QualityGateReport {

    const qualityGate = evaluateQualityGateDetailed(
        result,
        minimumPassRate
    );

    return {
        summary: { ...result },
        minimumPassRate,
        qualityGate
    };
}