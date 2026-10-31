import { describe, it, expect } from "vitest";
import { calculatePassRate } from "../src/pass-rate.calculator.js";

describe("Pass Rate Calculator", () => {

    it.each([
        [100, 95, 95],
        [200, 185, 92.5],
        [8, 7, 87.5],
        [3, 2, 200 / 3],
        [100, 0, 0],
        [100, 100, 100]
    ])(
        "should calculate pass rate for %i total and %i passed",
        (total, passed, expectedPassRate) => {
            const result = {
                total,
                passed,
                failed: total - passed,
                criticalFailed: 0
            };

            expect(
                calculatePassRate(result)
            ).toBeCloseTo(expectedPassRate);
        }
    );

    it("should reject zero total tests", () => {
        const result = {
            total: 0,
            passed: 0,
            failed: 0,
            criticalFailed: 0
        };

        expect(() =>
            calculatePassRate(result)
        ).toThrow(
            "Total tests must be greater than zero"
        );
    });

    it("should reject inconsistent test results", () => {
        const result = {
            total: 100,
            passed: 90,
            failed: 5,
            criticalFailed: 0
        };

        expect(() =>
            calculatePassRate(result)
        ).toThrow(
            "Passed and failed tests must equal total tests"
        );
    });

});