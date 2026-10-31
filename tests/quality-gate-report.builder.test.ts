import { describe, it, expect } from "vitest";

import { buildQualityGateReport } from "../src/quality-gate-report.builder.js";

describe("Quality Gate Report Builder", () => {
    it("should build report when quality gate passes", () => {
        const result = {
            total: 100,
            passed: 98,
            failed: 2,
            criticalFailed: 0
        };

        const report = buildQualityGateReport(result, 95);

        expect(report).toEqual({
            summary: {
                total: 100,
                passed: 98,
                failed: 2,
                criticalFailed: 0
            },
            minimumPassRate: 95,
            qualityGate: {
                passed: true,
                passRatePassed: true,
                criticalFailuresPassed: true,
                actualPassRate: 98,
                reasons: []
            }
        });
    });

    it("should build report when quality gate fails", () => {
        const result = {
            total: 100,
            passed: 85,
            failed: 15,
            criticalFailed: 2
        };

        const report = buildQualityGateReport(result, 95);

        expect(report).toEqual({
            summary: {
                total: 100,
                passed: 85,
                failed: 15,
                criticalFailed: 2
            },
            minimumPassRate: 95,
            qualityGate: {
                passed: false,
                passRatePassed: false,
                criticalFailuresPassed: false,
                actualPassRate: 85,
                reasons: ["Pass rate 85% is below minimum 95%", "Critical test failures detected"]
            }
        });
    });

    it("should reject inconsistent test results", () => {
        const result = {
            total: 100,
            passed: 90,
            failed: 5,
            criticalFailed: 0
        };

        expect(() => {
            buildQualityGateReport(result, 90);
        }).toThrow("Passed and failed tests must equal total tests");
    });

    it("should reject critical failures exceeding failed tests", () => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 6
        };

        expect(() => {
            buildQualityGateReport(result, 90);
        }).toThrow("Critical failed tests cannot exceed failed tests");
    });

    it("should reject negative minimum pass rate", () => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 0
        };

        expect(() => {
            buildQualityGateReport(result, -1);
        }).toThrow("Minimum pass rate must be between 0 and 100");
    });

    it("should reject minimum pass rate above 100", () => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 0
        };

        expect(() => {
            buildQualityGateReport(result, 101);
        }).toThrow("Minimum pass rate must be between 0 and 100");
    });

    it("should reject NaN minimum pass rate", () => {
        const result = {
            total: 100,
            passed: 95,
            failed: 5,
            criticalFailed: 0
        };

        expect(() => {
            buildQualityGateReport(result, NaN);
        }).toThrow("Minimum pass rate must be between 0 and 100");
    });
});
