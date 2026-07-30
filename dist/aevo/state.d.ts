/**
 * AEvo state persistence.
 *
 * Path: `~/.codex-security/aevo.json` — single JSON file containing all
 * recorded config fingerprints and outcomes.
 */
import { type AevoState, type AevoOutcomeRecord } from "./core.js";
/** Path to the AEvo state file. */
export declare const AEVO_STATE_PATH: string;
/** Load the full AEvo state. Returns empty state if file doesn't exist. */
export declare function loadAevoState(): Promise<AevoState>;
/** Save the full AEvo state to disk. */
export declare function saveAevoState(state: AevoState): Promise<void>;
/**
 * Record a new scan outcome in the AEvo state.
 */
export declare function recordOutcome(scanId: string, timestamp: string, language: string, configOptions: Record<string, string>, succeeded: boolean, durationMs: number): Promise<void>;
/**
 * Get all records for a specific language.
 */
export declare function recordsForLanguage(language: string): Promise<AevoOutcomeRecord[]>;
