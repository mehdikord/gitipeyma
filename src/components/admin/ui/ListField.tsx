'use client';

import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button, IconButton } from './Button';

type ListFieldProps<T> = {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel: string;
  // Draws one row's inputs; `index` is used to find that row's errors ("steps.2.title").
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  emptyText?: string;
  max?: number;
  error?: string;
};

/** An ordered list the admin can add to, remove from and reorder: features, steps, FAQs, phones. */
export function ListField<T>({ label, items, onChange, newItem, addLabel, renderItem, emptyText = 'هنوز موردی اضافه نشده است.', max, error }: ListFieldProps<T>) {
  const update = (index: number, patch: Partial<T>) => onChange(items.map((item, i) => (i === index ? ({ ...item, ...patch } as T) : item)));
  const move = (index: number, by: number) => {
    const next = [...items];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-center justify-between gap-3">
        <span className="text-[13px] font-bold text-[#14282D]">
          {label} <span className="font-normal text-[#5F7177]">({items.length.toLocaleString('fa-IR')})</span>
        </span>
      </legend>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#D5DDE0] px-4 py-5 text-center text-[13px] text-[#5F7177]">{emptyText}</p>
      ) : (
        <ol className="space-y-2.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 rounded-lg border border-[#E3E8EA] bg-[#FAFBFB] p-3">
              <span className="mt-2 w-6 shrink-0 text-center text-xs font-black text-[#5F7177]">{(index + 1).toLocaleString('fa-IR')}</span>
              <div className="min-w-0 flex-1">{renderItem(item, (patch) => update(index, patch), index)}</div>
              <div className="flex shrink-0 flex-col gap-0.5 sm:flex-row">
                <IconButton label="انتقال به بالا" icon={ArrowUp} disabled={index === 0} onClick={() => move(index, -1)} />
                <IconButton label="انتقال به پایین" icon={ArrowDown} disabled={index === items.length - 1} onClick={() => move(index, 1)} />
                <IconButton label="حذف" icon={Trash2} tone="danger" onClick={() => onChange(items.filter((_, i) => i !== index))} />
              </div>
            </li>
          ))}
        </ol>
      )}

      {error && <p className="mt-1.5 text-xs text-[#DC2626]">{error}</p>}

      {(max === undefined || items.length < max) && (
        <Button variant="secondary" size="sm" icon={Plus} className="mt-2.5" onClick={() => onChange([...items, newItem()])}>
          {addLabel}
        </Button>
      )}
    </fieldset>
  );
}
