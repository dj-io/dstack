'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { colors } from '@/primitives/colors.stylex';

const styles = stylex.create({
  link: { color: { default: colors.muted, ':hover': colors.foreground }, textDecoration: 'none', fontSize: '0.95rem' },
  active: { color: colors.foreground, fontWeight: 600 },
});

/** Sidebar link that highlights the page you're on. */
export function DocsNavLink({ href, children }: { href: string; children: ReactNode }) {
  const isActive = usePathname() === href;
  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} {...stylex.props(styles.link, isActive && styles.active)}>
      {children}
    </Link>
  );
}
