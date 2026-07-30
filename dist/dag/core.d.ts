/**
 * Meta-Agent DAG edge types.
 *
 * Every scan phase emits one edge. Edges are typed, carry failure attribution,
 * and are written to an append-only JSONL store.
 */
/** All phases in a codex-security scan lifecycle. */
export type Phase = "target_resolution" | "authentication" | "plugin_bootstrap" | "scan_execution" | "report_generation";
/** Known failure classes that a phase can produce. */
export type FailureClass = "network_timeout" | "auth_expired" | "plugin_mismatch" | "cost_limit_hit" | "python_unavailable" | "output_dir_conflict" | "internal_error" | "unknown";
/** Outcome of a single phase. */
export interface PhaseOutcome {
    /** The phase that ran. */
    phase: Phase;
    /** When this phase started (Unix ms). */
    started_at: number;
    /** When this phase ended (Unix ms). */
    finished_at: number;
    /** True if the phase completed without error. */
    succeeded: boolean;
    /** Human-readable status message. */
    status: string;
    /** If failed, the failure class. */
    failure_class?: FailureClass;
    /** If failed, the error message. */
    error?: string;
}
/**
 * One DAG edge = one phase outcome, plus context that ties it to a scan.
 * Written to the store as a single JSON line.
 */
export interface DagEdge {
    /** Unique scan id that this edge belongs to. */
    scan_id: string;
    /** Repository fingerprint (sha256 of remote URL or local path). */
    repo_fingerprint: string;
    /** ISO timestamp of the scan. */
    scan_timestamp: string;
    /** The phase outcome. */
    outcome: PhaseOutcome;
}
/**
 * Summary of previous failures for a given (phase, failure_class) pair.
 * Queried from the DAG store before showing the engineer a hint.
 */
export interface PreviousFailures {
    phase: Phase;
    failure_class: FailureClass;
    count: number;
    /** ISO timestamps of the most recent failures. */
    recent_timestamps: string[];
}
/** Helper to build an edge for a successful phase. */
export declare function successEdge(scan_id: string, repo_fingerprint: string, scan_timestamp: string, phase: Phase, started_at: number, finished_at: number, status: string): DagEdge;
/** Helper to build an edge for a failed phase. */
export declare function failureEdge(scan_id: string, repo_fingerprint: string, scan_timestamp: string, phase: Phase, started_at: number, finished_at: number, failure_class: FailureClass, error: string): DagEdge;
