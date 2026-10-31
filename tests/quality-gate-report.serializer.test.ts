import { describe, it, expect } from "vitest";

import { buildQualityGateReport } from "../src/quality-gate-report.builder.js";
import { serializeQualityGateReport } from "../src/quality-gate-report.serializer.js";

describe("Quality Gate Report Serializer", () => {
    it("should serialize a passing quality gate report", () => {
        const result = {
            total: 100,
            passed: 98,
            failed: 2,
            criticalFailed: 0
        };

        const report = buildQualityGateReport(result, 95);

        const json = serializeQualityGateReport(report);

        expect(typeof json).toBe("string");

        expect(JSON.parse(json)).toEqual(report);
    });

    it("should serialize a failing quality gate report", () => {
        const result = {
            total: 100,
            passed: 85,
            failed: 15,
            criticalFailed: 2
        };

        const report = buildQualityGateReport(result, 95);

        const json = serializeQualityGateReport(report);

        expect(JSON.parse(json)).toEqual(report);

        expect(JSON.parse(json).qualityGate.reasons).toEqual([
            "Pass rate 85% is below minimum 95%",
            "Critical test failures detected"
        ]);
    });

    it("should produce valid JSON text", () => {
        const result = {
            total: 10,
            passed: 9,
            failed: 1,
            criticalFailed: 0
        };

        const report = buildQualityGateReport(result, 80);

        const json = serializeQualityGateReport(report);

        expect(() => JSON.parse(json)).not.toThrow();
    });

    it("should format JSON with two-space indentation", () => {
        const result = {
            total: 10,
            passed: 9,
            failed: 1,
            criticalFailed: 0
        };

        const report = buildQualityGateReport(result, 80);

        const json = serializeQualityGateReport(report);

        expect(json).toBe(JSON.stringify(report, null, 2));
    });

    it("should produce multiline JSON", () => {
        const result = {
            total: 100,
            passed: 98,
            failed: 2,
            criticalFailed: 0
        };

        const report = buildQualityGateReport(result, 95);

        const json = serializeQualityGateReport(report);

        expect(json).toContain("\n");
        expect(json).toContain('  "summary": {');
    });
});
