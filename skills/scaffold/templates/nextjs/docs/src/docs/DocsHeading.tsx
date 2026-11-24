import { Heading } from '@/primitives/Heading';
import type { ReactNode } from 'react';

/** MDX headings. Wraps the Heading primitive so docs can diverge without touching it. */
export function DocsHeading({ level, children }: { level: 1 | 2 | 3; children: ReactNode }) {
  return <Heading level={level}>{children}</Heading>;
}
