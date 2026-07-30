/**
 * MOSS proposal engine.
 *
 * Checks evidence groups against threshold (5 same-class failures for the
 * same language) and emits a proposal if not already pending for that group.
 */
import { PROPOSAL_THRESHOLD, suggestionForFailureClass, } from "./core.js";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
/** Directory for MOSS proposals. */
export const MOSS_DIR = join(homedir(), ".codex-security", "moss");
/**
 * Generate a proposal id from a failure class + language.
 */
function proposalId(failureClass, language) {
    return `moss-${failureClass}-${language}-${Date.now()}`;
}
/**
 * Load all pending proposals from disk.
 */
export async function loadPendingProposals() {
    await mkdir(MOSS_DIR, { recursive: true });
    let files;
    try {
        files = await readdir(MOSS_DIR);
    }
    catch {
        return [];
    }
    const proposals = [];
    for (const file of files) {
        if (!file.endsWith(".json"))
            continue;
        try {
            const raw = await readFile(join(MOSS_DIR, file), "utf8");
            const p = JSON.parse(raw);
            if (p.accepted === null) {
                proposals.push(p);
            }
        }
        catch {
            // skip corrupt files
        }
    }
    return proposals;
}
/**
 * Check evidence groups against the threshold and emit proposals.
 * Returns any newly created proposals.
 */
export async function evaluateThreshold(groups) {
    await mkdir(MOSS_DIR, { recursive: true });
    // Load existing proposals so we don't duplicate.
    const existing = await loadPendingProposals();
    const existingKeys = new Set(existing.map((p) => `${p.failure_class}:${p.language}`));
    const newProposals = [];
    for (const group of groups) {
        if (group.evidence.length < PROPOSAL_THRESHOLD)
            continue;
        const key = `${group.failure_class}:${group.language}`;
        if (existingKeys.has(key))
            continue;
        const proposal = {
            id: proposalId(group.failure_class, group.language),
            failure_class: group.failure_class,
            language: group.language,
            created_at: new Date().toISOString(),
            trigger_count: group.evidence.length,
            suggestion: suggestionForFailureClass(group.failure_class),
            accepted: null,
            decided_at: null,
        };
        const path = join(MOSS_DIR, `${proposal.id}.json`);
        await writeFile(path, JSON.stringify(proposal, null, 2), "utf8");
        newProposals.push(proposal);
    }
    return newProposals;
}
/**
 * Record a decision (accept or decline) for a proposal.
 */
export async function recordDecision(proposalId, accepted) {
    const path = join(MOSS_DIR, `${proposalId}.json`);
    try {
        const raw = await readFile(path, "utf8");
        const proposal = JSON.parse(raw);
        proposal.accepted = accepted;
        proposal.decided_at = new Date().toISOString();
        await writeFile(path, JSON.stringify(proposal, null, 2), "utf8");
    }
    catch {
        console.error(`[codex-security-evo] MOSS: cannot record decision — proposal ${proposalId} not found.`);
    }
}
