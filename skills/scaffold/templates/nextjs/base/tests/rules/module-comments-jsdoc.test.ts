import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'dstack/module-comments-jsdoc';

describe(RULE, () => {
  it('rejects a line comment at module level', async () => {
    const code = '// the hero section\nexport function Hero() { return null; }\n';
    expect(await lintSource(code, 'src/landing/Hero.tsx')).toContain(RULE);
  });

  it('allows a JSDoc block at module level', async () => {
    const code = '/** Above-the-fold pitch. */\nexport function Hero() { return null; }\n';
    expect(await lintSource(code, 'src/landing/Hero.tsx')).not.toContain(RULE);
  });

  it('allows a line comment inside a function body', async () => {
    const code = 'export function f() {\n  // retry once: the upstream API drops the first request after idle\n  return 1;\n}\n';
    expect(await lintSource(code, 'src/lib/f.ts')).not.toContain(RULE);
  });
});
