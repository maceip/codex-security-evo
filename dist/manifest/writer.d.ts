/**
 * Manifest writer.
 *
 * Writes a ConformanceManifest to `~/.codex-security/manifests/` after every
 * scan. One JSON file per scan, named by scan id.
 */
import { type ConformanceManifest } from "./core.js";
/** Directory for conformance manifests. */
export declare const MANIFESTS_DIR: string;
/**
 * Write a manifest to disk.
 */
export declare function writeManifest(manifest: ConformanceManifest): Promise<void>;
/**
 * Load a manifest for a specific scan.
 */
export declare function loadManifest(scanId: string): Promise<ConformanceManifest | null>;
/**
 * Load all manifests (most recent first).
 */
export declare function loadAllManifests(limit?: number): Promise<ConformanceManifest[]>;
