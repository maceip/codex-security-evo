/**
 * FoT insight store.
 *
 * Path: `~/.codex-security/insights/` — one JSON file per capsule.
 * Capsules are indexed by language+vulnerability_class for fast retrieval.
 */

import { type InsightCapsule, type VulnerabilityClass } from "./core.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

/** Directory for insight capsules. */
export const INSIGHTS_DIR: string = join(homedir(), ".codex-security", "insights");

/** Index file: maps "language:vulnerability_class" to capsule file names. */
const INDEX_PATH: string = join(INSIGHTS_DIR, "index.json");

/**
 * Write a capsule to disk and update the index.
 */
export async function depositInsight(capsule: InsightCapsule): Promise<void> {
  // Ensure directory exists.
  await mkdir(INSIGHTS_DIR, { recursive: true });

  const capsulePath = join(INSIGHTS_DIR, `${capsule.id}.json`);
  await writeFile(capsulePath, JSON.stringify(capsule, null, 2), "utf8");

  // Update index.
  const index = await loadIndex();
  const key = `${capsule.language}:${capsule.vulnerability_class}`;
  const entries = index[key] ?? [];
  entries.push(capsule.id);
  index[key] = entries;
  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
}

/**
 * Retrieve all capsules for a given language + vulnerability class.
 */
export async function retrieveInsights(
  language: string,
  vulnerabilityClass: VulnerabilityClass,
): Promise<InsightCapsule[]> {
  const index = await loadIndex();
  const key = `${language}:${vulnerabilityClass}`;
  const capsuleIds = index[key];
  if (!capsuleIds || capsuleIds.length === 0) return [];

  const capsules: InsightCapsule[] = [];
  for (const id of capsuleIds) {
    const path = join(INSIGHTS_DIR, `${id}.json`);
    try {
      const raw = await readFile(path, "utf8");
      capsules.push(JSON.parse(raw) as InsightCapsule);
    } catch {
      // Stale index entry — skip.
    }
  }
  return capsules;
}

/**
 * Load the index from disk, returning an empty object if it doesn't exist.
 */
async function loadIndex(): Promise<Record<string, string[]>> {
  try {
    const raw = await readFile(INDEX_PATH, "utf8");
    return JSON.parse(raw) as Record<string, string[]>;
  } catch {
    return {};
  }
}

/**
 * Delete a capsule by id. Removes the file and cleans the index.
 */
export async function deleteInsight(capsuleId: string): Promise<void> {
  const capsulePath = join(INSIGHTS_DIR, `${capsuleId}.json`);
  try {
    await writeFile(capsulePath, "", "utf8");
  } catch {
    // ignore
  }

  // Clean index.
  const index = await loadIndex();
  for (const [key, ids] of Object.entries(index)) {
    const idx = ids.indexOf(capsuleId);
    if (idx !== -1) {
      ids.splice(idx, 1);
      if (ids.length === 0) delete index[key];
    }
  }
  await writeFile(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
}
