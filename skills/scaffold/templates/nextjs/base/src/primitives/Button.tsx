'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { buttonStyles } from './buttonStyles';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
};

/** Base UI button with the app's styles. For navigation use ButtonLink. */
export function Button({ children, variant = 'primary', type = 'button', disabled, onClick }: ButtonProps) {
  return (
    <BaseButton {...stylex.props(buttonStyles.base, buttonStyles[variant])} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </BaseButton>
  );
}
