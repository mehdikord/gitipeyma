'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { FOCUS } from './styles';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[#0B7A75] text-white hover:bg-[#096762] border border-transparent',
  secondary: 'bg-white text-[#14282D] border border-[#D5DDE0] hover:bg-[#F4F6F7]',
  danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] border border-transparent',
  ghost: 'text-[#3F5257] hover:bg-[#EEF2F3] border border-transparent',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md') =>
  `inline-flex items-center justify-center shrink-0 rounded-lg font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${FOCUS}`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ElementType;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', loading, icon: Icon, children, className = '', disabled, type = 'button', ...props }) => (
  <button type={type} disabled={disabled || loading} className={`${buttonClass(variant, size)} ${className}`} {...props}>
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
    {children}
  </button>
);

export const ButtonLink: React.FC<{ href: string; variant?: Variant; size?: Size; icon?: React.ElementType; children: React.ReactNode; className?: string }> = ({
  href,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
}) => (
  <Link href={href} className={`${buttonClass(variant, size)} ${className}`}>
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </Link>
);

/** A square icon-only button for table rows. The label is read out and shown on hover. */
export const IconButton: React.FC<{ label: string; icon: React.ElementType; onClick: () => void; tone?: 'default' | 'danger'; disabled?: boolean }> = ({
  label,
  icon: Icon,
  onClick,
  tone = 'default',
  disabled,
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      tone === 'danger' ? 'text-[#B91C1C] hover:bg-[#FEE2E2]' : 'text-[#3F5257] hover:bg-[#EEF2F3]'
    } ${FOCUS}`}
  >
    <Icon className="w-4 h-4" />
  </button>
);
