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
import { buildCapsule } from "./core.js";
import { depositInsight } from "./store.js";
import { edgesForScan } from "../dag/store.js";
/**
 * Check whether a scan succeeded by examining its DAG edges.
 * A scan succeeded if its report_generation phase succeeded.
 */
async function scanSucceeded(scanId) {
    const edges = await edgesForScan(scanId);
    const reportEdge = edges.find((e) => e.outcome.phase === "report_generation");
    return reportEdge?.outcome.succeeded ?? false;
}
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
export async function autoDeposit(scanId, language, vulnerabilityClass, summary, hints) {
    // Only deposit if the scan succeeded.
    if (!(await scanSucceeded(scanId))) {
        console.error(`[codex-security-evo] FoT: scan ${scanId.slice(0, 8)} failed — no insight deposited.`);
        return null;
    }
    const capsule = buildCapsule(scanId, language, vulnerabilityClass, summary, hints);
    await depositInsight(capsule);
    console.error(`[codex-security-evo] FoT: deposited insight ${capsule.id.slice(0, 16)}` +
        ` for ${language} / ${vulnerabilityClass}.`);
    return capsule;
}
