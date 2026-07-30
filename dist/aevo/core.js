/**
 * AEvo (Adaptive Evolution) core types.
 *
 * Tracks config fingerprints and scan outcomes. At confidence >0.7,
 * recommends the optimal config for the current repository type.
 */
/** Confidence threshold for emitting a recommendation. */
export const AEVO_CONFIDENCE_THRESHOLD = 0.7;
/** Compute confidence as success_rate * sqrt(n / max_n) to require both
 *  high success rate and sufficient sample size. */
export function computeConfidence(successCount, failureCount, totalForLanguage) {
    const total = successCount + failureCount;
    if (total === 0)
        return 0;
    const successRate = successCount / total;
    // Sample-size bonus: approaches 1 as total approaches totalForLanguage.
    const sampleFactor = Math.min(total / Math.max(totalForLanguage, 1), 1);
    return successRate * sampleFactor;
}
