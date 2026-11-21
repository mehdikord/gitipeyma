'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { CARD } from './styles';

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  // Hidden on narrow screens; the first columns and the actions stay.
  hideOnMobile?: boolean;
};

type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyText?: string;
  // Rows that need attention (a new request, an unread message) are drawn in bold.
  highlight?: (row: T) => boolean;
};

export function DataTable<T>({ rows, columns, rowKey, actions, onRowClick, emptyText = 'موردی برای نمایش وجود ندارد.', highlight }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center justify-center gap-2 px-6 py-14 text-center`}>
        <Inbox className="h-9 w-9 text-[#B8C3D4]" />
        <p className="text-sm text-[#5D6B82]">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-[#E2E8F1] bg-[#FAFBFD] text-xs text-[#5D6B82]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={`whitespace-nowrap px-4 py-3 font-bold ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
              {actions && (
                <th scope="col" className="w-px px-4 py-3">
                  <span className="sr-only">عملیات</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F8]">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[#F7F9FC]' : ''} ${highlight?.(row) ? 'bg-[#F1F5FC] font-bold' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 align-middle text-[#0E1B30] ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.className ?? ''}`}>
                    {column.cell(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-3 py-2" onClick={(event) => event.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
