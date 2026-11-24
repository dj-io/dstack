import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { spacing } from './spacing.stylex';

const styles = stylex.create({
  stack: { display: 'flex', flexDirection: 'column' },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  center: { alignItems: 'center', textAlign: 'center' },
  sm: { gap: spacing.sm },
  md: { gap: spacing.md },
  lg: { gap: spacing.lg },
});

type StackProps = {
  children: ReactNode;
  direction?: 'column' | 'row';
  gap?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
};

/** Flex layout primitive. Features compose layout from this instead of raw divs. */
export function Stack({ children, direction = 'column', gap = 'md', centered = false, as: Element = 'div' }: StackProps) {
  return (
    <Element {...stylex.props(styles.stack, direction === 'row' && styles.row, centered && styles.center, styles[gap])}>
      {children}
    </Element>
  );
}
