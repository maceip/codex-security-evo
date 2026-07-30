/**
 * AEvo CLI integration — real interactive prompts.
 *
 * Before a scan, check for recommendations for the target language.
 * If a recommendation exists with confidence >0.7, prompt the engineer
 * with a real y/n question to accept it.
 * Falls back to default (accept) when not interactive.
 */
import { recommendForLanguage } from "./recommend.js";
import { confirmOrSkip } from "../cli/interactive.js";
/**
 * Prompt the engineer about an AEvo recommendation before a scan.
 * Returns true if accepted, false if declined, or null if no recommendation.
 */
export async function promptRecommendation(language) {
    const recommendation = await recommendForLanguage(language);
    if (!recommendation)
        return null;
    const confidencePct = (recommendation.confidence * 100).toFixed(1);
    const accepted = await confirmOrSkip(`AEvo: config for ${language} (${confidencePct}% confidence) ` +
        `${JSON.stringify(recommendation.recommended_fingerprint.options)} ` +
        `(${recommendation.success_count}s/${recommendation.failure_count}f, ${recommendation.total_count} total)`, true);
    return accepted;
}
