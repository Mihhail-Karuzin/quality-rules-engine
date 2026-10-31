import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { access } from "node:fs/promises";

const execFileAsync = promisify(execFile);

describe("CLI Process", () => {
  it("should generate a report when executed as a Node.js process", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "report.json");

    try {
      // Execute the compiled CLI as a separate process
      const { stderr } = await execFileAsync(process.execPath, [
        resolve("dist/cli.js"),
        "100",
        "98",
        "2",
        "0",
        "95",
        filePath,
      ]);

      // Verify that no errors were reported
      expect(stderr).toBe("");

      // Verify the generated JSON report
      const json = await readFile(filePath, "utf8");
      const report = JSON.parse(json);

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

  it("should exit with code 1 for invalid CLI arguments", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "report.json");

    try {
      const args = [
        resolve("dist/cli.js"),
        "invalid",
        "98",
        "2",
        "0",
        "95",
        filePath,
      ];

      // Capture the rejected child process result
      let processError: unknown;

      try {
        await execFileAsync(process.execPath, args);
      } catch (error) {
        processError = error;
      }

      // Verify that the child process failed
      expect(processError).toBeDefined();

      // Verify the process exit code
      expect(processError).toHaveProperty("code", 1);

      // Verify the error output
      expect(processError).toHaveProperty(
        "stderr",
        expect.stringContaining("Invalid CLI argument: total"),
      );

      // Verify that no report was generated
      await expect(access(filePath)).rejects.toMatchObject({
        code: "ENOENT",
      });
    } finally {
      // Remove temporary test files
      await rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  });

  it("should exit with code 1 when the quality gate fails", async () => {
    // Create an isolated temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), "quality-rules-engine-"));

    const filePath = join(tempDir, "failed-report.json");

    try {
      const args = [
        resolve("dist/cli.js"),
        "100",
        "80",
        "20",
        "0",
        "95",
        filePath,
      ];

      // Capture the rejected child process result
      let processError: unknown;

      try {
        await execFileAsync(process.execPath, args);
      } catch (error) {
        processError = error;
      }

      // Verify that the process exits with code 1
      expect(processError).toHaveProperty("code", 1);

      // Verify that the report was still generated
      const json = await readFile(filePath, "utf8");
      const report = JSON.parse(json);

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
});
