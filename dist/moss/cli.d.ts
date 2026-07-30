/**
 * MOSS CLI integration.
 *
 * Before a scan, check for pending proposals and prompt the engineer
 * with a y/n question for each.
 */
/**
 * Prompt the engineer about pending MOSS proposals before a scan.
 * Returns the number of proposals that were presented.
 *
 * In a real integration this would use inquirer or similar interactive prompt.
 * For now we write to stderr and read a response from stdin.
 */
export declare function promptPendingProposals(): Promise<number>;
