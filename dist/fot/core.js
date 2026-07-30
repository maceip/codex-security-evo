/**
 * FoT (Failure Observation Transfer) core types.
 *
 * Insights are capsules of past scan experience. Engineers retrieve before a
 * scan and deposit after. Only successful scans produce insights.
 */
/** Helper to build a capsule for deposit. */
export function buildCapsule(sourceScanId, language, vulnerabilityClass, summary, hints) {
    const id = `fot-${sourceScanId.slice(0, 8)}-${vulnerabilityClass}-${Date.now()}`;
    return {
        id,
        source_scan_id: sourceScanId,
        created_at: new Date().toISOString(),
        language,
        vulnerability_class: vulnerabilityClass,
        summary,
        hints,
    };
}
