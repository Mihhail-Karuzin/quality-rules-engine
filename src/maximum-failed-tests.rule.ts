import type { TestResult } from "./test-result.js";
import { validateTestResult } from "./test-result.validator.js";

export function checkMaximumFailedTests(
  result: TestResult,
  maximumFailedTests: number,
): boolean {
  validateTestResult(result);

  if (!Number.isInteger(maximumFailedTests)) {
    throw new Error("Maximum failed tests must be an integer");
  }

  if (maximumFailedTests < 0) {
    throw new Error("Maximum failed tests cannot be negative");
  }

  return result.failed <= maximumFailedTests;
}
