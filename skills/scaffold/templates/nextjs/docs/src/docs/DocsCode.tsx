import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colors } from '@/primitives/colors.stylex';

const styles = stylex.create({
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '0.9em',
    paddingInline: 4,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
});

/** Inline code in MDX content. */
export function DocsCode({ children }: { children: ReactNode }) {
  return <code {...stylex.props(styles.code)}>{children}</code>;
}
