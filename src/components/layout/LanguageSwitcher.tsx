'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown } from 'lucide-react';
import { LOCALES, LOCALE_COOKIE, LOCALE_INFO, Locale, localePath, stripLocale } from '../../i18n/config';
import { useI18n } from '../../i18n/I18nProvider';
import { LocaleFlag } from './LocaleFlag';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

// The visitor's pick is remembered for a year and wins over the country they visit from.
const remember = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
};

/**
 * Moves to the same page in another language. A full page load, since each language is its own
 * document (lang, dir and the dictionary all change).
 */
export const LanguageSwitcher: React.FC<{ variant?: 'menu' | 'list' }> = ({ variant = 'menu' }) => {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const hrefFor = (target: Locale) => localePath(target, stripLocale(pathname));

  const links = LOCALES.map((target) => (
    <a
      key={target}
      href={hrefFor(target)}
      hrefLang={target}
      lang={target}
      role={variant === 'menu' ? 'menuitem' : undefined}
      aria-current={target === locale ? 'true' : undefined}
      onClick={(event) => {
        // Keeps the query too (/consultation?service=...)
        event.preventDefault();
        remember(target);
        window.location.assign(`${hrefFor(target)}${window.location.search}`);
      }}
      className={`flex items-center gap-3 rounded-lg py-2 text-sm transition-colors ${variant === 'menu' ? 'justify-between px-3' : 'px-2.5'} ${FOCUS} ${
        target === locale ? 'bg-[#12B8B0]/15 text-[#12B8B0] font-bold' : 'text-[#F7F7F3]/85 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="flex items-center gap-2.5">
        <LocaleFlag locale={target} />
        {LOCALE_INFO[target].name}
      </span>
      {/* In the list the flag and the highlight already say it */}
      {variant === 'list' ? null : target === locale ? <Check className="h-4 w-4" /> : <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold text-[#718085]">{LOCALE_INFO[target].short}</span>}
    </a>
  ));

  if (variant === 'list') {
    return (
      <nav aria-label={t.common.language.choose} className="flex flex-wrap gap-1.5">
        {links}
      </nav>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.common.language.choose}
        className={`flex items-center gap-1.5 rounded-full border border-[#12B8B0]/25 bg-[#0C252B]/60 px-3 py-2 text-xs font-bold text-[#F7F7F3]/90 transition-colors hover:border-[#12B8B0]/60 hover:text-white ${FOCUS}`}
      >
        <LocaleFlag locale={locale} />
        <span className="font-['Plus_Jakarta_Sans',sans-serif] tracking-wide">{LOCALE_INFO[locale].short}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-full z-50 mt-2 w-44 space-y-0.5 rounded-xl border border-[#12B8B0]/20 bg-[#07191F]/95 p-1.5 shadow-2xl backdrop-blur-xl">
          {links}
        </div>
      )}
    </div>
  );
};
