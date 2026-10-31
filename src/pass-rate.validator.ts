export function validateMinimumPassRate(
    minimumPassRate: number
): void {
    if (
        !Number.isFinite(minimumPassRate) ||
        minimumPassRate < 0 ||
        minimumPassRate > 100
    ) {
        throw new Error(
            "Minimum pass rate must be between 0 and 100"
        );
    }
}