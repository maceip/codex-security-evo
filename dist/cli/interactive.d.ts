/**
 * Interactive helpers for the CLI.
 *
 * Checks whether stdin is a TTY. If not, skip interactive prompts and use
 * defaults (or skip). This allows the CLI to work in CI/batch mode.
 */
/** True if stdin is a TTY (interactive terminal). */
export declare function isInteractive(): boolean;
/**
 * Prompt with confirm if interactive; otherwise return the default.
 */
export declare function confirmOrSkip(message: string, defaultVal: boolean): Promise<boolean>;
