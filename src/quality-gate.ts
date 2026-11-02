import type { TestResult } from "./test-result.js";
import { checkPassRate } from "./pass-rate.rule.js";
import { checkCriticalFailures } from "./critical-failures.rule.js";
import { checkMaximumFailedTests } from "./maximum-failed-tests.rule.js";

export function evaluateQualityGate(
  result: TestResult,
  minimumPassRate: number,
  maximumFailedTests?: number,
): boolean {
  const maximumFailedTestsPassed =
    maximumFailedTests === undefined ||
    checkMaximumFailedTests(result, maximumFailedTests);

  return (
    checkPassRate(result, minimumPassRate) &&
    checkCriticalFailures(result) &&
    maximumFailedTestsPassed
  );
}
