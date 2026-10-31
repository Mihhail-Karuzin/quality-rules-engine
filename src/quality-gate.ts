import type { TestResult } from "./test-result.js";
import { checkPassRate } from "./pass-rate.rule.js";
import { checkCriticalFailures } from "./critical-failures.rule.js";

export function evaluateQualityGate(
    result: TestResult,
    minimumPassRate: number
): boolean {
    return (
        checkPassRate(result, minimumPassRate) &&
        checkCriticalFailures(result)
    );
}