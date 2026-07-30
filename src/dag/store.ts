/**
 * Append-only JSONL store for DAG edges.
 *
 * Path: `~/.codex-security/dag/` — one file per calendar date (ISO date prefix).
 * Each line is a single JSON object (DagEdge).
 */

import { type DagEdge, type Phase, type FailureClass, type PreviousFailures } from "./core.js";
import { open, mkdir } from "node:fs/promises";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

/** Root directory for all evo state. */
export const EVO_STATE_ROOT: string = join(homedir(), ".codex-security");

/** Directory for DAG edges. */
export const DAG_DIR: string = join(EVO_STATE_ROOT, "dag");

/** ISO date string (YYYY-MM-DD) for today. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Full path to the DAG file for a given date. */
function dagFilePath(dateStr?: string): string {
  return join(DAG_DIR, `edges-${dateStr ?? today()}.jsonl`);
}

/** Compute a stable repo fingerprint from a URL or local path. */
export function repoFingerprint(repoPath: string): string {
  return createHash("sha256").update(repoPath).digest("hex").slice(0, 16);
}

/**
 * Append one edge to today's DAG file.
 * Creates the file and parent dir if they don't exist.
 */
export async function appendEdge(edge: DagEdge): Promise<void> {
  await mkdir(DAG_DIR, { recursive: true });
  const path = dagFilePath();
  const fd = await open(path, "a"); // append mode
  try {
    await fd.write(JSON.stringify(edge) + "\n");
  } finally {
    await fd.close();
  }
}

/**
 * Query previous failures for a given (phase, failure_class) pair across all
 * DAG files. Returns the count and the 5 most recent timestamps.
 */
export async function queryPreviousFailures(
  phase: Phase,
  failureClass: FailureClass,
  repoFingerprint?: string,
): Promise<PreviousFailures> {
  const dir = DAG_DIR;
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.startsWith("edges-") && f.endsWith(".jsonl"));
  } catch {
    // Directory doesn't exist yet — no failures.
    return { phase, failure_class: failureClass, count: 0, recent_timestamps: [] };
  }

  // Sort by date descending (most recent first).
  files.sort().reverse();

  const failures: Array<{ scan_id: string; timestamp: string }> = [];
  for (const file of files.slice(0, 30)) {
    const content = await readFile(join(dir, file), "utf8");
    for (const line of content.split("\n").filter(Boolean)) {
      const edge: DagEdge = JSON.parse(line);
      if (
        edge.outcome.phase === phase &&
        edge.outcome.failure_class === failureClass &&
        !edge.outcome.succeeded &&
        (!repoFingerprint || edge.repo_fingerprint === repoFingerprint)
      ) {
        failures.push({ scan_id: edge.scan_id, timestamp: edge.scan_timestamp });
      }
    }
  }

  // Sort by timestamp descending.
  failures.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return {
    phase,
    failure_class: failureClass,
    count: failures.length,
    recent_timestamps: failures.slice(0, 5).map((f) => f.timestamp),
  };
}

/**
 * Read all edges for a given scan_id from today's DAG file.
 * Used to reconstruct the full scan DAG for a scan.
 */
export async function edgesForScan(scanId: string): Promise<DagEdge[]> {
  const dir = DAG_DIR;
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.startsWith("edges-") && f.endsWith(".jsonl"));
  } catch {
    return [];
  }

  const edges: DagEdge[] = [];
  for (const file of files) {
    const content = await readFile(join(dir, file), "utf8");
    for (const line of content.split("\n").filter(Boolean)) {
      const edge: DagEdge = JSON.parse(line);
      if (edge.scan_id === scanId) {
        edges.push(edge);
      }
    }
  }
  return edges;
}
