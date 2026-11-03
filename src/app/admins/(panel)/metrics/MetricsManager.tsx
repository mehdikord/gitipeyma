'use client';

import React from 'react';
import type { MetricRow } from '../../../../modules/metrics/queries';
import { deleteMetric, saveMetric } from '../../../../modules/metrics/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { FormGrid, NumberInput, Switch } from '../../../../components/admin/ui/fields';
import { TranslatedInput, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = { value: TranslatedInput; label: TranslatedInput; subtext: TranslatedInput; trend: TranslatedInput; isActive: boolean; sortOrder: string };

export const MetricsManager: React.FC<{ rows: MetricRow[] }> = ({ rows }) => (
  <CrudManager<MetricRow, Values>
    title="آمار و ارقام"
    description="اعداد بالای بخش نظرات مشتریان در صفحه اصلی."
    noun="آمار"
    rows={rows}
    columns={[
      { key: 'value', header: 'عدد', cell: (row) => <span className="text-base font-black text-[#0B7A75]">{fa(row.value)}</span> },
      { key: 'label', header: 'عنوان', cell: (row) => fa(row.label) },
      { key: 'trend', header: 'روند', hideOnMobile: true, cell: (row) => <span className="font-normal text-[#5F7177]">{fa(row.trend) || '—'}</span> },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
    ]}
    emptyValues={() => ({ value: emptyTranslated(), label: emptyTranslated(), subtext: emptyTranslated(), trend: emptyTranslated(), isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ value: toInputs(row.value), label: toInputs(row.label), subtext: toInputs(row.subtext), trend: toInputs(row.trend), isActive: row.isActive, sortOrder: String(row.sortOrder) })}
    save={saveMetric}
    remove={deleteMetric}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <FormGrid>
          <TransTextInput label="عدد" required name="value" hint="مثل «+۲۸,۵۰۰» یا «۹۹.۶٪»؛ در انگلیسی و ترکی با ارقام لاتین." value={values.value} onChange={(v) => set('value', v)} errors={errors} />
          <TransTextInput label="عنوان" required name="label" value={values.label} onChange={(v) => set('label', v)} errors={errors} />
          <TransTextInput label="توضیح" name="subtext" value={values.subtext} onChange={(v) => set('subtext', v)} errors={errors} />
          <TransTextInput label="روند" name="trend" value={values.trend} onChange={(v) => set('trend', v)} errors={errors} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
