/**
 * Interactive helpers for the CLI.
 *
 * Checks whether stdin is a TTY. If not, skip interactive prompts and use
 * defaults (or skip). This allows the CLI to work in CI/batch mode.
 */

import { confirm } from "@inquirer/prompts";

/** True if stdin is a TTY (interactive terminal). */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY);
}

/**
 * Prompt with confirm if interactive; otherwise return the default.
 */
export async function confirmOrSkip(
  message: string,
  defaultVal: boolean,
): Promise<boolean> {
  if (!isInteractive()) {
    console.error(`[evo] (non-interactive) ${message} -> ${defaultVal ? "yes" : "no"}`);
    return defaultVal;
  }
  return await confirm({ message, default: defaultVal });
}
