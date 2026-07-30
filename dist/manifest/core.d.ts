/**
 * Manifest conformance core types.
 *
 * After every scan, write a manifest recording all four capabilities —
 * active or inactive with a reason. No silent skip.
 */
/** One capability record in the manifest. */
export interface CapabilityRecord {
    /** Capability name (e.g. "dag", "fot", "moss", "aevo"). */
    name: string;
    /** Whether this capability is active. */
    active: boolean;
    /** Human-readable reason for its status. */
    reason: string;
}
/** The full manifest written after each scan. */
export interface ConformanceManifest {
    /** The scan id this manifest is for. */
    scan_id: string;
    /** ISO timestamp of the scan. */
    scan_timestamp: string;
    /** The repository language. */
    language: string;
    /** Records for all four capabilities. */
    capabilities: CapabilityRecord[];
    /** Any additional context. */
    notes?: string;
}
/** All known capability names. */
export declare const CAPABILITY_NAMES: readonly ["dag", "fot", "moss", "aevo"];
export type CapabilityName = typeof CAPABILITY_NAMES[number];
