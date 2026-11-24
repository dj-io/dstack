import * as stylex from '@stylexjs/stylex';

const DARK = '@media (prefers-color-scheme: dark)';

/** Color tokens. Every surface and text color in the app reads from here. */
export const colors = stylex.defineVars({
  background: { default: '#ffffff', [DARK]: '#0b0b0c' },
  foreground: { default: '#111113', [DARK]: '#ededef' },
  muted: { default: '#5b5b66', [DARK]: '#a0a0ab' },
  accent: { default: '#2f5bea', [DARK]: '#6b8cff' },
  accentForeground: { default: '#ffffff', [DARK]: '#0b0b0c' },
  border: { default: '#e4e4e9', [DARK]: '#26262b' },
});
