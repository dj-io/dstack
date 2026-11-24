import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { colors } from '@/primitives/colors.stylex';

const styles = stylex.create({
  link: { color: colors.accent, textUnderlineOffset: '3px' },
});

/** Links inside MDX content. Internal hrefs go through next/link. */
export function DocsLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} {...stylex.props(styles.link)}>
      {children}
    </Link>
  );
}
