/**
 * AEvo (Adaptive Evolution) core types.
 *
 * Tracks config fingerprints and scan outcomes. At confidence >0.7,
 * recommends the optimal config for the current repository type.
 */
/** A fingerprint of scan config options that were used. */
export interface AevoConfigFingerprint {
    /** Key-value pairs of config options (e.g. timeout, model, cost-limit). */
    options: Record<string, string>;
    /** The language this config was used with. */
    language: string;
}
/** One recorded scan outcome tied to a config fingerprint. */
export interface AevoOutcomeRecord {
    /** The scan id. */
    scan_id: string;
    /** ISO timestamp. */
    timestamp: string;
    /** The config fingerprint used. */
    fingerprint: AevoConfigFingerprint;
    /** Whether the scan succeeded overall. */
    succeeded: boolean;
    /** Duration in ms. */
    duration_ms: number;
}
/** The full AEvo state stored in ~/.codex-security/aevo.json. */
export interface AevoState {
    /** All recorded scan outcomes. */
    records: AevoOutcomeRecord[];
    /** Last updated ISO timestamp. */
    updated_at: string;
}
/** A recommendation for a specific repo type (language). */
export interface RepoTypeRecommendation {
    /** The language this recommendation is for. */
    language: string;
    /** Confidence score 0-1. Only emitted when >0.7. */
    confidence: number;
    /** The recommended config fingerprint. */
    recommended_fingerprint: AevoConfigFingerprint;
    /** Number of successful scans with this config. */
    success_count: number;
    /** Number of failed scans with this config. */
    failure_count: number;
    /** Total scans for this language. */
    total_count: number;
}
/** Confidence threshold for emitting a recommendation. */
export declare const AEVO_CONFIDENCE_THRESHOLD = 0.7;
/** Compute confidence as success_rate * sqrt(n / max_n) to require both
 *  high success rate and sufficient sample size. */
export declare function computeConfidence(successCount: number, failureCount: number, totalForLanguage: number): number;
