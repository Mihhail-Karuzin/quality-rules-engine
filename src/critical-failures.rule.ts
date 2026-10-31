import type { TestResult } from "./test-result.js";
import { validateTestResult } from "./test-result.validator.js";

export function checkCriticalFailures(
    result: TestResult
): boolean {
    validateTestResult(result);

    return result.criticalFailed === 0;
}