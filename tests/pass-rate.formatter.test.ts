import { describe, it, expect } from "vitest";
import { formatPassRate } from "../src/pass-rate.formatter.js";

describe("Pass Rate Formatter", () => {

    it.each([
        [95, "95"],
        [100, "100"],
        [0, "0"],
        [87.5, "87.5"],
        [92.345, "92.34"],
        [200 / 3, "66.67"]
    ])(
        "should format %s as %s",
        (value, expected) => {
            expect(formatPassRate(value)).toBe(expected);
        }
    );

});