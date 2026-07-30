/**
 * MOSS CLI integration — real interactive prompts.
 *
 * Before a scan, check for pending proposals and prompt the engineer
 * with a real y/n question using @inquirer/prompts.
 * Falls back to default (accept) when not interactive.
 */
/**
 * Prompt the engineer about pending MOSS proposals before a scan.
 * Returns the number of proposals that were presented and decided.
 */
export declare function promptPendingProposals(): Promise<number>;
