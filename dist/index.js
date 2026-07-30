/**
 * codex-security-evo entry point.
 *
 * Re-exports all capability modules. Consumers import from this file.
 *
 * ```
 * import { startScan, wrapPhase, queryInsights, promptPendingProposals,
 *   recommendForLanguage, emitManifest }
 *   from "@avery/codex-security-evo";
 * ```
 */
export { successEdge, failureEdge, } from "./dag/core.js";
export { appendEdge, queryPreviousFailures, repoFingerprint, edgesForScan, } from "./dag/store.js";
export { startScan, finishScan, wrapPhase, hintPreviousFailures, } from "./dag/cli.js";
export { buildCapsule, } from "./fot/core.js";
export { depositInsight, retrieveInsights, deleteInsight, } from "./fot/store.js";
export { queryInsights, printInsightHint, } from "./fot/retrieval.js";
export { autoDeposit, } from "./fot/deposit.js";
export { PROPOSAL_THRESHOLD, suggestionForFailureClass, } from "./moss/core.js";
export { collectEvidence, groupCount, } from "./moss/evidence.js";
export { loadPendingProposals, evaluateThreshold, recordDecision, } from "./moss/proposal.js";
export { promptPendingProposals, } from "./moss/cli.js";
export { AEVO_CONFIDENCE_THRESHOLD, computeConfidence, } from "./aevo/core.js";
export { loadAevoState, saveAevoState, recordOutcome, recordsForLanguage, } from "./aevo/state.js";
export { recommendForLanguage, recommendAll, } from "./aevo/recommend.js";
export { promptRecommendation, } from "./aevo/cli.js";
export { CAPABILITY_NAMES, } from "./manifest/core.js";
export { writeManifest, loadManifest, loadAllManifests, } from "./manifest/writer.js";
export { emitManifest, } from "./manifest/integration.js";
