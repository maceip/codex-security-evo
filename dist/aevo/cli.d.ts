/**
 * AEvo CLI integration.
 *
 * Before a scan, check for recommendations for the target language.
 * If a recommendation exists with confidence >0.7, prompt the engineer
 * with a y/n question to accept it.
 */
/**
 * Prompt the engineer about an AEvo recommendation before a scan.
 * Returns true if the recommendation was accepted, false if declined,
 * or null if no recommendation exists or no prompt was shown.
 */
export declare function promptRecommendation(language: string): Promise<boolean | null>;
