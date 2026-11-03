// Numbers and short templates in the visitor's language. Shared by server and client code.

import { LOCALE_INFO, Locale } from './config';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** 12500 as "۱۲٬۵۰۰" in Persian and "12,500" in English and Turkish ("12.500"). */
export const formatNumber = (value: number, locale: Locale, options?: Intl.NumberFormatOptions) => value.toLocaleString(LOCALE_INFO[locale].intl, options);

/** Writes the digits of a text in the language's own digits: Persian digits on the Persian site, Latin elsewhere. */
export const localizeDigits = (text: string, locale: Locale) =>
  locale === 'fa'
    ? text.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    : text.replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));

/** Fills {name} placeholders: fill('Hello {name}', { name: 'Ali' }). */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
