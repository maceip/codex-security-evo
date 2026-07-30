/**
 * FoT retrieval logic.
 *
 * Before a scan, retrieve insights for the target language + vulnerability class.
 * Engineers see relevant past experience before they begin.
 */
import { type VulnerabilityClass, type InsightQueryResult } from "./core.js";
/**
 * Retrieve insights for a language + vulnerability class.
 * Returns the query result with all matching capsules.
 */
export declare function queryInsights(language: string, vulnerabilityClass: VulnerabilityClass): Promise<InsightQueryResult>;
/**
 * Print a summary of retrieved insights to stderr (CLI integration).
 * Returns the number of capsules found.
 */
export declare function printInsightHint(language: string, vulnerabilityClass: VulnerabilityClass): Promise<number>;
