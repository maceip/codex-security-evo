/**
 * MOSS evidence collector.
 *
 * Reads DAG edges and extracts failure evidence grouped by
 * (failure_class, language).
 */
/**
 * Convert a DAG edge into MossEvidence, if it represents a failure.
 */
function edgeToEvidence(edge, language) {
    if (edge.outcome.succeeded)
        return null;
    return {
        scan_id: edge.scan_id,
        failure_class: edge.outcome.failure_class ?? "unknown",
        language,
        timestamp: edge.scan_timestamp,
        error: edge.outcome.error ?? "unknown error",
    };
}
/**
 * Collect evidence from a list of DAG edges, grouped by (failure_class, language).
 */
export function collectEvidence(edges, language) {
    const groups = {};
    for (const edge of edges) {
        const ev = edgeToEvidence(edge, language);
        if (!ev)
            continue;
        const key = `${ev.failure_class}:${language}`;
        const list = groups[key] ?? [];
        list.push(ev);
        groups[key] = list;
    }
    return Object.entries(groups).map(([key, evidence]) => {
        const parts = key.split(":");
        const failureClass = parts[0] ?? "unknown";
        const lang = parts[1] ?? "unknown";
        return { failure_class: failureClass, language: lang, evidence };
    });
}
/**
 * Count evidence in a group.
 */
export function groupCount(group) {
    return group.evidence.length;
}
