'use client';

import React from 'react';
import type { MetricRow } from '../../../../modules/metrics/queries';
import { deleteMetric, saveMetric } from '../../../../modules/metrics/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { FormGrid, NumberInput, Switch, TextInput } from '../../../../components/admin/ui/fields';
import { str } from '../../../../components/admin/ui/useForm';

type Values = { value: string; label: string; subtext: string; trend: string; isActive: boolean; sortOrder: string };

export const MetricsManager: React.FC<{ rows: MetricRow[] }> = ({ rows }) => (
  <CrudManager<MetricRow, Values>
    title="آمار و ارقام"
    description="اعداد بالای بخش نظرات مشتریان در صفحه اصلی."
    noun="آمار"
    rows={rows}
    columns={[
      { key: 'value', header: 'عدد', cell: (row) => <span className="text-base font-black text-[#0B7A75]">{row.value}</span> },
      { key: 'label', header: 'عنوان', cell: (row) => row.label },
      { key: 'trend', header: 'روند', hideOnMobile: true, cell: (row) => <span className="font-normal text-[#5F7177]">{row.trend ?? '—'}</span> },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
    ]}
    emptyValues={() => ({ value: '', label: '', subtext: '', trend: '', isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ value: row.value, label: row.label, subtext: str(row.subtext), trend: str(row.trend), isActive: row.isActive, sortOrder: String(row.sortOrder) })}
    save={saveMetric}
    remove={deleteMetric}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <FormGrid>
          <TextInput label="عدد" required hint="مثل «+۲۸,۵۰۰» یا «۹۹.۶٪»" value={values.value} onChange={(v) => set('value', v)} error={errors.value} />
          <TextInput label="عنوان" required value={values.label} onChange={(v) => set('label', v)} error={errors.label} />
          <TextInput label="توضیح" value={values.subtext} onChange={(v) => set('subtext', v)} error={errors.subtext} />
          <TextInput label="روند" value={values.trend} onChange={(v) => set('trend', v)} error={errors.trend} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
