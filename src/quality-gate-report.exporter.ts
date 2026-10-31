import { writeFile } from "node:fs/promises";

export async function exportQualityGateReport(
    filePath: string,
    json: string
): Promise<void> {
    await writeFile(filePath, json, "utf8");
}