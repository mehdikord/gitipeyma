'use client';

import React from 'react';
import { AlertCircle, Check, ChevronDown, Info } from 'lucide-react';
import { MULTILINE_MAX, PublicFormField, RawAnswer, TEXT_MAX } from '../../modules/serviceForms/fields';
import { useI18n } from '../../i18n/I18nProvider';

// One question of a service's own request form, drawn like the name and phone fields above it.

const CONTROL = 'w-full rounded-lg bg-surface border text-base text-ink-strong placeholder:text-ink-dim outline-none transition-colors focus:border-gold-line focus:ring-1 focus:ring-gold-line';
const border = (error?: string) => (error ? 'border-danger' : 'border-ink/15 hover:border-ink/30');

/** The input's id, so the form can move focus to the first question that needs attention. */
export const fieldInputId = (field: PublicFormField) => `service-field-${field.id}`;

/** What an untouched question holds. */
export const emptyAnswer = (field: PublicFormField): RawAnswer => (field.type === 'checkbox' ? false : field.type === 'select' && field.multiple ? [] : '');

/** Whether the visitor has answered a question at all (a checkbox counts once ticked). */
export const isAnswered = (value: RawAnswer) => (Array.isArray(value) ? value.length > 0 : typeof value === 'string' ? value.trim() !== '' : value === true);

/** Questions that take a whole row: long text, a list of choices, a checkbox sentence. */
export const isWide = (field: PublicFormField) => (field.type === 'text' && field.multiline) || (field.type === 'select' && field.multiple) || field.type === 'checkbox';

const ErrorText: React.FC<{ id: string; error?: string }> = ({ id, error }) =>
  error ? (
    <p id={id} className="flex items-start gap-1.5 mt-2 text-[13px] leading-relaxed text-danger">
      <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{error}</span>
    </p>
  ) : null;

const HelpText: React.FC<{ id: string; help: string | null }> = ({ id, help }) =>
  help ? (
    <p id={id} className="flex items-start gap-1.5 mb-2.5 text-[13px] leading-relaxed text-ink-muted">
      <Info aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
      <span className="whitespace-pre-line">{help}</span>
    </p>
  ) : null;

export const ServiceFormField: React.FC<{
  field: PublicFormField;
  value: RawAnswer;
  error?: string;
  onChange: (value: RawAnswer) => void;
  onBlur: () => void;
}> = ({ field, value, error, onChange, onBlur }) => {
  const { t: { services: { form: t } } } = useI18n();
  const id = fieldInputId(field);
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const describedBy = [field.help ? helpId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const text = typeof value === 'string' ? value : '';

  const label = (
    <>
      {field.label}
      {!field.required && <span className="ms-1 font-normal text-ink-muted">{t.optionalMark}</span>}
    </>
  );

  // A sentence to tick, e.g. "I accept the terms"
  if (field.type === 'checkbox') {
    return (
      <div>
        <label htmlFor={id} className={`flex items-start gap-3 rounded-lg border bg-surface px-4 py-3.5 cursor-pointer transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-gold-line ${border(error)}`}>
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span aria-hidden="true" className="mt-0.5 flex w-5 h-5 shrink-0 items-center justify-center rounded border-2 border-ink/30 text-on-accent transition-colors peer-checked:border-brand-fill peer-checked:bg-brand-fill [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          <span className="text-[15px] font-bold leading-relaxed text-ink">{label}</span>
        </label>
        {field.help && (
          <div className="mt-2">
            <HelpText id={helpId} help={field.help} />
          </div>
        )}
        <ErrorText id={errorId} error={error} />
      </div>
    );
  }

  // Several options at once, as chips that toggle
  if (field.type === 'select' && field.multiple) {
    const chosen = Array.isArray(value) ? value : [];
    return (
      <fieldset aria-describedby={describedBy}>
        <legend className="block mb-2 text-sm font-bold text-ink">{label}</legend>
        <HelpText id={helpId} help={field.help} />
        <div className="flex flex-wrap gap-2">
          {field.options.map((option, index) => {
            const checked = chosen.includes(option.value);
            return (
              <label
                key={option.value}
                className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-lg border cursor-pointer text-[15px] font-bold transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-gold-line ${
                  checked ? 'border-brand bg-brand/10 text-ink-strong' : `bg-surface text-ink ${error ? 'border-danger' : 'border-ink/15 hover:border-ink/30'}`
                }`}
              >
                <input
                  id={index === 0 ? id : undefined}
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onChange(checked ? chosen.filter((item) => item !== option.value) : [...chosen, option.value])}
                />
                <span aria-hidden="true" className={`flex w-4 h-4 shrink-0 items-center justify-center rounded border-2 ${checked ? 'border-brand-fill bg-brand-fill text-on-accent' : 'border-ink/30'}`}>
                  {checked && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
        <ErrorText id={errorId} error={error} />
      </fieldset>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-bold text-ink">
        {label}
      </label>
      <HelpText id={helpId} help={field.help} />

      {field.type === 'select' ? (
        <div className="relative">
          <select
            id={id}
            value={text}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            className={`${CONTROL} ${border(error)} h-14 appearance-none ps-4 pe-11 ${text ? '' : 'text-ink-dim'}`}
          >
            <option value="">{t.choose}</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value} className="text-ink-strong">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 -translate-y-1/2 end-4 w-5 h-5 text-ink-dim" />
        </div>
      ) : field.type === 'text' && field.multiline ? (
        <textarea
          id={id}
          rows={5}
          maxLength={MULTILINE_MAX}
          value={text}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={`${CONTROL} ${border(error)} px-4 py-3.5 leading-relaxed resize-none`}
        />
      ) : (
        <input
          id={id}
          type="text"
          inputMode={field.type === 'number' ? 'decimal' : undefined}
          dir={field.type === 'number' ? 'ltr' : undefined}
          maxLength={field.type === 'text' ? TEXT_MAX : 50}
          value={text}
          placeholder={field.type === 'number' ? t.numberPlaceholder : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={`${CONTROL} ${border(error)} h-14 px-4 ${field.type === 'number' ? 'text-left rtl:placeholder:text-right' : ''}`}
        />
      )}
      <ErrorText id={errorId} error={error} />
    </div>
  );
};
