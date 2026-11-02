'use client';

import React from 'react';
import type { TrustQuoteRow } from '../../../../modules/trustQuotes/queries';
import { deleteTrustQuote, saveTrustQuote } from '../../../../modules/trustQuotes/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { NumberInput, Switch, TextArea } from '../../../../components/admin/ui/fields';

type Values = { text: string; isActive: boolean; sortOrder: string };

export const TrustQuotesManager: React.FC<{ rows: TrustQuoteRow[] }> = ({ rows }) => (
  <CrudManager<TrustQuoteRow, Values>
    title="جملات کوتاه اعتماد"
    description="جمله‌هایی که زیر نظرات مشتریان در صفحه اصلی حرکت می‌کنند."
    noun="جمله"
    rows={rows}
    columns={[
      { key: 'text', header: 'متن', cell: (row) => <span className="font-normal">{row.text}</span> },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
      { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
    ]}
    emptyValues={() => ({ text: '', isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ text: row.text, isActive: row.isActive, sortOrder: String(row.sortOrder) })}
    save={saveTrustQuote}
    remove={deleteTrustQuote}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <TextArea label="متن" required rows={3} maxLength={500} value={values.text} onChange={(v) => set('text', v)} error={errors.text} />
        <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
