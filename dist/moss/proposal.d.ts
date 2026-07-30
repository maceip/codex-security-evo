/**
 * MOSS proposal engine.
 *
 * Checks evidence groups against threshold (5 same-class failures for the
 * same language) and emits a proposal if not already pending for that group.
 */
import { type MossProposal, type EvidenceGroup } from "./core.js";
/** Directory for MOSS proposals. */
export declare const MOSS_DIR: string;
/**
 * Load all pending proposals from disk.
 */
export declare function loadPendingProposals(): Promise<MossProposal[]>;
/**
 * Check evidence groups against the threshold and emit proposals.
 * Returns any newly created proposals.
 */
export declare function evaluateThreshold(groups: EvidenceGroup[]): Promise<MossProposal[]>;
/**
 * Record a decision (accept or decline) for a proposal.
 */
export declare function recordDecision(proposalId: string, accepted: boolean): Promise<void>;
