/**
 * CLI integration for Meta-Agent DAG edges.
 *
 * Hooks into the codex-security scan lifecycle by wrapping phase execution
 * and emitting typed edges to the DAG store.
 *
 * Also provides a query helper to show previous failures for a phase.
 */
import { successEdge, failureEdge, } from "./core.js";
import { appendEdge, queryPreviousFailures, repoFingerprint } from "./store.js";
import { randomUUID } from "node:crypto";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
const STATE_DIR = join(homedir(), ".codex-security");
const SCAN_ID_PATH = join(STATE_DIR, "current-scan-id");
/**
 * Start a new scan: generate a scan id and write it to a state file so that
 * all phase wrappers share the same scan id.
 */
export async function startScan(repoPath) {
    const scanId = randomUUID();
    const timestamp = new Date().toISOString();
    const fingerprint = repoFingerprint(repoPath);
    await writeFile(SCAN_ID_PATH, JSON.stringify({ scanId, timestamp, fingerprint }), "utf8");
    return { scanId, timestamp, fingerprint };
}
/**
 * Read the current scan context from state. Returns null if no scan is active.
 */
export async function readScanContext() {
    try {
        const raw = await readFile(SCAN_ID_PATH, "utf8");
        if (!raw.trim())
            return null;
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
/**
 * Finish a scan: clean up the scan id state file.
 * Post-scan orchestration (FoT deposit, manifest) is handled by the CLI.
 */
export async function finishScan() {
    try {
        await writeFile(SCAN_ID_PATH, "", "utf8");
    }
    catch {
        // ignore
    }
}
/**
 * Wrap a phase function: emit a success or failure edge, and on failure show
 * a hint with previous failure counts.
 *
 * @param phase — the phase name
 * @param fn — the actual phase function (returns a PhaseOutcome)
 */
export async function wrapPhase(phase, fn) {
    const scanState = await readScanContext();
    if (!scanState) {
        throw new Error(`No active scan. Call startScan() first.`);
    }
    const { scanId, timestamp, fingerprint } = scanState;
    const startedAt = Date.now();
    try {
        const outcome = await fn();
        const finishedAt = Date.now();
        const edge = outcome.succeeded
            ? successEdge(scanId, fingerprint, timestamp, phase, startedAt, finishedAt, outcome.status)
            : failureEdge(scanId, fingerprint, timestamp, phase, startedAt, finishedAt, outcome.failure_class ?? "unknown", outcome.error ?? "unknown error");
        await appendEdge(edge);
        // On failure, query and print hint.
        if (!outcome.succeeded && outcome.failure_class) {
            const prev = await queryPreviousFailures(phase, outcome.failure_class);
            if (prev.count > 0) {
                const noun = prev.count === 1 ? "failure" : "failures";
                console.error(`[codex-security-evo] ${phase}: ${prev.count} previous ${noun}` +
                    ` for class "${outcome.failure_class}"` +
                    ` (most recent: ${prev.recent_timestamps[0] ?? "unknown"}).`);
            }
        }
        return outcome;
    }
    catch (err) {
        const finishedAt = Date.now();
        const errorMsg = err instanceof Error ? err.message : String(err);
        const edge = failureEdge(scanId, fingerprint, timestamp, phase, startedAt, finishedAt, "internal_error", errorMsg);
        await appendEdge(edge);
        console.error(`[codex-security-evo] ${phase}: UNEXPECTED ERROR — ${errorMsg}`);
        return {
            phase,
            started_at: startedAt,
            finished_at: finishedAt,
            succeeded: false,
            status: `UNEXPECTED ERROR: ${errorMsg}`,
            failure_class: "internal_error",
            error: errorMsg,
        };
    }
}
/**
 * Query and print a summary of previous failures for a phase + failure class.
 * Returns the PreviousFailures object for programmatic use.
 */
export async function hintPreviousFailures(phase, failureClass, repoFingerprint) {
    const prev = await queryPreviousFailures(phase, failureClass, repoFingerprint);
    if (prev.count > 0) {
        const noun = prev.count === 1 ? "failure" : "failures";
        console.error(`[codex-security-evo] hint: ${prev.count} previous ${noun}` +
            ` for ${phase} / ${failureClass}.`);
    }
    return prev;
}
