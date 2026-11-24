import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { spacing } from '@/primitives/spacing.stylex';
import { DocsArticle } from './DocsArticle';
import { DocsSidebar } from './DocsSidebar';

const styles = stylex.create({
  shell: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 768px)': '220px 1fr' },
    gap: spacing.lg,
    paddingBlock: spacing.lg,
    paddingInline: spacing.md,
    maxWidth: 1100,
    marginInline: 'auto',
  },
});

/** Entry component for the docs feature: sidebar plus the current MDX page. */
export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div {...stylex.props(styles.shell)}>
      <DocsSidebar />
      <DocsArticle>{children}</DocsArticle>
    </div>
  );
}
