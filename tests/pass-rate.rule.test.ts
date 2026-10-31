import { describe, it, expect } from "vitest";
import { checkPassRate } from "../src/pass-rate.rule.js";

describe("Pass Rate Rule", () => {
  it.each([
    [97, 3, true],
    [94, 6, false],
    [95, 5, true],
    [100, 0, true],
  ])("should check pass rate for passed=%i", (passed, failed, expected) => {
    const result = {
      total: 100,
      passed,
      failed,
      criticalFailed: 0,
    };

    const actual = checkPassRate(result, 95);

    expect(actual).toBe(expected);
  });

  it("should throw an error when total is zero", () => {
    const result = {
      total: 0,
      passed: 0,
      failed: 0,
      criticalFailed: 0,
    };

    expect(() => checkPassRate(result, 95)).toThrow(
      "Total tests must be greater than zero",
    );
  });

  it("should throw an error when passed is negative", () => {
    const result = {
      total: 100,
      passed: -5,
      failed: 105,
      criticalFailed: 0,
    };

    expect(() => checkPassRate(result, 95)).toThrow(
      "Passed tests cannot be negative",
    );
  });

  it("should throw an error when failed is negative", () => {
    const result = {
      total: 100,
      passed: 110,
      failed: -10,
      criticalFailed: 0,
    };

    expect(() => checkPassRate(result, 95)).toThrow(
      "Failed tests cannot be negative",
    );
  });

  it("should throw an error when test counts do not match total", () => {
    const result = {
      total: 100,
      passed: 90,
      failed: 5,
      criticalFailed: 0,
    };

    expect(() => checkPassRate(result, 85)).toThrow(
      "Passed and failed tests must equal total tests",
    );
  });

  it("should throw an error when criticalFailed is negative", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: -2,
    };

    expect(() => checkPassRate(result, 90)).toThrow(
      "Critical failed tests cannot be negative",
    );
  });

  it("should throw an error when criticalFailed exceeds failed", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 8,
    };

    expect(() => checkPassRate(result, 90)).toThrow(
      "Critical failed tests cannot exceed failed tests",
    );
  });

  it.each([
    ["negative threshold", -1],
    ["threshold above 100", 101],
    ["NaN threshold", NaN],
    ["positive Infinity", Infinity],
    ["negative Infinity", -Infinity]
])(
    "should reject %s",
    (description, invalidThreshold) => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 0
        };

        expect(() =>
            checkPassRate(result, invalidThreshold)
        ).toThrow(
            "Minimum pass rate must be between 0 and 100"
        );
    }
  );

  it.each([
    ["zero threshold", 0, true],
    ["maximum threshold", 100, false],
    ["fractional threshold", 95.5, false]
])(
    "should accept %s",
    (description, minimumPassRate, expectedResult) => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 0
        };

        expect(
            checkPassRate(result, minimumPassRate)
        ).toBe(expectedResult);
    }
  );
});
