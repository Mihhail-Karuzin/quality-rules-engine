import { describe, it, expect } from "vitest";
import { validateTestResult } from "../src/test-result.validator.js";

describe("Test Result Validator", () => {
  it("should accept valid test results", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 2,
    };

    expect(() => validateTestResult(result)).not.toThrow();
  });

  it("should reject negative critical failures", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: -1,
    };

    expect(() => validateTestResult(result)).toThrow(
      "Critical failed tests cannot be negative",
    );
  });

  it("should reject critical failures exceeding failed tests", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 6,
    };

    expect(() => validateTestResult(result)).toThrow(
      "Critical failed tests cannot exceed failed tests",
    );
  });

  it("should reject fractional total tests", () => {
    const result = {
      total: 100.5,
      passed: 95.5,
      failed: 5,
      criticalFailed: 1,
    };

    expect(() => validateTestResult(result)).toThrow(
      "Total tests must be an integer",
    );
  });

  it.each([
    [
      "passed",
      {
        total: 100,
        passed: 95.5,
        failed: 5,
        criticalFailed: 1,
      },
      "Passed tests must be an integer",
    ],
    [
      "failed",
      {
        total: 100,
        passed: 95,
        failed: 5.5,
        criticalFailed: 1,
      },
      "Failed tests must be an integer",
    ],
    [
      "criticalFailed",
      {
        total: 100,
        passed: 95,
        failed: 5,
        criticalFailed: 1.5,
      },
      "Critical failed tests must be an integer",
    ],
  ])("should reject fractional %s", (field, result, expectedError) => {
    expect(() => validateTestResult(result)).toThrow(expectedError);
  });

  it.each([
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["negative Infinity", -Infinity]
])(
    "should reject total containing %s",
    (description, invalidTotal) => {
        const result = {
            total: invalidTotal,
            passed: 95,
            failed: 5,
            criticalFailed: 1
        };

        expect(() => validateTestResult(result)).toThrow(
            "Total tests must be an integer"
        );
    }
  );
});
