import { LOCALE_INFO, Locale, localePath } from './config';
import { fill, formatNumber, localizeDigits } from './format';
import { pick } from './translated';
import type { Dictionary } from './dictionaries';

// What useI18n() (client) and getI18n() (server) hand to components.
export const makeI18n = (locale: Locale, t: Dictionary) => ({
  locale,
  dir: LOCALE_INFO[locale].dir,
  intl: LOCALE_INFO[locale].intl,
  // The interface text: t.layout.nav.home
  t,
  // A site path in this language: path('/services') gives "/en/services"
  path: (to: string) => localePath(locale, to),
  num: (value: number, options?: Intl.NumberFormatOptions) => formatNumber(value, locale, options),
  digits: (text: string) => localizeDigits(text, locale),
  fill,
  // A translated database value in this language
  pick: (value: unknown) => pick(value, locale),
});

export type I18n = ReturnType<typeof makeI18n>;
