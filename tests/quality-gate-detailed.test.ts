import { describe, it, expect } from "vitest";
import { evaluateQualityGateDetailed } from "../src/quality-gate-detailed.js";

describe("Detailed Quality Gate", () => {
  it.each([
    ["both rules pass", 95, 0, true, true, true, []],
    [
      "critical failure exists",
      95,
      1,
      false,
      true,
      false,
      ["Critical test failures detected"],
    ],
    [
      "pass rate too low",
      99,
      0,
      false,
      false,
      true,
      ["Pass rate 95% is below minimum 99%"],
    ],
    [
      "both rules fail",
      99,
      1,
      false,
      false,
      false,
      ["Pass rate 95% is below minimum 99%", "Critical test failures detected"],
    ],
  ] as const)(
    "should report %s",
    (
      description,
      minimumPassRate,
      criticalFailed,
      expectedPassed,
      expectedPassRatePassed,
      expectedCriticalFailuresPassed,
      expectedReasons,
    ) => {
      const result = {
        total: 100,
        passed: 95,
        failed: 5,
        criticalFailed,
      };

      expect(evaluateQualityGateDetailed(result, minimumPassRate)).toEqual({
        passed: expectedPassed,
        passRatePassed: expectedPassRatePassed,
        criticalFailuresPassed: expectedCriticalFailuresPassed,
        actualPassRate: 95,
        reasons: [...expectedReasons],
      });
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

    expect(() => evaluateQualityGateDetailed(result, invalidThreshold)).toThrow(
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

    expect(() => evaluateQualityGateDetailed(result, 95)).toThrow(
      "Passed and failed tests must equal total tests",
    );
  });

  it("should reject critical failures exceeding failed tests", () => {
    const result = {
      total: 100,
      passed: 98,
      failed: 2,
      criticalFailed: 3,
    };

    expect(() => evaluateQualityGateDetailed(result, 95)).toThrow(
      "Critical failed tests cannot exceed failed tests",
    );
  });

  it.each([
    [100, 95, 95],
    [200, 185, 92.5],
    [8, 7, 87.5],
    [3, 2, 200 / 3],
  ])(
    "should calculate actual pass rate for %i total and %i passed",
    (total, passed, expectedPassRate) => {
      const result = {
        total,
        passed,
        failed: total - passed,
        criticalFailed: 0,
      };

      const report = evaluateQualityGateDetailed(result, 95);

      expect(report.actualPassRate).toBeCloseTo(expectedPassRate);
    },
  );

  it("should pass when actual pass rate equals minimum threshold", () => {
    const result = {
      total: 100,
      passed: 90,
      failed: 10,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90);

    expect(report.passed).toBe(true);
    expect(report.actualPassRate).toBe(90);
    expect(report.reasons).toEqual([]);
  });

  it("should format fractional pass rate to two decimal places in reason", () => {
    const result = {
      total: 3,
      passed: 2,
      failed: 1,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 70);

    expect(report.actualPassRate).toBeCloseTo(200 / 3);

    expect(report.reasons).toEqual(["Pass rate 66.67% is below minimum 70%"]);
  });

  it("should not round actual pass rate before threshold comparison", () => {
    const result = {
      total: 3,
      passed: 2,
      failed: 1,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 66.67);

    expect(report.passRatePassed).toBe(false);
    expect(report.passed).toBe(false);
    expect(report.reasons).toEqual([
      "Pass rate 66.67% is below minimum 66.67%",
    ]);
  });
  it("should fail when maximum failed tests limit is exceeded", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90, 3);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBe(false);
    expect(report.reasons).toEqual(["Failed tests 5 exceed maximum allowed 3"]);
  });
  it("should pass when failed tests equal maximum allowed", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90, 5);

    expect(report.passed).toBe(true);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBe(true);
    expect(report.reasons).toEqual([]);
  });
  it("should pass when maximum failed tests is zero and no tests failed", () => {
    const result = {
      total: 100,
      passed: 100,
      failed: 0,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90, 0);

    expect(report.passed).toBe(true);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBe(true);
    expect(report.reasons).toEqual([]);
  });
  it("should fail when maximum failed tests is zero and one test failed", () => {
    const result = {
      total: 100,
      passed: 99,
      failed: 1,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90, 0);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBe(false);
    expect(report.reasons).toEqual(["Failed tests 1 exceed maximum allowed 0"]);
  });
  it("should preserve previous behavior when maximum failed tests is omitted", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90);

    expect(report.passed).toBe(true);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBeUndefined();
    expect(report.reasons).toEqual([]);
  });
  it("should reject negative maximum failed tests", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 0,
    };

    expect(() => evaluateQualityGateDetailed(result, 90, -1)).toThrow(
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

    expect(() => evaluateQualityGateDetailed(result, 90, 2.5)).toThrow(
      "Maximum failed tests must be an integer",
    );
  });
  it.each([
    ["NaN", NaN],
    ["positive Infinity", Infinity],
    ["negative Infinity", -Infinity],
  ])(
    "should reject %s as maximum failed tests",
    (description, invalidLimit) => {
      const result = {
        total: 100,
        passed: 95,
        failed: 5,
        criticalFailed: 0,
      };

      expect(() =>
        evaluateQualityGateDetailed(result, 90, invalidLimit),
      ).toThrow("Maximum failed tests must be an integer");
    },
  );
  it("should report all three reasons when all quality gate rules fail", () => {
    const result = {
      total: 100,
      passed: 80,
      failed: 20,
      criticalFailed: 2,
    };

    const report = evaluateQualityGateDetailed(result, 90, 5);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(false);
    expect(report.criticalFailuresPassed).toBe(false);
    expect(report.maximumFailedTestsPassed).toBe(false);

    expect(report.actualPassRate).toBe(80);

    expect(report.reasons).toEqual([
      "Pass rate 80% is below minimum 90%",
      "Critical test failures detected",
      "Failed tests 20 exceed maximum allowed 5",
    ]);
  });
  it("should report only pass rate failure when other rules pass", () => {
    const result = {
      total: 100,
      passed: 80,
      failed: 20,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90, 25);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(false);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBe(true);

    expect(report.reasons).toEqual(["Pass rate 80% is below minimum 90%"]);
  });
  it("should report only critical failure when other rules pass", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 1,
    };

    const report = evaluateQualityGateDetailed(result, 90, 10);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(false);
    expect(report.maximumFailedTestsPassed).toBe(true);

    expect(report.reasons).toEqual(["Critical test failures detected"]);
  });
  it("should report critical and maximum failed tests failures", () => {
    const result = {
      total: 100,
      passed: 95,
      failed: 5,
      criticalFailed: 1,
    };

    const report = evaluateQualityGateDetailed(result, 90, 3);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(true);
    expect(report.criticalFailuresPassed).toBe(false);
    expect(report.maximumFailedTestsPassed).toBe(false);

    expect(report.reasons).toEqual([
      "Critical test failures detected",
      "Failed tests 5 exceed maximum allowed 3",
    ]);
  });
  it("should report pass rate and maximum failed tests failures", () => {
    const result = {
      total: 100,
      passed: 80,
      failed: 20,
      criticalFailed: 0,
    };

    const report = evaluateQualityGateDetailed(result, 90, 5);

    expect(report.passed).toBe(false);
    expect(report.passRatePassed).toBe(false);
    expect(report.criticalFailuresPassed).toBe(true);
    expect(report.maximumFailedTestsPassed).toBe(false);

    expect(report.reasons).toEqual([
      "Pass rate 80% is below minimum 90%",
      "Failed tests 20 exceed maximum allowed 5",
    ]);
  });
});
