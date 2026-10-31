import { describe, it, expect, vi } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { executeCli } from "../src/cli-executor.js";

describe("CLI Executor", () => {
  it("should return exit code 0 for valid arguments", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "report.json");
    const onError = vi.fn();

    try {
      const args = ["100", "98", "2", "0", "95", filePath];

      const exitCode = await executeCli(args, onError);

      expect(exitCode).toBe(0);
      expect(onError).not.toHaveBeenCalled();
    } finally {
      // Remove temporary files even if the test fails
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should return exit code 1 without reporting an error when the quality gate fails", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "failed-report.json");
    const onError = vi.fn();

    try {
      const args = ["100", "80", "20", "0", "95", filePath];

      // Execute the CLI with a failing quality gate
      const exitCode = await executeCli(args, onError);

      // Verify that the quality gate failure produces exit code 1
      expect(exitCode).toBe(1);

      // A failed quality gate is not a technical execution error
      expect(onError).not.toHaveBeenCalled();

      // Verify that the JSON report was still generated
      const json = await readFile(filePath, "utf8");
      const report = JSON.parse(json);

      expect(report.summary.total).toBe(100);
      expect(report.summary.passed).toBe(80);
      expect(report.summary.failed).toBe(20);

      // Verify the failed quality gate result
      expect(report.qualityGate.passed).toBe(false);
      expect(report.qualityGate.passRatePassed).toBe(false);
      expect(report.qualityGate.actualPassRate).toBe(80);
    } finally {
      // Remove temporary files
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should return exit code 1 and report invalid arguments", async () => {
    const onError = vi.fn();

    const args = ["invalid", "98", "2", "0", "95", "report.json"];

    const exitCode = await executeCli(args, onError);

    expect(exitCode).toBe(1);

    expect(onError).toHaveBeenCalledWith("Invalid CLI argument: total");

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("should return exit code 1 when report writing fails", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const onError = vi.fn();

    try {
      const args = ["100", "98", "2", "0", "95", tempDir];

      const exitCode = await executeCli(args, onError);

      expect(exitCode).toBe(1);

      expect(onError).toHaveBeenCalledTimes(1);

      expect(onError).toHaveBeenCalledWith(expect.any(String));
    } finally {
      // Remove temporary files
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });
});
