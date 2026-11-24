import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'boundaries/dependencies';

describe('one-way imports (app → feature → primitives → lib)', () => {
  it('allows app routes to import a feature', async () => {
    const code = "import { Landing } from '@/landing/Landing';\nexport default function Page() { return <Landing />; }\n";
    expect(await lintSource(code, 'src/app/page.tsx')).not.toContain(RULE);
  });

  it('allows a feature to import primitives', async () => {
    const code = "import { Stack } from '@/primitives/Stack';\nexport function X() { return <Stack>x</Stack>; }\n";
    expect(await lintSource(code, 'src/landing/X.tsx')).not.toContain(RULE);
  });

  it('rejects primitives importing a feature', async () => {
    const code = "import { Landing } from '@/landing/Landing';\nexport function X() { return <Landing />; }\n";
    expect(await lintSource(code, 'src/primitives/X.tsx')).toContain(RULE);
  });

  it('rejects one feature importing another', async () => {
    const code = "import { Hero } from '@/landing/Hero';\nexport function X() { return <Hero />; }\n";
    expect(await lintSource(code, 'src/pricing/X.tsx')).toContain(RULE);
  });

  it('rejects a feature importing from app routes', async () => {
    const code = "import HomePage from '@/app/page';\nexport function X() { return <HomePage />; }\n";
    expect(await lintSource(code, 'src/landing/X.tsx')).toContain(RULE);
  });
});
