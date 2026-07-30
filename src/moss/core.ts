/**
 * MOSS (Model Orchestrated Security Suggestions) core types.
 *
 * Collects failure evidence from DAG edges. At threshold 5 same-class failures
 * for the same language, emits a config-change proposal.
 */

/** A single piece of failure evidence collected from a DAG edge. */
export interface MossEvidence {
  /** The scan id that produced this evidence. */
  scan_id: string;
  /** The failure class. */
  failure_class: string;
  /** The repository language. */
  language: string;
  /** ISO timestamp of the failure. */
  timestamp: string;
  /** The error message. */
  error: string;
}

/** A config-change proposal generated when threshold is reached. */
export interface MossProposal {
  /** Unique proposal id. */
  id: string;
  /** The failure class that triggered the proposal. */
  failure_class: string;
  /** The repository language. */
  language: string;
  /** ISO timestamp when the proposal was generated. */
  created_at: string;
  /** Number of matching failures that triggered this. */
  trigger_count: number;
  /** Suggested config change (human-readable). */
  suggestion: string;
  /** Whether the engineer has accepted or declined. null = pending. */
  accepted: boolean | null;
  /** ISO timestamp of the decision, if any. */
  decided_at: string | null;
}

/**
 * Group of evidence by (failure_class, language).
 * Used internally by the threshold engine.
 */
export interface EvidenceGroup {
  failure_class: string;
  language: string;
  evidence: MossEvidence[];
}

/** Threshold at which a proposal fires. */
export const PROPOSAL_THRESHOLD = 5;

/** Known suggestions map — failure class -> human-readable suggestion. */
export function suggestionForFailureClass(failureClass: string): string {
  const suggestions: Record<string, string> = {
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
