/**
 * The questions of a service's request form and the answers a visitor gives, shared by the panel's
 * form builder, the service page and the server. checkAnswer() is the one rule both the browser and
 * the server apply, so a visitor never sees an error the server would not also give.
 */

import type { Locale } from '../../i18n/config';
import { fill, formatNumber } from '../../i18n/format';
import { pick, Translated } from '../../i18n/translated';
import { normalizeDigits } from '../../utils/validation';

export type FormFieldType = 'text' | 'number' | 'select' | 'checkbox';

export const FORM_FIELD_TYPES: { key: FormFieldType; label: string; hint: string }[] = [
  { key: 'text', label: 'نوشته', hint: 'متن آزاد؛ یک‌خطی یا چندخطی.' },
  { key: 'number', label: 'عددی', hint: 'فقط عدد، مثل وزن بار یا تعداد مسافر.' },
  { key: 'select', label: 'چند گزینه‌ای', hint: 'انتخاب از میان گزینه‌هایی که تعریف می‌کنید؛ تکی یا چندتایی.' },
  { key: 'checkbox', label: 'چک‌باکس', hint: 'یک تیک بله/خیر، مثل «قوانین را می‌پذیرم».' },
];

export const FORM_FIELD_TYPE_KEYS = FORM_FIELD_TYPES.map((type) => type.key) as [FormFieldType, ...FormFieldType[]];

export const formFieldType = (key: string) => FORM_FIELD_TYPES.find((type) => type.key === key) ?? FORM_FIELD_TYPES[0];

export const TEXT_MAX = 255;
export const MULTILINE_MAX = 2000;

export type FormFieldOption = { value: string; label: Translated };

/** A question as the service page shows it, in the visitor's language. */
export type PublicFormField = {
  id: number;
  type: FormFieldType;
  label: string;
  help: string | null;
  required: boolean;
  multiple: boolean;
  multiline: boolean;
  options: { value: string; label: string }[];
};

/** What the visitor's browser sends for a question: text and numbers as typed, a list for a multiple choice. */
export type RawAnswer = string | string[] | boolean | null | undefined;

/** One answered question as a request stores it: the question as it was, and the answer. */
export type RequestAnswer = {
  fieldId: number | null;
  type: FormFieldType;
  label: Translated;
  value: string | number | boolean | string[] | null;
  // select: the chosen options with their titles, so the answer reads the same after the options change.
  options?: FormFieldOption[];
};

/** Reads a JSON options column; anything malformed is dropped. */
export function asOptions(value: unknown): FormFieldOption[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((option): option is { value: unknown; label: unknown } => Boolean(option) && typeof option === 'object')
    .filter((option) => typeof option.value === 'string' && option.value !== '')
    .map((option) => ({ value: option.value as string, label: (option.label && typeof option.label === 'object' ? option.label : {}) as Translated }));
}

/** Reads a request's answers column. */
export function asAnswers(value: unknown): RequestAnswer[] {
  if (!Array.isArray(value)) return [];
  return value.filter((answer): answer is RequestAnswer => Boolean(answer) && typeof answer === 'object' && 'label' in answer && 'type' in answer);
}

