import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

describe('function size (max-lines-per-function, complexity)', () => {
  it('rejects a function over 50 lines', async () => {
    const body = Array.from({ length: 51 }, (_, i) => `  const v${i} = ${i};`).join('\n');
    const code = `export function long() {\n${body}\n  return v0;\n}\n`;
    expect(await lintSource(code, 'src/lib/long.ts')).toContain('max-lines-per-function');
  });

  it('rejects a function with complexity over 10', async () => {
    const branches = Array.from({ length: 11 }, (_, i) => `  if (n === ${i}) return ${i};`).join('\n');
    const code = `export function pick(n: number) {\n${branches}\n  return -1;\n}\n`;
    expect(await lintSource(code, 'src/lib/pick.ts')).toContain('complexity');
  });
});
