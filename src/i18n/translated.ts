// Content written in the admin panel is stored once per language in a JSON column:
// { "fa": "...", "en": "...", "tr": "..." }. Persian is always there; the others may be missing.

import { FALLBACKS, LOCALES, Locale, SOURCE_LOCALE } from './config';

export type Translated = Partial<Record<Locale, string>>;

/** Reads a JSON column (or an old plain string) as a Translated. */
export function asTranslated(value: unknown): Translated {
  if (typeof value === 'string') return value ? { [SOURCE_LOCALE]: value } : {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Translated = {};
  for (const locale of LOCALES) {
    const text = (value as Record<string, unknown>)[locale];
    if (typeof text === 'string' && text.trim()) result[locale] = text;
  }
  return result;
}

/** The text in a language, or the closest one there is (see FALLBACKS). */
export function pick(value: unknown, locale: Locale): string {
  const texts = asTranslated(value);
  for (const candidate of FALLBACKS[locale]) if (texts[candidate]) return texts[candidate]!;
  return '';
}

/** Like pick, but null when nothing is written in any language. */
export const pickOrNull = (value: unknown, locale: Locale): string | null => pick(value, locale) || null;

/** Persian, as the admin panel shows it. */
export const fa = (value: unknown) => pick(value, SOURCE_LOCALE);

/** The languages a text is written in. */
export const filledLocales = (value: unknown): Locale[] => {
  const texts = asTranslated(value);
  return LOCALES.filter((locale) => texts[locale]);
};

export const emptyTranslated = (): Record<Locale, string> => ({ fa: '', en: '', tr: '' });

/** Every language as a string, for the panel's inputs. */
export const toInputs = (value: unknown): Record<Locale, string> => ({ ...emptyTranslated(), ...asTranslated(value) });
