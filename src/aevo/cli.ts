/**
 * AEvo CLI integration.
 *
 * Before a scan, check for recommendations for the target language.
 * If a recommendation exists with confidence >0.7, prompt the engineer
 * with a y/n question to accept it.
 */

import { recommendForLanguage } from "./recommend.js";

/**
 * Prompt the engineer about an AEvo recommendation before a scan.
 * Returns true if the recommendation was accepted, false if declined,
 * or null if no recommendation exists or no prompt was shown.
 */
export async function promptRecommendation(
  language: string,
): Promise<boolean | null> {
  const recommendation = await recommendForLanguage(language);
  if (!recommendation) return null;

  const confidencePct = (recommendation.confidence * 100).toFixed(1);
  console.error(
    `\n[codex-security-evo] AEvo recommendation for ${language}` +
      ` (confidence: ${confidencePct}%):`,
  );
  console.error(`  Config: ${JSON.stringify(recommendation.recommended_fingerprint.options)}`);
  console.error(
    `  Based on ${recommendation.success_count} successes / ${recommendation.failure_count} failures` +
      ` (${recommendation.total_count} total scans).`,
  );

  // In a full CLI integration this would use inquirer.
  // Placeholder: return null (skip) for non-interactive mode.
  console.error(`  [y/n] Accept this config? `);
  return null;
}
