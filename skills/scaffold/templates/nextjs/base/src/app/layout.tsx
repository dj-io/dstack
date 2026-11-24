import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { colors } from '@/primitives/colors.stylex';
import './stylex.css';

export const metadata: Metadata = {
  title: '__APP_NAME__',
  description: '__APP_NAME__',
};

const styles = stylex.create({
  html: { colorScheme: 'light dark' },
  body: {
    margin: 0,
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" {...stylex.props(styles.html)}>
      <body {...stylex.props(styles.body)}>{children}</body>
    </html>
  );
}
