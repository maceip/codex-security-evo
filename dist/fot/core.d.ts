/**
 * FoT (Failure Observation Transfer) core types.
 *
 * Insights are capsules of past scan experience. Engineers retrieve before a
 * scan and deposit after. Only successful scans produce insights.
 */
/** Vulnerability class — maps to the vulnerability type in a scan report. */
export type VulnerabilityClass = "sql_injection" | "path_traversal" | "ssrf" | "rce" | "xss" | "insecure_direct_object_reference" | "security_misconfiguration" | "known_vulnerability" | "crypto_weakness" | "auth_bypass" | "other";
/**
 * One insight capsule. Written after a successful scan phase and retrieved
 * before subsequent scans of the same language+vulnerability class.
 */
export interface InsightCapsule {
    /** Unique id for this capsule. */
    id: string;
    /** The scan that produced this insight. */
    source_scan_id: string;
    /** ISO timestamp of creation. */
    created_at: string;
    /** Repository language (e.g. "python", "typescript"). */
    language: string;
    /** The vulnerability class this insight covers. */
    vulnerability_class: VulnerabilityClass;
    /** Human-readable summary of what was learned. */
    summary: string;
    /** Structured hints (CLI args, config changes, etc.). */
    hints: string[];
}
/**
 * Query result for retrieval.
 */
export interface InsightQueryResult {
    vulnerability_class: VulnerabilityClass;
    language: string;
    capsules: InsightCapsule[];
}
/** Helper to build a capsule for deposit. */
export declare function buildCapsule(sourceScanId: string, language: string, vulnerabilityClass: VulnerabilityClass, summary: string, hints: string[]): InsightCapsule;
