import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'dstack/export-first';

describe(RULE, () => {
  it('rejects a helper function above the export', async () => {
    const code = 'function step() { return 1; }\nexport function run() { return step(); }\n';
    expect(await lintSource(code, 'src/lib/run.ts')).toContain(RULE);
  });

  it('rejects an arrow helper above the export', async () => {
    const code = 'const step = () => 1;\nexport function run() { return step(); }\n';
    expect(await lintSource(code, 'src/lib/run.ts')).toContain(RULE);
  });

  it('allows constants above the export and helpers below it', async () => {
    const code = 'const LIMIT = 3;\nexport function run() { return step(); }\nfunction step() { return LIMIT; }\n';
    expect(await lintSource(code, 'src/lib/run.ts')).not.toContain(RULE);
  });

  it('skips entry scripts with no export', async () => {
    const code = 'function main() { return 1; }\nmain();\n';
    expect(await lintSource(code, 'scripts/bake.ts')).not.toContain(RULE);
  });
});
