/**
 * Manifest integration.
 *
 * Collects state from all four capabilities after a scan and writes
 * a conformance manifest. This is the final step in the scan lifecycle.
 */

import {
  type ConformanceManifest,
  type CapabilityRecord,
  type CapabilityName,
  CAPABILITY_NAMES,
} from "./core.js";
import { writeManifest } from "./writer.js";
import { DAG_DIR } from "../dag/store.js";
import { INSIGHTS_DIR } from "../fot/store.js";
import { MOSS_DIR } from "../moss/proposal.js";
import { AEVO_STATE_PATH } from "../aevo/state.js";
import { readdir, readFile } from "node:fs/promises";

/**
 * Check if a capability is active by inspecting its state directory/file.
 */
async function checkCapability(name: CapabilityName): Promise<CapabilityRecord> {
  switch (name) {
    case "dag": {
      try {
        const files = await readdir(DAG_DIR);
        const hasEdges = files.some((f) => f.startsWith("edges-") && f.endsWith(".jsonl"));
        return {
          name,
          active: hasEdges,
          reason: hasEdges
            ? "DAG edge store exists with recorded phase outcomes"
            : "No DAG edges recorded yet",
        };
      } catch {
        return { name, active: false, reason: "DAG store directory not found" };
      }
    }

    case "fot": {
      try {
        const files = await readdir(INSIGHTS_DIR);
        const hasCapsules = files.some((f) => f.endsWith(".json") && f !== "index.json");
        return {
          name,
          active: hasCapsules,
          reason: hasCapsules
            ? "FoT insight store has deposited capsules"
            : "No insight capsules deposited yet",
        };
      } catch {
        return { name, active: false, reason: "FoT insights directory not found" };
      }
    }

    case "moss": {
      try {
        const files = await readdir(MOSS_DIR);
        const hasProposals = files.some((f) => f.endsWith(".json"));
        return {
          name,
          active: hasProposals,
          reason: hasProposals
            ? "MOSS proposal store has recorded proposals"
            : "No proposals generated yet",
        };
      } catch {
        return { name, active: false, reason: "MOSS directory not found" };
      }
    }

    case "aevo": {
      try {
        const raw = await readFile(AEVO_STATE_PATH, "utf8");
        const state = JSON.parse(raw) as { records: unknown[] };
        const hasRecords = state.records && state.records.length > 0;
        return {
          name,
          active: hasRecords ?? false,
          reason: hasRecords
            ? "AEvo state file has recorded scan outcomes"
            : "AEvo state file exists but no records yet",
        };
      } catch {
        return { name, active: false, reason: "AEvo state file not found" };
      }
    }
  }
}

/**
 * Build and write a conformance manifest for a completed scan.
 *
 * @param scanId — the scan that completed
 * @param scanTimestamp — ISO timestamp
 * @param language — repository language
 * @param notes — optional additional context
 */
export async function emitManifest(
  scanId: string,
  scanTimestamp: string,
  language: string,
  notes?: string,
): Promise<ConformanceManifest> {
  const capabilities: CapabilityRecord[] = [];

  for (const name of CAPABILITY_NAMES) {
    const record = await checkCapability(name);
    capabilities.push(record);
  }

  const manifest: ConformanceManifest = {
    scan_id: scanId,
    scan_timestamp: scanTimestamp,
    language,
    capabilities,
    notes,
  };

  await writeManifest(manifest);
  return manifest;
}
