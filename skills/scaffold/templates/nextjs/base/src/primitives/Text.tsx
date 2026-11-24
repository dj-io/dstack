import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colors } from './colors.stylex';

const styles = stylex.create({
  base: { margin: 0, color: colors.foreground, fontSize: '1rem', lineHeight: 1.6 },
  lead: { fontSize: '1.25rem', color: colors.muted, maxWidth: '40rem' },
  muted: { color: colors.muted },
});

type TextProps = { children: ReactNode; tone?: 'default' | 'lead' | 'muted' };

/** Body copy. */
export function Text({ children, tone = 'default' }: TextProps) {
  return <p {...stylex.props(styles.base, tone === 'lead' && styles.lead, tone === 'muted' && styles.muted)}>{children}</p>;
}
