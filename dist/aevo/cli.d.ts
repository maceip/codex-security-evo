/**
 * AEvo CLI integration — real interactive prompts.
 *
 * Before a scan, check for recommendations for the target language.
 * If a recommendation exists with confidence >0.7, prompt the engineer
 * with a real y/n question to accept it.
 * Falls back to default (accept) when not interactive.
 */
/**
 * Prompt the engineer about an AEvo recommendation before a scan.
 * Returns true if accepted, false if declined, or null if no recommendation.
 */
export declare function promptRecommendation(language: string): Promise<boolean | null>;
