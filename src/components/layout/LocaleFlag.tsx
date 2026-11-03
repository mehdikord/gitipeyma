import React, { useId } from 'react';
import type { Locale } from '../../i18n/config';

// Small flags for the language switcher, drawn inline: emoji flags show as plain letters on Windows,
// and nothing is loaded from another host. Iran for Persian, Turkey for Turkish, the UK for English.
// At this size Iran's emblem is a simplified mark and the takbir bands are left out.

const IranFlag: React.FC = () => (
  <svg viewBox="0 0 630 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="630" height="120" fill="#239F40" />
    <rect y="120" width="630" height="120" fill="#FFFFFF" />
    <rect y="240" width="630" height="120" fill="#DA0000" />
    <g fill="none" stroke="#DA0000" strokeWidth="9" strokeLinecap="round">
      <path d="M315 138v84" />
      <path d="M296 146c-20 14-20 50 0 66" />
      <path d="M334 146c20 14 20 50 0 66" />
      <path d="M282 150c-30 22-26 58 4 72" />
      <path d="M348 150c30 22 26 58-4 72" />
    </g>
  </svg>
);

const TurkeyFlag: React.FC = () => (
  <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="1200" height="800" fill="#E30A17" />
    <circle cx="425" cy="400" r="200" fill="#FFFFFF" />
    <circle cx="475" cy="400" r="160" fill="#E30A17" />
    <path fill="#FFFFFF" d="m583.334 400 180.901 58.779-111.804-153.885v190.212l111.804-153.885z" />
  </svg>
);

const UkFlag: React.FC = () => {
  // Several switchers can be on one page, so the clip paths need their own ids
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <clipPath id={`${id}s`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}s)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}t)`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
};

const FLAGS: Record<Locale, React.FC> = { fa: IranFlag, en: UkFlag, tr: TurkeyFlag };

export const LocaleFlag: React.FC<{ locale: Locale; className?: string }> = ({ locale, className = '' }) => {
  const Flag = FLAGS[locale];
  return (
    <span className={`inline-flex h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/20 [&>svg]:h-full [&>svg]:w-full ${className}`}>
      <Flag />
    </span>
  );
};
