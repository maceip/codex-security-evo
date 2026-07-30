/**
 * codex-security-evo entry point.
 *
 * Re-exports all capability modules. Consumers import from this file.
 *
 * ```
 * import { startScan, wrapPhase } from "@avery/codex-security-evo";
 * ```
 */
export { successEdge, failureEdge, } from "./dag/core.js";
export { appendEdge, queryPreviousFailures, repoFingerprint, edgesForScan, } from "./dag/store.js";
export { startScan, finishScan, wrapPhase, hintPreviousFailures, } from "./dag/cli.js";
// Step Two — FoT (will be added in Step Two)
// Step Three — MOSS (will be added in Step Three)
// Step Four — AEvo (will be added in Step Four)
// Step Five — Manifest (will be added in Step Five)
