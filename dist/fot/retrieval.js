/**
 * FoT retrieval logic.
 *
 * Before a scan, retrieve insights for the target language + vulnerability class.
 * Engineers see relevant past experience before they begin.
 */
import { retrieveInsights } from "./store.js";
/**
 * Retrieve insights for a language + vulnerability class.
 * Returns the query result with all matching capsules.
 */
export async function queryInsights(language, vulnerabilityClass) {
    const capsules = await retrieveInsights(language, vulnerabilityClass);
    return {
        vulnerability_class: vulnerabilityClass,
        language,
        capsules,
    };
}
/**
 * Print a summary of retrieved insights to stderr (CLI integration).
 * Returns the number of capsules found.
 */
export async function printInsightHint(language, vulnerabilityClass) {
    const result = await queryInsights(language, vulnerabilityClass);
    if (result.capsules.length === 0)
        return 0;
    const noun = result.capsules.length === 1 ? "insight" : "insights";
    console.error(`[codex-security-evo] FoT: ${result.capsules.length} ${noun}` +
        ` for ${language} / ${vulnerabilityClass}. Retrieving for scan context.`);
    for (const cap of result.capsules.slice(0, 3)) {
        console.error(`  - ${cap.summary}`);
        if (cap.hints.length > 0) {
            console.error(`    hints: ${cap.hints.join(", ")}`);
        }
    }
    return result.capsules.length;
}
