import type { TestResult } from "./test-result.js";
import { validateTestResult } from "./test-result.validator.js";

export function calculatePassRate(
    result: TestResult
): number {
    validateTestResult(result);

    return (result.passed / result.total) * 100;
}