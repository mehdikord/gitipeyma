'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Search, X } from 'lucide-react';
import { INPUT } from './styles';
import type { Option } from './fields';

type Filter = { name: string; label: string; options: Option[]; allLabel?: string };

/**
 * Search and filters that live in the address bar (?q=...&status=...), so the list is filtered on
 * the server, survives a reload and can be shared as a link. Changing anything returns to page 1.
 */
export const FilterBar: React.FC<{ searchPlaceholder?: string; filters?: Filter[]; children?: React.ReactNode }> = ({ searchPlaceholder, filters = [], children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const apply = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete('page');
    const next = params.toString();
    startTransition(() => router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false }));
  };

  // Search as the admin types, once they pause
  useEffect(() => {
    if (searchPlaceholder === undefined || query === (searchParams.get('q') ?? '')) return;
    const timer = setTimeout(() => apply({ q: query.trim() }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
      {searchPlaceholder !== undefined && (
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3A8]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="جستجو"
            className={`${INPUT} h-10 border-[#D5DDE0] pr-9 pl-8`}
          />
          {query && (
            <button type="button" aria-label="پاک کردن جستجو" onClick={() => setQuery('')} className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#94A3A8] hover:text-[#14282D]">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      {filters.map((filter) => (
        <select
          key={filter.name}
          aria-label={filter.label}
          value={searchParams.get(filter.name) ?? ''}
          onChange={(event) => apply({ [filter.name]: event.target.value })}
          className={`${INPUT} h-10 border-[#D5DDE0] pl-8 sm:w-auto sm:min-w-44`}
        >
          <option value="">{filter.allLabel ?? `${filter.label}: همه`}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      {isPending && <Loader2 aria-label="در حال بارگذاری" className="h-4 w-4 animate-spin text-[#0B7A75]" />}
      {children && <div className="flex items-center gap-2 sm:mr-auto">{children}</div>}
    </div>
  );
};
