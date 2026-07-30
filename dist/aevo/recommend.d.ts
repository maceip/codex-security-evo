/**
 * AEvo recommendation engine.
 *
 * Analyzes recorded outcomes for a language, computes confidence for each
 * config fingerprint, and emits a recommendation when confidence >0.7.
 */
import { type RepoTypeRecommendation } from "./core.js";
/**
 * Compute recommendations for a language based on recorded outcomes.
 * Returns the best recommendation if confidence exceeds threshold.
 */
export declare function recommendForLanguage(language: string): Promise<RepoTypeRecommendation | null>;
/**
 * Get recommendations for all languages that have enough data.
 */
export declare function recommendAll(): Promise<RepoTypeRecommendation[]>;
