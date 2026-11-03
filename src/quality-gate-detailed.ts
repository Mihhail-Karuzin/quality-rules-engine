import type { TestResult } from "./test-result.js";
import type { QualityGateResult } from "./quality-gate-result.js";

import { checkPassRate } from "./pass-rate.rule.js";
import { checkCriticalFailures } from "./critical-failures.rule.js";
import { checkMaximumFailedTests } from "./maximum-failed-tests.rule.js";
import { calculatePassRate } from "./pass-rate.calculator.js";
import { formatPassRate } from "./pass-rate.formatter.js";

export function evaluateQualityGateDetailed(
  result: TestResult,
  minimumPassRate: number,
  maximumFailedTests?: number,
): QualityGateResult {
  const passRatePassed = checkPassRate(result, minimumPassRate);

  const criticalFailuresPassed = checkCriticalFailures(result);

  const maximumFailedTestsPassed =
    maximumFailedTests === undefined ||
    checkMaximumFailedTests(result, maximumFailedTests);

  const passed =
    passRatePassed && criticalFailuresPassed && maximumFailedTestsPassed;

  const actualPassRate = calculatePassRate(result);

  const reasons: string[] = [];

  if (!passRatePassed) {
    const formattedPassRate = formatPassRate(actualPassRate);

    reasons.push(
      `Pass rate ${formattedPassRate}% is below minimum ${minimumPassRate}%`,
    );
  }

  if (!criticalFailuresPassed) {
    reasons.push("Critical test failures detected");
  }

  if (!maximumFailedTestsPassed) {
    reasons.push(
      `Failed tests ${result.failed} exceed maximum allowed ${maximumFailedTests}`,
    );
  }

  return {
    passed,
    passRatePassed,
    criticalFailuresPassed,
    ...(maximumFailedTests !== undefined && { maximumFailedTestsPassed }),
    actualPassRate,
    reasons,
  };
}
