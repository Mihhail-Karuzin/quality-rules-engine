import type { QualityGateReport } from "./quality-gate-report.js";

export function serializeQualityGateReport(
    report: QualityGateReport
): string {
    return JSON.stringify(report, null, 2);
}