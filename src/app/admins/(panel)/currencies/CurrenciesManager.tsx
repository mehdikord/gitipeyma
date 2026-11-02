'use client';

import React from 'react';
import Link from 'next/link';
import type { CurrencyRow } from '../../../../modules/currencies/queries';
import { deleteCurrency, saveCurrency } from '../../../../modules/currencies/actions';
import { formatDateTime } from '../../../../lib/format';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { FormGrid, NumberInput, Switch, TextInput } from '../../../../components/admin/ui/fields';
import { str } from '../../../../components/admin/ui/useForm';

type Values = { code: string; name: string; symbol: string; flag: string; rateToToman: string; isActive: boolean; sortOrder: string };

export const CurrenciesManager: React.FC<{ rows: CurrencyRow[]; feePercent: string }> = ({ rows, feePercent }) => (
  <CrudManager<CurrencyRow, Values>
    title="نرخ ارز"
    description={
      <>
        نرخ‌های محاسبه‌گر حواله در صفحه خدمات ارزی. کارمزد فعلی {Number(feePercent).toLocaleString('fa-IR')}٪ است و از{' '}
        <Link href="/admins/settings" className="font-bold text-[#0B7A75] hover:underline">
          تنظیمات سایت
        </Link>{' '}
        تغییر می‌کند.
      </>
    }
    noun="ارز"
    rows={rows}
    columns={[
      {
        key: 'name',
        header: 'ارز',
        cell: (row) => (
          <span className="flex items-center gap-2.5">
            <span className="text-lg">{row.flag}</span>
            <span>
              <span className="block font-bold">{row.name}</span>
              <span dir="ltr" className="block text-right text-xs text-[#5F7177]">
                {row.code} · {row.symbol}
              </span>
            </span>
          </span>
        ),
      },
      { key: 'rate', header: 'هر واحد به تومان', cell: (row) => <span className="font-black">{row.rateToToman.toLocaleString('fa-IR')}</span> },
      { key: 'updated', header: 'آخرین به‌روزرسانی', hideOnMobile: true, className: 'whitespace-nowrap text-xs text-[#5F7177]', cell: (row) => formatDateTime(row.updatedAt) },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
    ]}
    emptyValues={() => ({ code: '', name: '', symbol: '', flag: '', rateToToman: '', isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({
      code: row.code,
      name: row.name,
      symbol: row.symbol,
      flag: str(row.flag),
      rateToToman: String(row.rateToToman),
      isActive: row.isActive,
      sortOrder: String(row.sortOrder),
    })}
    save={saveCurrency}
    remove={deleteCurrency}
    deleteMessage={(row) => `ارز «${row.name}» از محاسبه‌گر حذف شود؟`}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <FormGrid>
          <TextInput label="نام ارز" required value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
          <TextInput label="کد ارز" required ltr hint="سه حرف، مثل USD" value={values.code} onChange={(v) => set('code', v)} error={errors.code} />
          <TextInput label="نماد" required ltr value={values.symbol} onChange={(v) => set('symbol', v)} error={errors.symbol} />
          <TextInput label="پرچم (ایموجی)" value={values.flag} onChange={(v) => set('flag', v)} error={errors.flag} />
          <TextInput label="نرخ هر واحد به تومان" required ltr inputMode="decimal" value={values.rateToToman} onChange={(v) => set('rateToToman', v)} error={errors.rateToToman} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
        <Switch label="نمایش در محاسبه‌گر" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
