/**
 * AEvo state persistence.
 *
 * Path: `~/.codex-security/aevo.json` — single JSON file containing all
 * recorded config fingerprints and outcomes.
 */

import { type AevoState, type AevoOutcomeRecord } from "./core.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

/** Path to the AEvo state file. */
export const AEVO_STATE_PATH: string = join(homedir(), ".codex-security", "aevo.json");

/** Load the full AEvo state. Returns empty state if file doesn't exist. */
export async function loadAevoState(): Promise<AevoState> {
  try {
    const raw = await readFile(AEVO_STATE_PATH, "utf8");
    return JSON.parse(raw) as AevoState;
  } catch {
    return { records: [], updated_at: new Date().toISOString() };
  }
}

/** Save the full AEvo state to disk. */
export async function saveAevoState(state: AevoState): Promise<void> {
  await mkdir(join(homedir(), ".codex-security"), { recursive: true });
  state.updated_at = new Date().toISOString();
  await writeFile(AEVO_STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

/**
 * Record a new scan outcome in the AEvo state.
 */
export async function recordOutcome(
  scanId: string,
  timestamp: string,
  language: string,
  configOptions: Record<string, string>,
  succeeded: boolean,
  durationMs: number,
): Promise<void> {
  const state = await loadAevoState();

  const record: AevoOutcomeRecord = {
    scan_id: scanId,
    timestamp,
    fingerprint: { options: configOptions, language },
    succeeded,
    duration_ms: durationMs,
  };

  state.records.push(record);
  await saveAevoState(state);
}

/**
 * Get all records for a specific language.
 */
export async function recordsForLanguage(language: string): Promise<AevoOutcomeRecord[]> {
  const state = await loadAevoState();
  return state.records.filter((r) => r.fingerprint.language === language);
}
