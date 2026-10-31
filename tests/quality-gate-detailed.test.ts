import { describe, it, expect } from "vitest";
import { evaluateQualityGateDetailed } from "../src/quality-gate-detailed.js";

describe("Detailed Quality Gate", () => {
    it.each([
        ["both rules pass", 95, 0, true, true, true, []],
        ["critical failure exists", 95, 1, false, true, false, ["Critical test failures detected"]],
        ["pass rate too low", 99, 0, false, false, true, ["Pass rate 95% is below minimum 99%"]],
        [
            "both rules fail",
            99,
            1,
            false,
            false,
            false,
            ["Pass rate 95% is below minimum 99%", "Critical test failures detected"]
        ]
    ] as const)(
        "should report %s",
        (
            description,
            minimumPassRate,
            criticalFailed,
            expectedPassed,
            expectedPassRatePassed,
            expectedCriticalFailuresPassed,
            expectedReasons
        ) => {
            const result = {
                total: 100,
                passed: 95,
                failed: 5,
                criticalFailed
            };

            expect(evaluateQualityGateDetailed(result, minimumPassRate)).toEqual({
                passed: expectedPassed,
                passRatePassed: expectedPassRatePassed,
                criticalFailuresPassed: expectedCriticalFailuresPassed,
                actualPassRate: 95,
                reasons: [...expectedReasons]
            });
        }
    );

    it.each([
        ["negative threshold", -1],
        ["threshold above 100", 101],
        ["NaN threshold", NaN],
        ["positive Infinity", Infinity],
        ["negative Infinity", -Infinity]
    ])("should reject %s", (description, invalidThreshold) => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 0
        };

        expect(() => evaluateQualityGateDetailed(result, invalidThreshold)).toThrow(
            "Minimum pass rate must be between 0 and 100"
        );
    });

    it("should reject inconsistent test results", () => {
        const result = {
            total: 100,
            passed: 90,
            failed: 5,
            criticalFailed: 0
        };

        expect(() => evaluateQualityGateDetailed(result, 95)).toThrow(
            "Passed and failed tests must equal total tests"
        );
    });

    it("should reject critical failures exceeding failed tests", () => {
        const result = {
            total: 100,
            passed: 98,
            failed: 2,
            criticalFailed: 3
        };

        expect(() => evaluateQualityGateDetailed(result, 95)).toThrow(
            "Critical failed tests cannot exceed failed tests"
        );
    });

    it.each([
        [100, 95, 95],
        [200, 185, 92.5],
        [8, 7, 87.5],
        [3, 2, 200 / 3]
    ])(
        "should calculate actual pass rate for %i total and %i passed",
        (total, passed, expectedPassRate) => {
            const result = {
                total,
                passed,
                failed: total - passed,
                criticalFailed: 0
            };

            const report = evaluateQualityGateDetailed(result, 95);

            expect(report.actualPassRate).toBeCloseTo(expectedPassRate);
        }
    );

    it("should pass when actual pass rate equals minimum threshold", () => {
        const result = {
            total: 100,
            passed: 90,
            failed: 10,
            criticalFailed: 0
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
            criticalFailed: 0
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
            criticalFailed: 0
        };

        const report = evaluateQualityGateDetailed(result, 66.67);

        expect(report.passRatePassed).toBe(false);
        expect(report.passed).toBe(false);
        expect(report.reasons).toEqual(["Pass rate 66.67% is below minimum 66.67%"]);
    });
});
