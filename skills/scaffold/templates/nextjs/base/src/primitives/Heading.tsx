import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colors } from './colors.stylex';

const styles = stylex.create({
  base: { margin: 0, color: colors.foreground, letterSpacing: '-0.02em', lineHeight: 1.1 },
  1: { fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700 },
  2: { fontSize: '2rem', fontWeight: 650 },
  3: { fontSize: '1.25rem', fontWeight: 600 },
});

type HeadingProps = { children: ReactNode; level?: 1 | 2 | 3 };

/** Section and page headings, h1 to h3. */
export function Heading({ children, level = 2 }: HeadingProps) {
  const Element = `h${level}` as const;
  return <Element {...stylex.props(styles.base, styles[level])}>{children}</Element>;
}
