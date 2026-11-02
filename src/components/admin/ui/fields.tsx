'use client';

import React, { useId } from 'react';
import { FOCUS, INPUT, inputBorder } from './styles';

// Controlled form controls. Each one draws its own label, hint and error, so a form is a list of fields.

type FieldProps = {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: (id: string, describedBy?: string) => React.ReactNode;
};

export const Field: React.FC<FieldProps> = ({ label, error, hint, required, className = '', children }) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-bold text-[#14282D]">
        {label}
        {required && <span className="mr-0.5 text-[#DC2626]">*</span>}
      </label>
      {children(id, describedBy)}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs leading-relaxed text-[#DC2626]">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-[#5F7177]">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

type Common = { label: string; error?: string; hint?: React.ReactNode; required?: boolean; className?: string; disabled?: boolean };

export const TextInput: React.FC<
  Common & { value: string; onChange: (value: string) => void; type?: string; placeholder?: string; ltr?: boolean; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }
> = ({ label, error, hint, required, className, disabled, value, onChange, type = 'text', placeholder, ltr, autoComplete, inputMode }) => (
  <Field label={label} error={error} hint={hint} required={required} className={className}>
    {(id, describedBy) => (
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        dir={ltr ? 'ltr' : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} ${inputBorder(error)} h-10 ${ltr ? 'text-left' : ''}`}
      />
    )}
  </Field>
);

export const NumberInput: React.FC<Common & { value: number | string; onChange: (value: string) => void; min?: number; max?: number; step?: number | 'any' }> = ({
  label,
  error,
  hint,
  required,
  className,
  disabled,
  value,
  onChange,
  min,
  max,
  step,
}) => (
  <Field label={label} error={error} hint={hint} required={required} className={className}>
    {(id, describedBy) => (
      <input
        id={id}
        type="number"
        dir="ltr"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} ${inputBorder(error)} h-10 text-left`}
      />
    )}
  </Field>
);

export const TextArea: React.FC<Common & { value: string; onChange: (value: string) => void; rows?: number; placeholder?: string; maxLength?: number }> = ({
  label,
  error,
  hint,
  required,
  className,
  disabled,
  value,
  onChange,
  rows = 4,
  placeholder,
  maxLength,
}) => (
  <Field label={label} error={error} hint={hint} required={required} className={className}>
    {(id, describedBy) => (
      <textarea
        id={id}
        rows={rows}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} ${inputBorder(error)} py-2.5 leading-7 resize-y`}
      />
    )}
  </Field>
);

export type Option = { value: string; label: string };

export const Select: React.FC<Common & { value: string; onChange: (value: string) => void; options: Option[]; placeholder?: string }> = ({
  label,
  error,
  hint,
  required,
  className,
  disabled,
  value,
  onChange,
  options,
  placeholder,
}) => (
  <Field label={label} error={error} hint={hint} required={required} className={className}>
    {(id, describedBy) => (
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} ${inputBorder(error)} h-10 pl-8`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  </Field>
);

/** An on/off switch with its label beside it. */
export const Switch: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; hint?: string; disabled?: boolean }> = ({ label, checked, onChange, hint, disabled }) => (
  <label className={`flex items-start gap-3 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
    <span className="relative mt-0.5 inline-flex shrink-0">
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className={`peer sr-only`} />
      <span className={`h-6 w-11 rounded-full bg-[#CBD5D8] transition-colors peer-checked:bg-[#0B7A75] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0B7A75]`} />
      <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:-translate-x-5" />
    </span>
    <span>
      <span className="block text-sm font-bold text-[#14282D]">{label}</span>
      {hint && <span className="block mt-0.5 text-xs text-[#5F7177]">{hint}</span>}
    </span>
  </label>
);

/** A row of checkboxes for picking several of a few options. */
export const CheckboxGroup: React.FC<Common & { values: string[]; onChange: (values: string[]) => void; options: Option[] }> = ({ label, error, hint, values, onChange, options, className }) => (
  <fieldset className={className}>
    <legend className="mb-1.5 block text-[13px] font-bold text-[#14282D]">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <label
            key={option.value}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-bold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#0B7A75] ${
              checked ? 'border-[#0B7A75] bg-[#E6F4F3] text-[#0B5F5B]' : 'border-[#D5DDE0] text-[#3F5257] hover:bg-[#F4F6F7]'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => onChange(checked ? values.filter((value) => value !== option.value) : [...values, option.value])}
            />
            {option.label}
          </label>
        );
      })}
    </div>
    {error ? <p className="mt-1.5 text-xs text-[#DC2626]">{error}</p> : hint && <p className="mt-1.5 text-xs text-[#5F7177]">{hint}</p>}
  </fieldset>
);

/** The message shown at the top of a form when the server rejects it as a whole. */
export const FormAlert: React.FC<{ message?: string | null }> = ({ message }) =>
  message ? (
    <div role="alert" className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
      {message}
    </div>
  ) : null;

export const FormGrid: React.FC<{ children: React.ReactNode; cols?: 1 | 2 | 3 }> = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 gap-4 ${cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-3' : ''}`}>{children}</div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`mb-3 text-sm font-black text-[#0B5F5B] ${className}`}>{children}</h3>
);

export { FOCUS };
