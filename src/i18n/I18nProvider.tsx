'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries';
import { I18n, makeI18n } from './make';

const I18nContext = createContext<I18n | null>(null);

// The dictionary of one language arrives from the [lang] layout, so the browser only receives that one.
export const I18nProvider: React.FC<{ locale: Locale; dictionary: Dictionary; children: React.ReactNode }> = ({ locale, dictionary, children }) => {
  const value = useMemo(() => makeI18n(locale, dictionary), [locale, dictionary]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18n {
  const i18n = useContext(I18nContext);
  if (!i18n) throw new Error('useI18n must be used inside <I18nProvider>.');
  return i18n;
}
