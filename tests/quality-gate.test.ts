
import { describe, it, expect } from "vitest";
import { evaluateQualityGate } from "../src/quality-gate.js";

describe("Quality Gate", () => {
    it.each([
        ["both rules pass", 95, 0, true],
        ["critical failure exists", 95, 1, false],
        ["pass rate too low", 99, 0, false],
        ["both rules fail", 99, 1, false]
    ])(
        "should handle %s",
        (description, minimumPassRate, criticalFailed, expectedResult) => {
            const result = {
                total: 100,
                passed: 95,
                failed: 5,
                criticalFailed
            };

            expect(
                evaluateQualityGate(result, minimumPassRate)
            ).toBe(expectedResult);
        }
    );

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
                evaluateQualityGate(result, invalidThreshold)
            ).toThrow(
                "Minimum pass rate must be between 0 and 100"
            );
        }
    );

    it("should reject inconsistent test results", () => {
        const result = {
            total: 100,
            passed: 90,
            failed: 5,
            criticalFailed: 0
        };

        expect(() =>
            evaluateQualityGate(result, 95)
        ).toThrow(
            "Passed and failed tests must equal total tests"
        );
    });
});



