'use client';

import React, { createContext, useContext, useId, useState } from 'react';
import { Check, Languages } from 'lucide-react';
import { LOCALES, LOCALE_INFO, Locale, SOURCE_LOCALE } from '../../../i18n/config';
import { FOCUS, INPUT, inputBorder } from './styles';

/**
 * Editing content in several languages. A form holds every translatable field as { fa, en, tr };
 * one switcher at the top of the form (LanguageTabs) picks the language all of them show, so an
 * admin writes the whole item in Persian, then switches once and translates it field by field
 * with the Persian text shown under each input.
 */

export type TranslatedInput = Record<Locale, string>;

const EditingLocale = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: SOURCE_LOCALE, setLocale: () => {} });

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(SOURCE_LOCALE);
  return <EditingLocale.Provider value={{ locale, setLocale }}>{children}</EditingLocale.Provider>;
};

export const useEditingLocale = () => useContext(EditingLocale);

const isTranslated = (value: unknown): value is TranslatedInput =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) && LOCALES.every((locale) => typeof (value as Record<string, unknown>)[locale] === 'string');

// Every translatable field in a form's values, including those inside lists (steps, FAQs, ...).
function collect(value: unknown, found: TranslatedInput[] = []): TranslatedInput[] {
  if (isTranslated(value)) found.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collect(item, found));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collect(item, found));
  return found;
}

export const hasTranslations = (values: unknown) => collect(values).length > 0;

/**
 * How much of an item is written in each language: of the fields that have text in any language,
 * how many have it in this one.
 */
export function translationProgress(values: unknown): Record<Locale, { done: number; total: number }> {
  const written = collect(values).filter((field) => LOCALES.some((locale) => field[locale].trim()));
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, { done: written.filter((field) => field[locale].trim()).length, total: written.length }]),
  ) as Record<Locale, { done: number; total: number }>;
}

const faNum = (value: number) => value.toLocaleString('fa-IR');

