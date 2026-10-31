import { describe, it, expect } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { exportQualityGateReport } from "../src/quality-gate-report.exporter.js";

describe("Quality Gate Report Exporter", () => {
    it("should write JSON content to a file", async () => {
        const directory = await mkdtemp(join(tmpdir(), "quality-gate-"));

        try {
            const filePath = join(directory, "quality-gate-report.json");

            const json = '{"passed":true}';

            await exportQualityGateReport(filePath, json);

            const savedContent = await readFile(filePath, "utf8");

            expect(savedContent).toBe(json);
        } finally {
            await rm(directory, {
                recursive: true,
                force: true
            });
        }
    });

    it("should reject when parent directory does not exist", async () => {
        const directory = await mkdtemp(join(tmpdir(), "quality-gate-"));

        try {
            const filePath = join(directory, "missing-folder", "quality-gate-report.json");

            const json = '{"passed":true}';

            await expect(exportQualityGateReport(filePath, json)).rejects.toMatchObject({
                code: "ENOENT"
            });
        } finally {
            await rm(directory, {
                recursive: true,
                force: true
            });
        }
    });
});
