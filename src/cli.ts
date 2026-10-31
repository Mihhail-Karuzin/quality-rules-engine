import { executeCli } from "./cli-executor.js";

// Start the CLI application
async function main(): Promise<void> {
  // Read command-line arguments
  const args = process.argv.slice(2);

  // Execute the CLI workflow
  const exitCode = await executeCli(args, console.error);

  // Set the process exit code
  process.exitCode = exitCode;
}

// Start the application
// Handle unexpected application errors
void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