/** The language switcher of a form, with how far each language is and whether it has errors. */
export const LanguageTabs: React.FC<{ values: unknown; errors?: Record<string, string> }> = ({ values, errors = {} }) => {
  const { locale: current, setLocale } = useEditingLocale();
  const progress = translationProgress(values);
  const errorKeys = Object.keys(errors);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#E3E8EA] bg-[#F7FAFA] px-5 py-2.5 sm:px-6">
      <span className="flex items-center gap-1.5 text-xs font-bold text-[#5F7177]">
        <Languages className="h-4 w-4" />
        زبان محتوا:
      </span>
      <div role="tablist" aria-label="زبان محتوا" className="flex flex-wrap gap-1.5">
        {LOCALES.map((locale) => {
          const { done, total } = progress[locale];
          const complete = total > 0 && done === total;
          const hasError = errorKeys.some((key) => key.endsWith(`.${locale}`));
          const active = locale === current;
          return (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setLocale(locale)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-bold transition-colors ${FOCUS} ${
                active ? 'border-[#0B7A75] bg-white text-[#0B5F5B] shadow-sm' : 'border-transparent text-[#3F5257] hover:bg-white'
              }`}
            >
              <span>{LOCALE_INFO[locale].adminName}</span>
              <span dir="ltr" className="text-[11px] font-black text-[#94A3A8]">
                {LOCALE_INFO[locale].short}
              </span>
              {hasError ? (
                <span aria-label="دارای خطا" className="h-2 w-2 rounded-full bg-[#DC2626]" />
              ) : complete ? (
                <Check aria-label="کامل" className="h-3.5 w-3.5 text-[#16A34A]" />
              ) : (
                total > 0 && (
                  <span className={`rounded-full px-1.5 text-[11px] ${done === 0 ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                    {faNum(done)}/{faNum(total)}
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>
      {current !== SOURCE_LOCALE && (
        <span className="text-xs text-[#5F7177]">متن فارسی هر فیلد زیر آن نمایش داده می‌شود. فیلد خالی در سایت با متن زبان دیگر پر می‌شود.</span>
      )}
    </div>
  );
};

/** Small FA / EN / TR chips: which languages a row in a list is fully written in. */
export const TranslationStatus: React.FC<{ values: unknown }> = ({ values }) => {
  const progress = translationProgress(values);
  return (
    <span className="inline-flex gap-1" dir="ltr">
      {LOCALES.map((locale) => {
        const { done, total } = progress[locale];
        const tone = total === 0 || done === 0 ? 'bg-[#F4F6F7] text-[#B8C5C9]' : done === total ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF3C7] text-[#92400E]';
        const state = total === 0 || done === 0 ? 'ترجمه نشده' : done === total ? 'کامل' : `${faNum(done)} از ${faNum(total)} فیلد`;
        return (
          <span key={locale} title={`${LOCALE_INFO[locale].adminName}: ${state}`} className={`rounded px-1.5 py-0.5 text-[10px] font-black ${tone}`}>
            {LOCALE_INFO[locale].short}
          </span>
        );
      })}
    </span>
  );
};

type TransProps = {
  label: string;
  value: TranslatedInput;
  onChange: (value: TranslatedInput) => void;
  // The field's own error ("title") or one for a language ("title.en"), from the form's errors
  errors?: Record<string, string>;
  name: string;
  hint?: React.ReactNode;
  required?: boolean;
  className?: string;
  placeholder?: string;
};

function useTransField({ value, onChange, errors = {}, name }: TransProps) {
  const { locale } = useEditingLocale();
  const id = useId();
  const error = errors[`${name}.${locale}`] ?? errors[name];
  const source = locale !== SOURCE_LOCALE ? value[SOURCE_LOCALE].trim() : '';
  return {
    id,
    locale,
    error,
    source,
    text: value[locale],
    dir: LOCALE_INFO[locale].dir,
    update: (text: string) => onChange({ ...value, [locale]: text }),
  };
}

const TransFrame: React.FC<{ props: TransProps; field: ReturnType<typeof useTransField>; children: React.ReactNode }> = ({ props, field, children }) => (
  <div className={props.className}>
    <label htmlFor={field.id} className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-[#14282D]">
      {props.label}
      {props.required && <span className="text-[#DC2626]">*</span>}
      <span dir="ltr" className="rounded bg-[#E6F4F3] px-1.5 py-px text-[10px] font-black text-[#0B5F5B]" title={`در حال ویرایش: ${LOCALE_INFO[field.locale].adminName}`}>
        {LOCALE_INFO[field.locale].short}
      </span>
    </label>
    {children}
    {field.source && (
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#5F7177]" title={field.source}>
        <span className="font-bold">فارسی: </span>
        {field.source}
      </p>
    )}
    {field.error ? (
      <p id={`${field.id}-error`} className="mt-1.5 text-xs leading-relaxed text-[#DC2626]">
        {field.error}
      </p>
    ) : (
      props.hint && <p className="mt-1.5 text-xs leading-relaxed text-[#5F7177]">{props.hint}</p>
    )}
  </div>
);

/** A one-line input in the language picked by the form's LanguageTabs. */
export const TransTextInput: React.FC<TransProps> = (props) => {
  const field = useTransField(props);
  return (
    <TransFrame props={props} field={field}>
      <input
        id={field.id}
        type="text"
        dir={field.dir}
        lang={field.locale}
        value={field.text}
        placeholder={props.placeholder}
        aria-invalid={Boolean(field.error)}
        aria-describedby={field.error ? `${field.id}-error` : undefined}
        onChange={(event) => field.update(event.target.value)}
        className={`${INPUT} ${inputBorder(field.error)} h-10`}
      />
    </TransFrame>
  );
};

/** A multi-line input in the language picked by the form's LanguageTabs. */
export const TransTextArea: React.FC<TransProps & { rows?: number }> = (props) => {
  const field = useTransField(props);
  return (
    <TransFrame props={props} field={field}>
      <textarea
        id={field.id}
        rows={props.rows ?? 4}
        dir={field.dir}
        lang={field.locale}
        value={field.text}
        placeholder={props.placeholder}
        aria-invalid={Boolean(field.error)}
        aria-describedby={field.error ? `${field.id}-error` : undefined}
        onChange={(event) => field.update(event.target.value)}
        className={`${INPUT} ${inputBorder(field.error)} resize-y py-2.5 leading-7`}
      />
    </TransFrame>
  );
};
