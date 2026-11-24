import * as stylex from '@stylexjs/stylex';
import { colors } from './colors.stylex';
import { spacing } from './spacing.stylex';

/** Shared look for Button and ButtonLink, so a link and a button match. */
export const buttonStyles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  primary: {
    backgroundColor: { default: colors.accent, ':hover': `color-mix(in srgb, ${colors.accent} 85%, black)` },
    borderColor: colors.accent,
    color: colors.accentForeground,
  },
  secondary: {
    backgroundColor: { default: 'transparent', ':hover': colors.border },
    borderColor: colors.border,
    color: colors.foreground,
  },
});
