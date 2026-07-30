/**
 * Manifest writer.
 *
 * Writes a ConformanceManifest to `~/.codex-security/manifests/` after every
 * scan. One JSON file per scan, named by scan id.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
/** Directory for conformance manifests. */
export const MANIFESTS_DIR = join(homedir(), ".codex-security", "manifests");
/**
 * Write a manifest to disk.
 */
export async function writeManifest(manifest) {
    await mkdir(MANIFESTS_DIR, { recursive: true });
    const path = join(MANIFESTS_DIR, `manifest-${manifest.scan_id}.json`);
    await writeFile(path, JSON.stringify(manifest, null, 2), "utf8");
}
/**
 * Load a manifest for a specific scan.
 */
export async function loadManifest(scanId) {
    const { readFile } = await import("node:fs/promises");
    try {
        const path = join(MANIFESTS_DIR, `manifest-${scanId}.json`);
        const raw = await readFile(path, "utf8");
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
/**
 * Load all manifests (most recent first).
 */
export async function loadAllManifests(limit = 10) {
    const { readdir, readFile } = await import("node:fs/promises");
    try {
        const files = await readdir(MANIFESTS_DIR);
        const manifestFiles = files
            .filter((f) => f.startsWith("manifest-") && f.endsWith(".json"))
            .sort()
            .reverse()
            .slice(0, limit);
        const manifests = [];
        for (const file of manifestFiles) {
            try {
                const raw = await readFile(join(MANIFESTS_DIR, file), "utf8");
                manifests.push(JSON.parse(raw));
            }
            catch {
                // skip corrupt
            }
        }
        return manifests;
    }
    catch {
        return [];
    }
}
