import { describe, expect, it } from 'vitest';
import { lintSource } from './lintSource';

const RULE = 'dstack/max-raw-elements';

describe(RULE, () => {
  it('rejects more than three raw elements in a file', async () => {
    const code =
      'export function Card() {\n  return <div><span>a</span><span>b</span><span>c</span></div>;\n}\n';
    expect(await lintSource(code, 'src/landing/Card.tsx')).toContain(RULE);
  });

  it('allows a few raw elements wrapped around named components', async () => {
    const code = 'export function Card() {\n  return <section><p>a</p></section>;\n}\n';
    expect(await lintSource(code, 'src/landing/Card.tsx')).not.toContain(RULE);
  });
});
