/**
 * CLI integration for Meta-Agent DAG edges.
 *
 * Hooks into the codex-security scan lifecycle by wrapping phase execution
 * and emitting typed edges to the DAG store.
 *
 * Also provides a query helper to show previous failures for a phase.
 */
import { type Phase, type FailureClass, type PreviousFailures, type PhaseOutcome } from "./core.js";
/**
 * Start a new scan: generate a scan id and write it to a state file so that
 * all phase wrappers share the same scan id.
 */
export declare function startScan(repoPath: string): Promise<{
    scanId: string;
    timestamp: string;
    fingerprint: string;
}>;
/**
 * Finish a scan: emit edges for any un-emitted phases and clean up the scan id.
 */
export declare function finishScan(): Promise<void>;
/**
 * Wrap a phase function: emit a success or failure edge, and on failure show
 * a hint with previous failure counts.
 *
 * @param phase — the phase name
 * @param fn — the actual phase function (returns a PhaseOutcome)
 */
export declare function wrapPhase(phase: Phase, fn: () => Promise<PhaseOutcome>): Promise<PhaseOutcome>;
/**
 * Query and print a summary of previous failures for a phase + failure class.
 * Returns the PreviousFailures object for programmatic use.
 */
export declare function hintPreviousFailures(phase: Phase, failureClass: FailureClass, repoFingerprint?: string): Promise<PreviousFailures>;
