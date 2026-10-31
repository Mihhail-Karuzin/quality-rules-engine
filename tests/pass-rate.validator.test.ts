import { describe, it, expect } from "vitest";
import { validateMinimumPassRate } from "../src/pass-rate.validator.js";

describe("Minimum Pass Rate Validator", () => {

    it.each([
        ["zero", 0],
        ["standard", 95],
        ["fractional", 95.5],
        ["maximum", 100]
    ])(
        "should accept %s threshold",
        (description, threshold) => {
            expect(() =>
                validateMinimumPassRate(threshold)
            ).not.toThrow();
        }
    );

    it.each([
        ["negative", -1],
        ["above maximum", 101],
        ["NaN", NaN],
        ["positive Infinity", Infinity],
        ["negative Infinity", -Infinity]
    ])(
        "should reject %s threshold",
        (description, threshold) => {
            expect(() =>
                validateMinimumPassRate(threshold)
            ).toThrow(
                "Minimum pass rate must be between 0 and 100"
            );
        }
    );

});