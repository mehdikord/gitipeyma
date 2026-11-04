'use client';

import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

// A field of the public forms. A ltr field (a phone number) is laid out left to right on every page;
// the others follow the page's direction.

export const TextField: React.FC<{
  id: string;
  label: string;
  value: string;
  error?: string;
  valid: boolean;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onBlur: () => void;
  autoComplete: string;
  type?: string;
  inputMode?: 'tel' | 'text';
  ltr?: boolean;
}> = ({ id, label, value, error, valid, placeholder, inputRef, onChange, onBlur, autoComplete, type = 'text', inputMode, ltr }) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-bold text-ink">
      {label}
    </label>
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type={type}
        inputMode={inputMode}
        dir={ltr ? 'ltr' : undefined}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`w-full h-14 rounded-lg bg-surface border text-base text-ink-strong placeholder:text-ink-dim outline-none transition-colors focus:border-gold-line focus:ring-1 focus:ring-gold-line ${
          ltr ? 'pl-4 pr-11 text-left rtl:placeholder:text-right' : 'ps-4 pe-11'
        } ${error ? 'border-danger' : 'border-ink/15 hover:border-ink/30'}`}
      />
      {valid && <Check aria-hidden="true" className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-brand-bright ${ltr ? 'right-4' : 'end-4'}`} />}
    </div>
    {error && (
      <p id={`${id}-error`} className="flex items-start gap-1.5 mt-2 text-[13px] leading-relaxed text-danger">
        <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
        <span>{error}</span>
      </p>
    )}
  </div>
);
