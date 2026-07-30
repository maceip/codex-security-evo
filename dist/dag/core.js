/**
 * Meta-Agent DAG edge types.
 *
 * Every scan phase emits one edge. Edges are typed, carry failure attribution,
 * and are written to an append-only JSONL store.
 */
/** Helper to build an edge for a successful phase. */
export function successEdge(scan_id, repo_fingerprint, scan_timestamp, phase, started_at, finished_at, status) {
    return {
        scan_id,
        repo_fingerprint,
        scan_timestamp,
        outcome: {
            phase,
            started_at,
            finished_at,
            succeeded: true,
            status,
        },
    };
}
/** Helper to build an edge for a failed phase. */
export function failureEdge(scan_id, repo_fingerprint, scan_timestamp, phase, started_at, finished_at, failure_class, error) {
    return {
        scan_id,
        repo_fingerprint,
        scan_timestamp,
        outcome: {
            phase,
            started_at,
            finished_at,
            succeeded: false,
            status: `FAILED: ${error}`,
            failure_class,
            error,
        },
    };
}
