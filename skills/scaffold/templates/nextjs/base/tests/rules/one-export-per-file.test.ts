import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'dstack/one-export-per-file';

describe(RULE, () => {
  it('rejects a second runtime export', async () => {
    const code = 'export function A() { return null; }\nexport function B() { return null; }\n';
    expect(await lintSource(code, 'src/landing/Pair.tsx')).toContain(RULE);
  });

  it('allows one export plus exported types', async () => {
    const code = 'export type Size = "sm" | "lg";\nexport function A() { return null; }\n';
    expect(await lintSource(code, 'src/landing/Single.tsx')).not.toContain(RULE);
  });

  it('allows Next.js framework exports in a page', async () => {
    const code = 'export const metadata = { title: "x" };\nexport default function Page() { return null; }\n';
    expect(await lintSource(code, 'src/app/about/page.tsx')).not.toContain(RULE);
  });

  it('rejects a helper exported from a page', async () => {
    const code = 'export function helper() { return 1; }\nexport default function Page() { return null; }\n';
    expect(await lintSource(code, 'src/app/about/page.tsx')).toContain(RULE);
  });
});
