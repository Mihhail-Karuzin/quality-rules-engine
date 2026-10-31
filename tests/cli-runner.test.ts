import { describe, it, expect } from "vitest";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runCli } from "../src/cli-runner.js";

describe("CLI Runner", () => {
  it("should generate a report from valid CLI arguments", async () => {
    // Create a temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "report.json");

    try {
      const args = ["100", "98", "2", "0", "95", filePath];

      // Execute the CLI runner and capture the quality gate result
      const qualityGatePassed = await runCli(args);

      // Verify that the quality gate passed
      expect(qualityGatePassed).toBe(true);

      // Read the generated JSON report
      const json = await readFile(filePath, "utf8");
      const report = JSON.parse(json);

      // Verify the report contains the expected data
      expect(report.summary.total).toBe(100);
      expect(report.summary.passed).toBe(98);
      expect(report.summary.failed).toBe(2);
    } finally {
      // Remove temporary test files
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should return false and generate a report when the quality gate fails", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "failed-report.json");

    try {
      const args = ["100", "80", "20", "0", "95", filePath];

      // Execute the CLI runner
      const qualityGatePassed = await runCli(args);

      // Verify the returned quality gate result
      expect(qualityGatePassed).toBe(false);

      // Verify that the report was generated
      const json = await readFile(filePath, "utf8");
      const report = JSON.parse(json);

      expect(report.summary.total).toBe(100);
      expect(report.summary.passed).toBe(80);
      expect(report.summary.failed).toBe(20);

      // Verify the quality gate result in the JSON report
      expect(report.qualityGate.passed).toBe(false);
      expect(report.qualityGate.passRatePassed).toBe(false);
      expect(report.qualityGate.actualPassRate).toBe(80);
    } finally {
      // Remove temporary test files
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should reject invalid CLI arguments", async () => {
    const args = ["invalid", "98", "2", "0", "95", "report.json"];

    await expect(runCli(args)).rejects.toThrow("Invalid CLI argument: total");
  });

  it("should not create a report when CLI arguments are invalid", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "report.json");

    try {
      const args = ["invalid", "98", "2", "0", "95", filePath];

      // Verify that the runner rejects invalid arguments
      await expect(runCli(args)).rejects.toThrow("Invalid CLI argument: total");

      // Verify that no report file was created
      await expect(access(filePath)).rejects.toMatchObject({
        code: "ENOENT",
      });
    } finally {
      // Clean up the temporary directory
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });
});
