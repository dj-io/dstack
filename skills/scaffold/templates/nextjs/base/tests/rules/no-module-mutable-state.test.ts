import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'no-restricted-syntax';

describe('no module-level mutable state', () => {
  it('rejects a top-level let', async () => {
    const code = 'let count = 0;\nexport function bump() { count += 1; return count; }\n';
    expect(await lintSource(code, 'src/lib/bump.ts')).toContain(RULE);
  });

  it('rejects an exported let', async () => {
    expect(await lintSource('export let count = 0;\n', 'src/lib/count.ts')).toContain(RULE);
  });

  it('allows let inside a function', async () => {
    const code = 'export function sum(values: number[]) {\n  let total = 0;\n  for (const v of values) total += v;\n  return total;\n}\n';
    expect(await lintSource(code, 'src/lib/sum.ts')).not.toContain(RULE);
  });
});
