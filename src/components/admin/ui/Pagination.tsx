'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FOCUS } from './styles';

const fa = (n: number) => n.toLocaleString('fa-IR');

export const Pagination: React.FC<{ page: number; pages: number; total: number; perPage: number }> = ({ page, pages, total, perPage }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total === 0) return null;

  const href = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete('page');
    else params.set('page', String(target));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  // The current page with two on each side, plus the first and last
  const shown = Array.from(new Set([1, ...Array.from({ length: 5 }, (_, i) => page - 2 + i), pages])).filter((n) => n >= 1 && n <= pages);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const cell = `inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-bold ${FOCUS}`;

  return (
    <nav aria-label="صفحه‌بندی" className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-[13px] text-[#5F7177]">
        نمایش {fa(from)} تا {fa(to)} از {fa(total)} مورد
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          {page > 1 ? (
            <Link href={href(page - 1)} aria-label="صفحه قبل" className={`${cell} text-[#3F5257] hover:bg-[#EEF2F3]`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}
          {shown.map((n, index) => (
            <React.Fragment key={n}>
              {index > 0 && n - shown[index - 1] > 1 && <span className="px-1 text-[#94A3A8]">…</span>}
              <Link
                href={href(n)}
                aria-current={n === page ? 'page' : undefined}
                className={`${cell} ${n === page ? 'bg-[#0B7A75] text-white' : 'text-[#3F5257] hover:bg-[#EEF2F3]'}`}
              >
                {fa(n)}
              </Link>
            </React.Fragment>
          ))}
          {page < pages ? (
            <Link href={href(page + 1)} aria-label="صفحه بعد" className={`${cell} text-[#3F5257] hover:bg-[#EEF2F3]`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      )}
    </nav>
  );
};
