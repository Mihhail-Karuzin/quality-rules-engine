import { describe, it, expect } from "vitest";
import type { TestResult } from "../src/test-result.js";
import { checkMaximumCriticalFailures } from "../src/maximum-critical-failures.rule.js";

describe("Maximum Critical Failures Rule", () => {
  it("should return true when critical failures equal the maximum", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 2,
    };

    const maximumCriticalFailures = 2;

    expect(checkMaximumCriticalFailures(result, maximumCriticalFailures)).toBe(
      true,
    );
  });
  it("should return false when critical failures exceed the maximum", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 3,
    };

    const maximumCriticalFailures = 2;

    expect(checkMaximumCriticalFailures(result, maximumCriticalFailures)).toBe(
      false,
    );
  });
  it("should return true when zero critical failures are allowed and none occur", () => {
    const result: TestResult = {
      total: 100,
      passed: 100,
      failed: 0,
      criticalFailed: 0,
    };

    const maximumCriticalFailures = 0;

    expect(checkMaximumCriticalFailures(result, maximumCriticalFailures)).toBe(
      true,
    );
  });
  it("should return false when zero critical failures are allowed but one occurs", () => {
    const result: TestResult = {
      total: 100,
      passed: 99,
      failed: 1,
      criticalFailed: 1,
    };

    const maximumCriticalFailures = 0;

    expect(checkMaximumCriticalFailures(result, maximumCriticalFailures)).toBe(
      false,
    );
  });
  it("should throw an error when maximum critical failures is negative", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 2,
    };

    const maximumCriticalFailures = -1;

    expect(() =>
      checkMaximumCriticalFailures(result, maximumCriticalFailures),
    ).toThrow("Maximum critical failures cannot be negative");
  });
  it("should throw an error when maximum critical failures is fractional", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 2,
    };

    const maximumCriticalFailures = 2.5;

    expect(() =>
      checkMaximumCriticalFailures(result, maximumCriticalFailures),
    ).toThrow("Maximum critical failures must be an integer");
  });
  it("should throw an error when maximum critical failures is NaN", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 2,
    };

    const maximumCriticalFailures = NaN;

    expect(() =>
      checkMaximumCriticalFailures(result, maximumCriticalFailures),
    ).toThrow("Maximum critical failures must be an integer");
  });
  it("should throw an error when maximum critical failures is Infinity", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 2,
    };

    const maximumCriticalFailures = Infinity;

    expect(() =>
      checkMaximumCriticalFailures(result, maximumCriticalFailures),
    ).toThrow("Maximum critical failures must be an integer");
  });
  it("should throw an error when critical failures exceed total failed tests", () => {
    const result: TestResult = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 6,
    };

    const maximumCriticalFailures = 10;

    expect(() =>
      checkMaximumCriticalFailures(result, maximumCriticalFailures),
    ).toThrow();
  });
});
