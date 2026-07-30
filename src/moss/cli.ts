/**
 * MOSS CLI integration.
 *
 * Before a scan, check for pending proposals and prompt the engineer
 * with a y/n question for each.
 */

import { type MossProposal, PROPOSAL_THRESHOLD } from "./core.js";
import { loadPendingProposals, recordDecision } from "./proposal.js";

/**
 * Prompt the engineer about pending MOSS proposals before a scan.
 * Returns the number of proposals that were presented.
 *
 * In a real integration this would use inquirer or similar interactive prompt.
 * For now we write to stderr and read a response from stdin.
 */
export async function promptPendingProposals(): Promise<number> {
  const proposals = await loadPendingProposals();
  if (proposals.length === 0) return 0;

  const noun = proposals.length === 1 ? "proposal" : "proposals";
  console.error(
    `[codex-security-evo] MOSS: ${proposals.length} pending config ${noun}.`,
  );

  let prompted = 0;
  for (const prop of proposals) {
    const decision = await singlePrompt(prop);
    if (decision !== null) {
      await recordDecision(prop.id, decision);
      prompted++;
    }
  }

  return prompted;
}

/**
 * Prompt for a single proposal and return the decision.
 * Returns true for accept, false for decline, null for skip.
 */
async function singlePrompt(proposal: MossProposal): Promise<boolean | null> {
  console.error(
    `\n[codex-security-evo] MOSS proposal for ${proposal.failure_class} / ${proposal.language}:`,
  );
  console.error(`  Suggestion: ${proposal.suggestion}`);
  console.error(`  Triggered by ${proposal.trigger_count} failures (threshold: ${PROPOSAL_THRESHOLD}).`);

  // In a full CLI integration this would use inquirer.
  // For now we simulate reading from stdin.
  // The actual integration will be done when wiring to codex-security's CLI.
  console.error(`  [y/n] Accept this config change? `);

  // Placeholder: we return null (skip) for non-interactive mode.
  // In real integration this would wait for stdin.
  return null;
}
