import { describe, it, expect } from "vitest";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { generateQualityGateReport } from "../src/quality-gate-report.pipeline.js";
import { buildQualityGateReport } from "../src/quality-gate-report.builder.js";

describe("Quality Gate Report Pipeline", () => {
  it("should generate a JSON report file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "quality-gate-pipeline-"));

    try {
      const filePath = join(directory, "quality-gate-report.json");

      const result = {
        total: 100,
        passed: 98,
        failed: 2,
        criticalFailed: 0,
      };

      const minimumPassRate = 95;

      const qualityGatePassed = await generateQualityGateReport(
        result,
        minimumPassRate,
        filePath,
      );

      expect(qualityGatePassed).toBe(true);

      const savedContent = await readFile(filePath, "utf8");

      const expectedReport = buildQualityGateReport(result, minimumPassRate);

      expect(JSON.parse(savedContent)).toEqual(expectedReport);
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should return false and save the report when the quality gate fails", async () => {
    const directory = await mkdtemp(join(tmpdir(), "quality-gate-pipeline-"));

    try {
      const filePath = join(directory, "failed-quality-gate-report.json");

      const result = {
        total: 100,
        passed: 80,
        failed: 20,
        criticalFailed: 0,
      };

      const minimumPassRate = 95;

      // Generate the report and capture the quality gate result
      const qualityGatePassed = await generateQualityGateReport(
        result,
        minimumPassRate,
        filePath,
      );

      // Verify the returned quality gate result
      expect(qualityGatePassed).toBe(false);

      // Verify that the report was saved despite the failed quality gate
      const savedContent = await readFile(filePath, "utf8");
      const savedReport = JSON.parse(savedContent);

      expect(savedReport.qualityGate.passed).toBe(false);
      expect(savedReport.qualityGate.passRatePassed).toBe(false);
      expect(savedReport.qualityGate.actualPassRate).toBe(80);

      const expectedReport = buildQualityGateReport(result, minimumPassRate);

      expect(savedReport).toEqual(expectedReport);
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should not create a report file when input is invalid", async () => {
    const directory = await mkdtemp(join(tmpdir(), "quality-gate-pipeline-"));

    try {
      const filePath = join(directory, "quality-gate-report.json");

      const invalidResult = {
        total: 100,
        passed: 90,
        failed: 5,
        criticalFailed: 0,
      };

      await expect(
        generateQualityGateReport(invalidResult, 95, filePath),
      ).rejects.toThrow();

      await expect(access(filePath)).rejects.toMatchObject({
        code: "ENOENT",
      });
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should reject when report file cannot be written", async () => {
    const directory = await mkdtemp(join(tmpdir(), "quality-gate-pipeline-"));

    try {
      const filePath = join(
        directory,
        "missing-folder",
        "quality-gate-report.json",
      );

      const result = {
        total: 100,
        passed: 98,
        failed: 2,
        criticalFailed: 0,
      };

      await expect(
        generateQualityGateReport(result, 95, filePath),
      ).rejects.toMatchObject({
        code: "ENOENT",
      });
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      });
    }
  });
});
