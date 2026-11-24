import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'dstack/max-module-helpers';

const withHelpers = (count: number) =>
  [
    `export function run() { return ${Array.from({ length: count }, (_, i) => `h${i}()`).join(' + ') || '0'}; }`,
    ...Array.from({ length: count }, (_, i) => `function h${i}() { return ${i}; }`),
  ].join('\n');

describe(RULE, () => {
  it('rejects a fourth private helper', async () => {
    expect(await lintSource(withHelpers(4), 'src/lib/run.ts')).toContain(RULE);
  });

  it('allows three private helpers', async () => {
    expect(await lintSource(withHelpers(3), 'src/lib/run.ts')).not.toContain(RULE);
  });
});
