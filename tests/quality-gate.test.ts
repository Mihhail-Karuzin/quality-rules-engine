import { describe, it, expect } from "vitest";
import { evaluateQualityGate } from "../src/quality-gate.js";

describe("Quality Gate", () => {
  it.each([
    ["both rules pass", 95, 0, true],
    ["critical failure exists", 95, 1, false],
    ["pass rate too low", 99, 0, false],
    ["both rules fail", 99, 1, false],
  ])(
    "should handle %s",
    (description, minimumPassRate, criticalFailed, expectedResult) => {
      const result = {
        total: 100,
        passed: 95,
        failed: 5,
        criticalFailed,
      };

      expect(evaluateQualityGate(result, minimumPassRate)).toBe(expectedResult);
    },
  );

  it.each([
    ["negative threshold", -1],
    ["threshold above 100", 101],
    ["NaN threshold", NaN],
    ["positive Infinity", Infinity],
    ["negative Infinity", -Infinity],
  ])("should reject %s", (description, invalidThreshold) => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    expect(() => evaluateQualityGate(result, invalidThreshold)).toThrow(
      "Minimum pass rate must be between 0 and 100",
    );
  });

  it("should reject inconsistent test results", () => {
    const result = {
      total: 100,
      passed: 90,
      failed: 5,
      criticalFailed: 0,
    };

    expect(() => evaluateQualityGate(result, 95)).toThrow(
      "Passed and failed tests must equal total tests",
    );
  });

  it("should pass when all three quality rules pass", () => {
    const result = {
      total: 100,
      passed: 97,
      failed: 3,
      criticalFailed: 0,
    };

    const minimumPassRate = 95;
    const maximumFailedTests = 5;

    expect(
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toBe(true);
  });
  it("should fail when maximum failed tests limit is exceeded", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const minimumPassRate = 90;
    const maximumFailedTests = 3;

    expect(
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toBe(false);
  });
  it("should pass when failed tests equal maximum allowed", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const minimumPassRate = 90;
    const maximumFailedTests = 5;

    expect(
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toBe(true);
  });
  it("should pass when maximum failed tests is zero and no tests failed", () => {
    const result = {
      total: 100,
      passed: 100,
      failed: 0,
      criticalFailed: 0,
    };

    const minimumPassRate = 95;
    const maximumFailedTests = 0;

    expect(
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toBe(true);
  });
  it("should fail when maximum failed tests is zero and one test failed", () => {
    const result = {
      total: 100,
      passed: 99,
      failed: 1,
      criticalFailed: 0,
    };

    const minimumPassRate = 95;
    const maximumFailedTests = 0;

    expect(
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toBe(false);
  });
  it("should reject negative maximum failed tests even when pass rate fails", () => {
    const result = {
      total: 100,
      passed: 80,
      failed: 20,
      criticalFailed: 0,
    };

    const minimumPassRate = 95;
    const maximumFailedTests = -1;

    expect(() =>
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toThrow("Maximum failed tests cannot be negative");
  });
  it("should reject NaN maximum failed tests even when pass rate fails", () => {
    const result = {
      total: 100,
      passed: 80,
      failed: 20,
      criticalFailed: 0,
    };

    const minimumPassRate = 95;
    const maximumFailedTests = NaN;

    expect(() =>
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toThrow("Maximum failed tests must be an integer");
  });
  it("should reject Infinity maximum failed tests even when pass rate fails", () => {
    const result = {
      total: 100,
      passed: 80,
      failed: 20,
      criticalFailed: 0,
    };

    const minimumPassRate = 95;
    const maximumFailedTests = Infinity;

    expect(() =>
      evaluateQualityGate(result, minimumPassRate, maximumFailedTests),
    ).toThrow("Maximum failed tests must be an integer");
  });
});
