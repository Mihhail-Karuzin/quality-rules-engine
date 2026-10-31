import type { TestResult } from "./test-result.js";
import { calculatePassRate } from "./pass-rate.calculator.js";
import { validateMinimumPassRate } from "./pass-rate.validator.js";

export function checkPassRate(
    result: TestResult,
    minimumPassRate: number
): boolean {
    const passRate = calculatePassRate(result);

    validateMinimumPassRate(minimumPassRate);

    return passRate >= minimumPassRate;
}