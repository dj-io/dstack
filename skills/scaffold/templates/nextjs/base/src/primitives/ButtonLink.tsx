import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonStyles } from './buttonStyles';

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'secondary';
};

/** A link styled like Button. Keeps link semantics for navigation. */
export function ButtonLink({ children, href, variant = 'primary' }: ButtonLinkProps) {
  return (
    <Link href={href} {...stylex.props(buttonStyles.base, buttonStyles[variant])}>
      {children}
    </Link>
  );
}
