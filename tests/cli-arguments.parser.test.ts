import { describe, it, expect } from "vitest";
import { parseCliArguments } from "../src/cli-arguments.parser.js";

describe("CLI Arguments Parser", () => {
    it("should parse valid CLI arguments", () => {
        const args = ["100", "98", "2", "0", "95", "quality-gate-report.json"];

        const parsed = parseCliArguments(args);

        expect(parsed).toEqual({
            result: {
                total: 100,
                passed: 98,
                failed: 2,
                criticalFailed: 0
            },
            minimumPassRate: 95,
            filePath: "quality-gate-report.json"
        });
    });

    it("should reject non-numeric total argument", () => {
        const args = ["abc", "98", "2", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: total");
    });

    it("should reject fractional total argument", () => {
        const args = ["12.5", "10", "2", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: total");
    });

    it("should reject negative total argument", () => {
        const args = ["-5", "0", "0", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: total");
    });

    it("should reject zero total argument", () => {
        const args = ["0", "0", "0", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: total");
    });

    it("should reject non-numeric passed argument", () => {
        const args = ["100", "abc", "2", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: passed");
    });

    it("should reject negative failed argument", () => {
        const args = ["100", "98", "-2", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: failed");
    });

    it("should reject negative criticalFailed argument", () => {
        const args = ["100", "98", "2", "-1", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: criticalFailed");
    });

    it("should reject non-numeric minimumPassRate argument", () => {
        const args = ["100", "98", "2", "0", "abc", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: minimumPassRate");
    });

    it("should reject minimumPassRate greater than 100", () => {
        const args = ["100", "98", "2", "0", "101", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: minimumPassRate");
    });

    it("should accept minimumPassRate equal to 100", () => {
        const args = ["100", "98", "2", "0", "100", "quality-gate-report.json"];

        const parsed = parseCliArguments(args);

        expect(parsed.minimumPassRate).toBe(100);
    });

    it("should accept minimumPassRate equal to 0", () => {
        const args = ["100", "98", "2", "0", "0", "quality-gate-report.json"];

        const parsed = parseCliArguments(args);

        expect(parsed.minimumPassRate).toBe(0);
    });

    it("should reject minimumPassRate less than 0", () => {
        const args = ["100", "98", "2", "0", "-1", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: minimumPassRate");
    });

    it("should reject inconsistent passed and failed counts", () => {
        const args = ["100", "98", "5", "0", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow();
    });

    it("should reject criticalFailed greater than failed", () => {
        const args = ["100", "98", "2", "3", "95", "quality-gate-report.json"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow();
    });

    it("should reject more than six CLI arguments", () => {
        const args = ["100", "98", "2", "0", "95", "quality-gate-report.json", "extra"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI arguments count");
    });

    it("should reject fewer than six CLI arguments", () => {
        const args = ["100", "98", "2", "0", "95"];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI arguments count");
    });

    it("should reject empty filePath", () => {
        const args = ["100", "98", "2", "0", "95", ""];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: filePath");
    });

    it("should reject whitespace-only filePath", () => {
        const args = ["100", "98", "2", "0", "95", "   "];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: filePath");
    });

    it("should preserve filePath with surrounding spaces", () => {
        const args = ["100", "98", "2", "0", "95", "  report.json  "];

        const parsed = parseCliArguments(args);

        expect(parsed.filePath).toBe("  report.json  ");
    });

    it("should reject filePath containing only whitespace characters", () => {
        const args = ["100", "98", "2", "0", "95", " \t\n "];

        expect(() => {
            parseCliArguments(args);
        }).toThrow("Invalid CLI argument: filePath");
    });
});
