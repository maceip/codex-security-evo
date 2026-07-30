/**
 * Manifest integration.
 *
 * Collects state from all four capabilities after a scan and writes
 * a conformance manifest. This is the final step in the scan lifecycle.
 */
import { type ConformanceManifest } from "./core.js";
/**
 * Build and write a conformance manifest for a completed scan.
 *
 * @param scanId — the scan that completed
 * @param scanTimestamp — ISO timestamp
 * @param language — repository language
 * @param notes — optional additional context
 */
export declare function emitManifest(scanId: string, scanTimestamp: string, language: string, notes?: string): Promise<ConformanceManifest>;
