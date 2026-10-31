import type { TestResult } from "./test-result.js";
import { validateTestResult } from "./test-result.validator.js";

// Interface: describes the structure of parsed CLI arguments
export interface CliArguments {
    result: TestResult;
    minimumPassRate: number;
    filePath: string;
}

// Function: converts CLI strings into structured data
export function parseCliArguments(args: string[]): CliArguments {
    // Validate the exact number of CLI arguments
    if (args.length !== 6) {
        throw new Error("Invalid CLI arguments count");
    }
    const [total, passed, failed, criticalFailed, minimumPassRate, filePath] = args;

    const parsedTotal = Number(total);

    if (!Number.isInteger(parsedTotal) || parsedTotal <= 0) {
        throw new Error("Invalid CLI argument: total");
    }

    const parsedPassed = Number(passed);

    if (!Number.isInteger(parsedPassed) || parsedPassed < 0) {
        throw new Error("Invalid CLI argument: passed");
    }

    const parsedFailed = Number(failed);

    if (!Number.isInteger(parsedFailed) || parsedFailed < 0) {
        throw new Error("Invalid CLI argument: failed");
    }

    const parsedCriticalFailed = Number(criticalFailed);

    if (!Number.isInteger(parsedCriticalFailed) || parsedCriticalFailed < 0) {
        throw new Error("Invalid CLI argument: criticalFailed");
    }
    const parsedMinimumPassRate = Number(minimumPassRate);

    if (
        !Number.isFinite(parsedMinimumPassRate) ||
        parsedMinimumPassRate < 0 ||
        parsedMinimumPassRate > 100
    ) {
        throw new Error("Invalid CLI argument: minimumPassRate");
    }

    const result: TestResult = {
        total: parsedTotal,
        passed: parsedPassed,
        failed: parsedFailed,
        criticalFailed: parsedCriticalFailed
    };

    // Validate relationships between test result fields
    validateTestResult(result);

    // Validate that the output file path is not empty
    if (filePath.trim() === "") {
        throw new Error("Invalid CLI argument: filePath");
    }

    return {
        result,
        minimumPassRate: parsedMinimumPassRate,
        filePath
    };
}
