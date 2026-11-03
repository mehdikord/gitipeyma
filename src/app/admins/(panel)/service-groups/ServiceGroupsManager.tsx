'use client';

import React from 'react';
import type { ServiceGroupRow } from '../../../../modules/serviceGroups/queries';
import { deleteServiceGroup, saveServiceGroup } from '../../../../modules/serviceGroups/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { FormGrid, NumberInput, Select } from '../../../../components/admin/ui/fields';
import { TranslatedInput, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = { title: TranslatedInput; tone: 'teal' | 'gold'; sortOrder: string };

const TONES = [
  { value: 'teal', label: 'فیروزه‌ای' },
  { value: 'gold', label: 'طلایی' },
];

export const ServiceGroupsManager: React.FC<{ rows: ServiceGroupRow[] }> = ({ rows }) => (
  <CrudManager<ServiceGroupRow, Values>
    title="گروه‌های صفحه اصلی"
    description="خطوط نقشه خدمات در صفحه اصلی و دسته‌های صفحه مشاوره. هر خدمت را از فرم خودش به یک گروه وصل کنید."
    noun="گروه"
    rows={rows}
    columns={[
      {
        key: 'title',
        header: 'عنوان',
        cell: (row) => (
          <span className="flex items-center gap-2.5 font-bold">
            <span aria-hidden="true" className={`h-3 w-3 rounded-full ${row.tone === 'teal' ? 'bg-[#12B8B0]' : 'bg-[#C6A15B]'}`} />
            {fa(row.title)}
          </span>
        ),
      },
      { key: 'services', header: 'خدمات این گروه', cell: (row) => <span className="font-normal text-[#3F5257]">{row.services.join('، ') || '—'}</span> },
      { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
    ]}
    emptyValues={() => ({ title: emptyTranslated(), tone: 'teal', sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ title: toInputs(row.title), tone: row.tone, sortOrder: String(row.sortOrder) })}
    save={saveServiceGroup}
    remove={deleteServiceGroup}
    deleteMessage={(row) => `گروه «${fa(row.title)}» حذف شود؟ خدمات آن حذف نمی‌شوند، فقط بدون گروه می‌مانند و در نقشه صفحه اصلی دیده نمی‌شوند.`}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <TransTextInput label="عنوان" required name="title" hint="مثل «برای سفر و ارسال بار»" value={values.title} onChange={(v) => set('title', v)} errors={errors} />
        <FormGrid>
          <Select label="رنگ خط" value={values.tone} onChange={(v) => set('tone', v as Values['tone'])} options={TONES} error={errors.tone} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
      </div>
    )}
  />
);
