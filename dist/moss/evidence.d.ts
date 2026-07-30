/**
 * MOSS evidence collector.
 *
 * Reads DAG edges and extracts failure evidence grouped by
 * (failure_class, language).
 */
import { type EvidenceGroup } from "./core.js";
import type { DagEdge } from "../dag/core.js";
/**
 * Collect evidence from a list of DAG edges, grouped by (failure_class, language).
 */
export declare function collectEvidence(edges: DagEdge[], language: string): EvidenceGroup[];
/**
 * Count evidence in a group.
 */
export declare function groupCount(group: EvidenceGroup): number;
