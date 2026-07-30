/**
 * MOSS (Model Orchestrated Security Suggestions) core types.
 *
 * Collects failure evidence from DAG edges. At threshold 5 same-class failures
 * for the same language, emits a config-change proposal.
 */
/** Threshold at which a proposal fires. */
export const PROPOSAL_THRESHOLD = 5;
/** Known suggestions map — failure class -> human-readable suggestion. */
export function suggestionForFailureClass(failureClass) {
    const suggestions = {
        network_timeout: "Increase --timeout or add retry_with_backoff in config",
        auth_expired: "Rotate API keys and set --auth-refresh-interval",
        plugin_mismatch: "Pin plugin versions in config or use --plugin-compat-mode",
        cost_limit_hit: "Raise --cost-limit or switch to --cheaper-model",
        python_unavailable: "Ensure python3 is on PATH or set --python-path",
        output_dir_conflict: "Set --output-dir to a unique path per scan",
        internal_error: "Update to latest codex-security version or check logs",
    };
    return suggestions[failureClass] ?? "Review scan config for this failure class";
}
