/**
 * codex-security-evo entry point.
 *
 * Re-exports all capability modules. Consumers import from this file.
 *
 * ```
 * import { startScan, wrapPhase, queryInsights } from "@avery/codex-security-evo";
 * ```
 */
export type { Phase, FailureClass, PhaseOutcome, DagEdge, PreviousFailures, } from "./dag/core.js";
export { successEdge, failureEdge, } from "./dag/core.js";
export { appendEdge, queryPreviousFailures, repoFingerprint, edgesForScan, } from "./dag/store.js";
export { startScan, finishScan, wrapPhase, hintPreviousFailures, } from "./dag/cli.js";
export type { VulnerabilityClass, InsightCapsule, InsightQueryResult, } from "./fot/core.js";
export { buildCapsule, } from "./fot/core.js";
export { depositInsight, retrieveInsights, deleteInsight, } from "./fot/store.js";
export { queryInsights, printInsightHint, } from "./fot/retrieval.js";
export { autoDeposit, } from "./fot/deposit.js";
