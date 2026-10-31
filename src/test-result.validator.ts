import type { TestResult } from "./test-result.js";

export function validateTestResult(result: TestResult): void {
  if (!Number.isInteger(result.total)) {
    throw new Error("Total tests must be an integer");
  }

  if (!Number.isInteger(result.passed)) {
    throw new Error("Passed tests must be an integer");
  }

  if (!Number.isInteger(result.failed)) {
    throw new Error("Failed tests must be an integer");
  }

  if (!Number.isInteger(result.criticalFailed)) {
    throw new Error("Critical failed tests must be an integer");
  }

  if (result.total <= 0) {
    throw new Error("Total tests must be greater than zero");
  }

  if (result.passed < 0) {
    throw new Error("Passed tests cannot be negative");
  }

  if (result.failed < 0) {
    throw new Error("Failed tests cannot be negative");
  }

  if (result.passed + result.failed !== result.total) {
    throw new Error("Passed and failed tests must equal total tests");
  }

  if (result.criticalFailed < 0) {
    throw new Error("Critical failed tests cannot be negative");
  }

  if (result.criticalFailed > result.failed) {
    throw new Error("Critical failed tests cannot exceed failed tests");
  }
}
