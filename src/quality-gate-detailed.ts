import type { TestResult } from "./test-result.js";
import type { QualityGateResult } from "./quality-gate-result.js";

import { checkPassRate } from "./pass-rate.rule.js";
import { checkCriticalFailures } from "./critical-failures.rule.js";
import { calculatePassRate } from "./pass-rate.calculator.js";
import { formatPassRate } from "./pass-rate.formatter.js";

export function evaluateQualityGateDetailed(
    result: TestResult,
    minimumPassRate: number
): QualityGateResult {
    const passRatePassed = checkPassRate(result, minimumPassRate);

    const criticalFailuresPassed = checkCriticalFailures(result);

    const passed = passRatePassed && criticalFailuresPassed;

    const actualPassRate = calculatePassRate(result);

    const reasons: string[] = [];

    if (!passRatePassed) {
        const formattedPassRate = formatPassRate(actualPassRate);

        reasons.push(`Pass rate ${formattedPassRate}% is below minimum ${minimumPassRate}%`);
    }

    if (!criticalFailuresPassed) {
        reasons.push("Critical test failures detected");
    }

    return {
        passed,
        passRatePassed,
        criticalFailuresPassed,
        actualPassRate,
        reasons
    };
}