const FIELD_MESSAGES: Record<Locale, Record<'required' | 'choose' | 'chooseSome' | 'number' | 'tooLong' | 'mustCheck' | 'badOption', string>> = {
  fa: {
    required: 'این مورد را تکمیل کنید.',
    choose: 'یکی از گزینه‌ها را انتخاب کنید.',
    chooseSome: 'دست‌کم یکی از گزینه‌ها را انتخاب کنید.',
    number: 'یک عدد معتبر وارد کنید؛ مثل ۱۲ یا ۲٫۵',
    tooLong: 'حداکثر {max} کاراکتر مجاز است.',
    mustCheck: 'برای ثبت درخواست، این گزینه را تأیید کنید.',
    badOption: 'گزینه انتخاب‌شده معتبر نیست؛ صفحه را دوباره باز کنید.',
  },
  en: {
    required: 'Please fill this in.',
    choose: 'Please choose one of the options.',
    chooseSome: 'Please choose at least one option.',
    number: 'Please enter a valid number, such as 12 or 2.5.',
    tooLong: 'At most {max} characters are allowed.',
    mustCheck: 'Please confirm this to send your request.',
    badOption: 'The chosen option is not valid; please reload the page.',
  },
  tr: {
    required: 'Lütfen bu alanı doldurun.',
    choose: 'Lütfen seçeneklerden birini seçin.',
    chooseSome: 'Lütfen en az bir seçenek seçin.',
    number: 'Lütfen geçerli bir sayı girin; örneğin 12 veya 2,5.',
    tooLong: 'En fazla {max} karakter girilebilir.',
    mustCheck: 'Talebinizi göndermek için lütfen bunu onaylayın.',
    badOption: 'Seçilen seçenek geçerli değil; lütfen sayfayı yenileyin.',
  },
};

/**
 * A number as the visitor typed it, in any digits: "۱۲٬۵۰۰٫۵" or "12,500.5", and on the Turkish site
 * "12.500,5". Null when it is not a number.
 */
export function parseNumber(text: string, locale: Locale = 'fa'): number | null {
  let value = normalizeDigits(text).replace(/[\s٬']/g, '').replace(/٫/g, '.');
  // Turkish writes the decimal point as a comma and groups thousands with dots
  value = locale === 'tr' ? value.replace(/\./g, '').replace(',', '.') : value.replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/**
 * Checks one answer against its question. Returns the cleaned value to store, or the error to show,
 * in the visitor's language.
 */
export function checkAnswer(field: PublicFormField, raw: RawAnswer, locale: Locale): { value: RequestAnswer['value']; error?: string } {
  const t = FIELD_MESSAGES[locale];

  if (field.type === 'checkbox') {
    const checked = raw === true;
    return field.required && !checked ? { value: checked, error: t.mustCheck } : { value: checked };
  }

  if (field.type === 'select') {
    const chosen = (Array.isArray(raw) ? raw : typeof raw === 'string' && raw ? [raw] : []).filter((value) => typeof value === 'string');
    const unique = [...new Set(chosen)];
    if (unique.some((value) => !field.options.some((option) => option.value === value))) return { value: null, error: t.badOption };
    if (!field.multiple && unique.length > 1) return { value: null, error: t.badOption };
    if (field.required && unique.length === 0) return { value: null, error: field.multiple ? t.chooseSome : t.choose };
    if (field.multiple) return { value: unique };
    return { value: unique[0] ?? null };
  }

  const text = typeof raw === 'string' ? raw.trim() : '';
  if (!text) return field.required ? { value: null, error: t.required } : { value: null };

  if (field.type === 'number') {
    const number = parseNumber(text, locale);
    return number === null ? { value: null, error: t.number } : { value: number };
  }

  const max = field.multiline ? MULTILINE_MAX : TEXT_MAX;
  if (text.length > max) return { value: null, error: fill(t.tooLong, { max: formatNumber(max, locale) }) };
  return { value: text };
}

/** An answer as one line of text, in a language (the panel reads Persian). */
export function answerText(answer: RequestAnswer, locale: Locale = 'fa'): string {
  const { value } = answer;
  const yes = { fa: 'بله', en: 'Yes', tr: 'Evet' }[locale];
  const no = { fa: 'خیر', en: 'No', tr: 'Hayır' }[locale];

  if (answer.type === 'checkbox') return value === true ? yes : no;
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) return '—';
  if (answer.type === 'number' && typeof value === 'number') return formatNumber(value, locale, { maximumFractionDigits: 10 });
  if (answer.type === 'select') {
    const values = Array.isArray(value) ? value : [String(value)];
    const titles = values.map((chosen) => {
      const option = answer.options?.find((item) => item.value === chosen);
      return (option && pick(option.label, locale)) || chosen;
    });
    return titles.join(locale === 'fa' ? '، ' : ', ');
  }
  return String(value);
}
