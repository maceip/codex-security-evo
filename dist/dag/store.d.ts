/**
 * Append-only JSONL store for DAG edges.
 *
 * Path: `~/.codex-security/dag/` — one file per calendar date (ISO date prefix).
 * Each line is a single JSON object (DagEdge).
 */
import { type DagEdge, type Phase, type FailureClass, type PreviousFailures } from "./core.js";
/** Root directory for all evo state. */
export declare const EVO_STATE_ROOT: string;
/** Directory for DAG edges. */
export declare const DAG_DIR: string;
/** Compute a stable repo fingerprint from a URL or local path. */
export declare function repoFingerprint(repoPath: string): string;
/**
 * Append one edge to today's DAG file.
 * Creates the file and parent dir if they don't exist.
 */
export declare function appendEdge(edge: DagEdge): Promise<void>;
/**
 * Query previous failures for a given (phase, failure_class) pair across all
 * DAG files. Returns the count and the 5 most recent timestamps.
 */
export declare function queryPreviousFailures(phase: Phase, failureClass: FailureClass, repoFingerprint?: string): Promise<PreviousFailures>;
/**
 * Read all edges for a given scan_id from today's DAG file.
 * Used to reconstruct the full scan DAG for a scan.
 */
export declare function edgesForScan(scanId: string): Promise<DagEdge[]>;
