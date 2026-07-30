/**
 * MOSS CLI integration — real interactive prompts.
 *
 * Before a scan, check for pending proposals and prompt the engineer
 * with a real y/n question using @inquirer/prompts.
 * Falls back to default (accept) when not interactive.
 */

import { PROPOSAL_THRESHOLD } from "./core.js";
import { loadPendingProposals, recordDecision } from "./proposal.js";
import { confirmOrSkip } from "../cli/interactive.js";

/**
 * Prompt the engineer about pending MOSS proposals before a scan.
 * Returns the number of proposals that were presented and decided.
 */
export async function promptPendingProposals(): Promise<number> {
  const proposals = await loadPendingProposals();
  if (proposals.length === 0) return 0;

  let decided = 0;
  for (const prop of proposals) {
    const accepted = await confirmOrSkip(
      `MOSS: ${prop.failure_class} / ${prop.language}: ${prop.suggestion} ` +
        `(${prop.trigger_count} failures, threshold ${PROPOSAL_THRESHOLD})`,
      true,
    );

    await recordDecision(prop.id, accepted);
    decided++;
  }

  return decided;
}
