import { ESLint } from 'eslint';

const eslint = new ESLint();

/**
 * Lints `code` with the project's real eslint.config.mjs as if it lived at
 * `filePath`, and returns the rule ids it reported. Rule tests use this so
 * they prove both the rule and its wiring in the config.
 */
export async function lintSource(code: string, filePath: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((message) => message.ruleId ?? `fatal: ${message.message}`);
}
