import type { TestResult } from "./test-result.js";
import { buildQualityGateReport } from "./quality-gate-report.builder.js";
import { serializeQualityGateReport } from "./quality-gate-report.serializer.js";
import { exportQualityGateReport } from "./quality-gate-report.exporter.js";

// Generate the JSON report and return the quality gate result
export async function generateQualityGateReport(
  result: TestResult,
  minimumPassRate: number,
  filePath: string,
): Promise<boolean> {
  const report = buildQualityGateReport(result, minimumPassRate);

  const json = serializeQualityGateReport(report);

  // Save the report before returning the quality gate result
  await exportQualityGateReport(filePath, json);

  return report.qualityGate.passed;
}
