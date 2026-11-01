# Quality Rules Engine

A TypeScript-based quality rules engine for evaluating automated test results.

The project calculates pass rates, checks critical failures, evaluates quality gates, and generates JSON reports.

## Features

- Input validation for automated test results.
- Pass rate calculation based on passed and total tests.
- Critical failure validation to detect high-priority test failures.
- Quality gate evaluation based on configurable quality criteria.
- JSON report generation and export of quality gate results.
- Command-line interface (CLI) for running quality gate checks.
- Automated unit and integration tests using Vitest.
- Continuous integration (CI) using GitHub Actions.

## Technologies

- TypeScript — application development and static type checking.
- Node.js — JavaScript runtime environment for running the application and development tools.
- Vitest — automated unit and integration testing framework.
- GitHub Actions — continuous integration for automated type checks, builds, and tests.
- npm — dependency management and project script execution.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mihhail-Karuzin/quality-rules-engine.git
   ```

2. Navigate to the project directory:

   ```bash
   cd quality-rules-engine
   ```

3. Install dependencies:

   ```bash
   npm ci
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Run automated tests:

   ```bash
   npm test
   ```

6. Run TypeScript type checking:

   ```bash
   npm run typecheck
   ```

7. Run TypeScript type checking for tests:

   ```bash
   npx tsc -p tests/tsconfig.json
   ```

## CLI Usage

Run the Quality Rules Engine with the following command:

```bash
node dist/cli.js 100 98 2 0 95
```

The CLI accepts five arguments in the following order:

1. `total` — total number of tests.
2. `passed` — number of passed tests.
3. `failed` — number of failed tests.
4. `criticalFailed` — number of critical test failures.
5. `minimumPassRate` — minimum required pass rate (percentage).

### Successful Quality Gate

When the quality criteria are satisfied, the CLI returns a PASS result and exits with code 0.

### Failed Quality Gate

When the quality criteria are not satisfied, the CLI returns a FAIL result and exits with code 1.

## JSON Reports

The Quality Rules Engine generates JSON reports containing the quality gate evaluation results.

Each JSON report contains information about:

- Total number of tests.
- Number of passed and failed tests.
- Number of critical failures.
- Calculated pass rate.
- Minimum required pass rate.
- Final quality gate result (PASS or FAIL).

To generate a JSON report, run:

```bash
node dist/cli.js 100 98 2 0 95 quality-report.json
```

The generated JSON report can be used to analyze quality gate results and investigate failed quality checks.

## Continuous Integration

This project uses GitHub Actions to automatically run quality checks on pushes to the main branch and pull requests targeting the main branch.

The CI pipeline performs the following automated checks:

- TypeScript type checking for application source code (`npm run typecheck`).
- TypeScript type checking for automated tests (`npx tsc -p tests/tsconfig.json`).
- Project build (`npm run build`).
- Automated tests using Vitest (`npm test`).

If any required check fails, the GitHub Actions workflow is marked as failed, helping developers detect problems before merging changes into the main branch.
