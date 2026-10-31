import { describe, it, expect } from "vitest";
import { checkCriticalFailures } from "../src/critical-failures.rule.js";

describe("Critical Failures Rule", () => {

    it.each([
        [0, true],
        [1, false],
        [3, false]
    ])(
        "should return %s critical failures result: %s",
        (criticalFailed, expectedResult) => {
            const result = {
                total: 100,
                passed: 95,
                failed: 5,
                criticalFailed
            };

            expect(
                checkCriticalFailures(result)
            ).toBe(expectedResult);
        }
    );

});

it.each([
    ["negative critical failures", -1, 5],
    ["critical failures exceed failed", 6, 5],
    ["fractional critical failures", 1.5, 5],
    ["NaN critical failures", NaN, 5],
    ["Infinity critical failures", Infinity, 5]
])(
    "should reject %s",
    (description, criticalFailed, failed) => {
        const result = {
            total: 100,
            passed: 100 - failed,
            failed,
            criticalFailed
        };

        expect(() =>
            checkCriticalFailures(result)
        ).toThrow();
    }
);