// The languages the public site is published in. Persian is the source language: every piece of
// content is written in it first, and the admin panel stays in Persian.

export const LOCALES = ['fa', 'en', 'tr'] as const;

export type Locale = (typeof LOCALES)[number];

export const SOURCE_LOCALE: Locale = 'fa';

// For visitors from anywhere other than Iran or Turkey.
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_INFO: Record<Locale, { name: string; short: string; dir: 'rtl' | 'ltr'; intl: string; adminName: string }> = {
  fa: { name: 'فارسی', short: 'FA', dir: 'rtl', intl: 'fa-IR', adminName: 'فارسی' },
  en: { name: 'English', short: 'EN', dir: 'ltr', intl: 'en-US', adminName: 'انگلیسی' },
  tr: { name: 'Türkçe', short: 'TR', dir: 'ltr', intl: 'tr-TR', adminName: 'ترکی' },
};

// When a text has not been translated yet, the site shows the first of these that exists.
export const FALLBACKS: Record<Locale, Locale[]> = {
  fa: ['fa', 'en', 'tr'],
  en: ['en', 'fa', 'tr'],
  tr: ['tr', 'en', 'fa'],
};

// The visitor's own pick from the language switcher; it wins over their country.
export const LOCALE_COOKIE = 'giti_locale';

export const isLocale = (value: unknown): value is Locale => typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

export const localeForCountry = (country: string | null | undefined): Locale => {
  const code = country?.toUpperCase();
  if (code === 'IR') return 'fa';
  if (code === 'TR') return 'tr';
  return DEFAULT_LOCALE;
};

/** "/services/x" in a language: "/en/services/x". */
export const localePath = (locale: Locale, path = '/') => `/${locale}${path === '/' ? '' : path}`;

/** Takes the language off a path: "/en/services/x" gives "/services/x". */
export const stripLocale = (pathname: string) => {
  const [, first, ...rest] = pathname.split('/');
  return isLocale(first) ? `/${rest.join('/')}` : pathname;
};
