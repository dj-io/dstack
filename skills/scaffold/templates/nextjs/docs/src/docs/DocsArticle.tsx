import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { Stack } from '@/primitives/Stack';

const styles = stylex.create({
  article: { maxWidth: '46rem', minWidth: 0 },
});

/** Reading column for one MDX page. */
export function DocsArticle({ children }: { children: ReactNode }) {
  return (
    <article {...stylex.props(styles.article)}>
      <Stack gap="md">{children}</Stack>
    </article>
  );
}
