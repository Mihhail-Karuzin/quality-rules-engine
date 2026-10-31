import { parseCliArguments } from "./cli-arguments.parser.js";
import { generateQualityGateReport } from "./quality-gate-report.pipeline.js";

// Parse CLI arguments and return the quality gate result
export async function runCli(args: string[]): Promise<boolean> {
  const parsed = parseCliArguments(args);

  return await generateQualityGateReport(
    parsed.result,
    parsed.minimumPassRate,
    parsed.filePath,
  );
}
