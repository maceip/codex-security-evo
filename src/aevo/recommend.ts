/**
 * AEvo recommendation engine.
 *
 * Analyzes recorded outcomes for a language, computes confidence for each
 * config fingerprint, and emits a recommendation when confidence >0.7.
 */

import {
  type AevoConfigFingerprint,
  type RepoTypeRecommendation,
  AEVO_CONFIDENCE_THRESHOLD,
  computeConfidence,
} from "./core.js";
import { recordsForLanguage } from "./state.js";

/**
 * Compute recommendations for a language based on recorded outcomes.
 * Returns the best recommendation if confidence exceeds threshold.
 */
export async function recommendForLanguage(
  language: string,
): Promise<RepoTypeRecommendation | null> {
  const records = await recordsForLanguage(language);
  if (records.length === 0) return null;

  // Group records by config fingerprint (serialized to JSON key).
  const groups: Record<string, { fingerprint: AevoConfigFingerprint; successes: number; failures: number }> = {};

  for (const rec of records) {
    const key = JSON.stringify(rec.fingerprint.options);
    const entry = groups[key];
    if (entry) {
      if (rec.succeeded) entry.successes++;
      else entry.failures++;
    } else {
      groups[key] = {
        fingerprint: rec.fingerprint,
        successes: rec.succeeded ? 1 : 0,
        failures: rec.succeeded ? 0 : 1,
      };
    }
  }

  let best: RepoTypeRecommendation | null = null;

  for (const entry of Object.values(groups)) {
    const confidence = computeConfidence(entry.successes, entry.failures, records.length);

    if (confidence >= AEVO_CONFIDENCE_THRESHOLD) {
      if (!best || confidence > best.confidence) {
        best = {
          language,
          confidence,
          recommended_fingerprint: entry.fingerprint,
          success_count: entry.successes,
          failure_count: entry.failures,
          total_count: records.length,
        };
      }
    }
  }

  return best;
}

/**
 * Get recommendations for all languages that have enough data.
 */
export async function recommendAll(): Promise<RepoTypeRecommendation[]> {
  // Collect unique languages from all records.
  const { loadAevoState } = await import("./state.js");
  const state = await loadAevoState();
  const languages = new Set(state.records.map((r) => r.fingerprint.language));

  const results: RepoTypeRecommendation[] = [];
  for (const lang of languages) {
    const rec = await recommendForLanguage(lang);
    if (rec) results.push(rec);
  }
  return results;
}
