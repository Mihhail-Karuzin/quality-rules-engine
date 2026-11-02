import { describe, it, expect } from "vitest";
import { checkMaximumFailedTests } from "../src/maximum-failed-tests.rule.js";

describe("Maximum Failed Tests Rule", () => {
  it("should return true when failed tests do not exceed the maximum", () => {
    const result = {
      total: 100,
      passed: 97,
      failed: 3,
      criticalFailed: 0,
    };

    const maximumFailedTests = 5;

    expect(checkMaximumFailedTests(result, maximumFailedTests)).toBe(true);
  });

  it("should return true when failed tests equal the maximum", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const maximumFailedTests = 5;

    expect(checkMaximumFailedTests(result, maximumFailedTests)).toBe(true);
  });

  it("should return false when failed tests exceed the maximum", () => {
    const result = {
      total: 100,
      passed: 92,
      failed: 8,
      criticalFailed: 0,
    };

    const maximumFailedTests = 5;

    expect(checkMaximumFailedTests(result, maximumFailedTests)).toBe(false);
  });

  it("should reject negative maximum failed tests", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const maximumFailedTests = -1;

    expect(() => checkMaximumFailedTests(result, maximumFailedTests)).toThrow(
      "Maximum failed tests cannot be negative",
    );
  });

  it("should reject fractional maximum failed tests", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const maximumFailedTests = 2.5;

    expect(() => checkMaximumFailedTests(result, maximumFailedTests)).toThrow(
      "Maximum failed tests must be an integer",
    );
  });

  it("should reject NaN maximum failed tests", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const maximumFailedTests = NaN;

    expect(() => checkMaximumFailedTests(result, maximumFailedTests)).toThrow(
      "Maximum failed tests must be an integer",
    );
  });

  it("should return true when maximum and failed tests are zero", () => {
    const result = {
      total: 100,
      passed: 100,
      failed: 0,
      criticalFailed: 0,
    };

    const maximumFailedTests = 0;

    expect(checkMaximumFailedTests(result, maximumFailedTests)).toBe(true);
  });

  it("should reject Infinity maximum failed tests", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const maximumFailedTests = Infinity;

    expect(() => checkMaximumFailedTests(result, maximumFailedTests)).toThrow(
      "Maximum failed tests must be an integer",
    );
  });
});
