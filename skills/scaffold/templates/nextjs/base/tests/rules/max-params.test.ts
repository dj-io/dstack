import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'max-params';

describe(RULE, () => {
  it('rejects four positional parameters', async () => {
    const code = 'export function place(x: number, y: number, z: number, r: number) { return x + y + z + r; }\n';
    expect(await lintSource(code, 'src/lib/place.ts')).toContain(RULE);
  });

  it('allows an options object', async () => {
    const code = 'export function place({ x, y, z, r }: { x: number; y: number; z: number; r: number }) { return x + y + z + r; }\n';
    expect(await lintSource(code, 'src/lib/place.ts')).not.toContain(RULE);
  });
});
