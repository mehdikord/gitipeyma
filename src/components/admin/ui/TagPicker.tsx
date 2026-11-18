'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Loader2, Plus, Search, Tag, X } from 'lucide-react';
import type { Option } from './fields';
import type { ActionResult } from '../../../lib/actions';
import { INPUT, FOCUS } from './styles';

type Props = {
  label: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  // Makes a tag from what was typed and returns it, so it can be picked at once
  onCreate?: (name: string) => Promise<ActionResult<unknown>>;
  error?: string;
  max?: number;
};

const fa = (n: number) => n.toLocaleString('fa-IR');

/** Picks several of many: the picked ones as chips, a search over the rest, and making a new one in place. */
export const TagPicker: React.FC<Props> = ({ label, options: initialOptions, values, onChange, onCreate, error, max = 30 }) => {
  const [options, setOptions] = useState(initialOptions);
  const [query, setQuery] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, startCreating] = useTransition();

  const byValue = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);
  const term = query.trim();
  const matches = options.filter((option) => !values.includes(option.value) && (!term || option.label.includes(term))).slice(0, 12);
  const exact = options.some((option) => option.label === term);
  const full = values.length >= max;

  const add = (value: string) => {
    if (full || values.includes(value)) return;
    onChange([...values, value]);
    setQuery('');
  };

  const create = () => {
    if (!onCreate || !term || full) return;
    setCreateError(null);
    startCreating(async () => {
      const result = await onCreate(term);
      const option = result.data as Option | undefined;
      if (!result.ok || !option) {
        setCreateError(result.message ?? 'برچسب ساخته نشد.');
        return;
      }
      setOptions((current) => (current.some((item) => item.value === option.value) ? current : [...current, option]));
      add(option.value);
    });
  };

  return (
    <div>
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-bold text-[#14282D]">
        {label}
        <span className="text-[11px] font-normal text-[#94A3A8]">
          {fa(values.length)} از {fa(max)}
        </span>
      </span>

      {values.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <li key={value} className="inline-flex items-center gap-1 rounded-full bg-[#E6F4F3] py-1 pl-1 pr-2.5 text-xs font-bold text-[#0B5F5B]">
              <Tag className="h-3 w-3" />
              {byValue.get(value)?.label ?? value}
              <button type="button" aria-label={`برداشتن ${byValue.get(value)?.label ?? ''}`} onClick={() => onChange(values.filter((item) => item !== value))} className={`rounded-full p-0.5 hover:bg-[#CCE8E6] ${FOCUS}`}>
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3A8]" />
        <input
          type="search"
          value={query}
          disabled={full}
          aria-label={`جستجو در ${label}`}
          placeholder={full ? 'به سقف برچسب‌ها رسیده‌اید' : 'جستجو یا نوشتن برچسب تازه...'}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            if (matches[0] && (exact || !onCreate)) add(options.find((option) => option.label === term)?.value ?? matches[0].value);
            else if (term) create();
          }}
          className={`${INPUT} h-10 border-[#D5DDE0] pr-9`}
        />
      </div>

      {(term || matches.length > 0) && !full && (
        <div className="mt-2 flex max-h-44 flex-wrap gap-1.5 overflow-y-auto">
          {matches.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => add(option.value)}
              className={`rounded-full border border-[#D5DDE0] px-2.5 py-1 text-xs font-bold text-[#3F5257] hover:border-[#0B7A75] hover:text-[#0B5F5B] ${FOCUS}`}
            >
              {option.label}
            </button>
          ))}
          {onCreate && term && !exact && (
            <button
              type="button"
              onClick={create}
              disabled={creating}
              className={`inline-flex items-center gap-1 rounded-full border border-dashed border-[#0B7A75] px-2.5 py-1 text-xs font-bold text-[#0B5F5B] hover:bg-[#E6F4F3] ${FOCUS}`}
            >
              {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
              ساخت برچسب «{term}»
            </button>
          )}
        </div>
      )}

      {createError || error ? (
        <p className="mt-1.5 text-xs text-[#DC2626]">{createError ?? error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-[#5F7177]">برچسب تازه با نام فارسی ساخته می‌شود؛ ترجمه‌اش را در صفحه «برچسب‌ها» بنویسید.</p>
      )}
    </div>
  );
};
