import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'no-barrel-files/no-barrel-files';

describe(RULE, () => {
  it('rejects export-star re-exports', async () => {
    expect(await lintSource("export * from './Hero';\n", 'src/landing/index.ts')).toContain(RULE);
  });

  it('rejects re-exporting an imported binding', async () => {
    const code = "import { Hero } from './Hero';\nexport { Hero };\n";
    expect(await lintSource(code, 'src/landing/index.ts')).toContain(RULE);
  });
});
