/* eslint-disable @next/next/no-img-element */
import React from 'react';

// Trimmed copies of the logos in /public, made for the web: the emblem alone, without the
// "ROYAL TRAVEL" wordmark, because the brand name is always set as text right beside it.
const EMBLEM = {
  main: '/brand/emblem-main.webp',
  gold: '/brand/emblem-gold.webp',
  white: '/brand/emblem-white.webp',
} as const;

// The emblem files are 140×192
const WIDTH = 140;
const HEIGHT = 192;

type Props = {
  /**
   * plate: the full-color main logo on a light plate, readable on either theme (header, main spots)
   * adaptive: gold on the dark theme, the main logo on the light one, no plate
   * gold / white / main: one fixed color, for surfaces that never change theme (the admin panel)
   */
  variant?: 'plate' | 'adaptive' | keyof typeof EMBLEM;
  className?: string;
  /** Set for the first logo on the page, so it isn't lazy-loaded */
  priority?: boolean;
};

const Emblem: React.FC<{ color: keyof typeof EMBLEM; className?: string; priority?: boolean }> = ({ color, className = '', priority }) => (
  <img
    src={EMBLEM[color]}
    alt=""
    width={WIDTH}
    height={HEIGHT}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
    draggable={false}
    className={`h-full w-auto select-none ${className}`}
  />
);

export const BrandEmblem: React.FC<Props> = ({ variant = 'plate', className = '', priority }) => {
  if (variant === 'plate') {
    return (
      <span className={`flex items-center justify-center rounded-2xl bg-logo-plate border border-gold-line/60 shadow-lg shadow-black/20 p-1.5 ${className}`}>
        <Emblem color="main" priority={priority} />
      </span>
    );
  }

  if (variant === 'adaptive') {
    return (
      <span className={`flex items-center justify-center ${className}`}>
        <Emblem color="gold" priority={priority} className="logo-on-dark" />
        <Emblem color="main" priority={priority} className="logo-on-light" />
      </span>
    );
  }

  return (
    <span className={`flex items-center justify-center ${className}`}>
      <Emblem color={variant} priority={priority} />
    </span>
  );
};
