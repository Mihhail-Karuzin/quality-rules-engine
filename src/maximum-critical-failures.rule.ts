import type { TestResult } from "./test-result.js";
import { validateTestResult } from "./test-result.validator.js";

export function checkMaximumCriticalFailures(
  result: TestResult,
  maximumCriticalFailures: number,
): boolean {
  validateTestResult(result);

  if (!Number.isInteger(maximumCriticalFailures)) {
    throw new Error("Maximum critical failures must be an integer");
  }

  if (maximumCriticalFailures < 0) {
    throw new Error("Maximum critical failures cannot be negative");
  }

  return result.criticalFailed <= maximumCriticalFailures;
}
