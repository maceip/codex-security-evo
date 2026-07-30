/**
 * FoT deposit logic.
 *
 * After a successful scan, deposit an insight capsule. The DAG edge for the
 * final phase (report_generation) must be a success — that's how we know the
 * scan succeeded.
 *
 * Engineers don't need to call this directly. It's triggered automatically
 * during scan finalization.
 */
import { type InsightCapsule, type VulnerabilityClass } from "./core.js";
/**
 * Automatically deposit an insight after a successful scan.
 * This is called during scan finalization (finishScan).
 *
 * @param scanId — the scan that just completed
 * @param language — repository language
 * @param vulnerabilityClass — the vulnerability class the scan detected
 * @param summary — human-readable summary of what was learned
 * @param hints — structured hints (CLI args, config changes, etc.)
 */
export declare function autoDeposit(scanId: string, language: string, vulnerabilityClass: VulnerabilityClass, summary: string, hints: string[]): Promise<InsightCapsule | null>;
