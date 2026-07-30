/**
 * FoT insight store.
 *
 * Path: `~/.codex-security/insights/` — one JSON file per capsule.
 * Capsules are indexed by language+vulnerability_class for fast retrieval.
 */
import { type InsightCapsule, type VulnerabilityClass } from "./core.js";
/** Directory for insight capsules. */
export declare const INSIGHTS_DIR: string;
/**
 * Write a capsule to disk and update the index.
 */
export declare function depositInsight(capsule: InsightCapsule): Promise<void>;
/**
 * Retrieve all capsules for a given language + vulnerability class.
 */
export declare function retrieveInsights(language: string, vulnerabilityClass: VulnerabilityClass): Promise<InsightCapsule[]>;
/**
 * Delete a capsule by id. Removes the file and cleans the index.
 */
export declare function deleteInsight(capsuleId: string): Promise<void>;
