import { runCli } from "./cli-runner.js";

// Execute the CLI workflow and return an exit code
export async function executeCli(
  args: string[],
  onError: (message: string) => void,
): Promise<number> {
  try {
    const qualityGatePassed = await runCli(args);

    return qualityGatePassed ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    onError(message);

    return 1;
  }
}
