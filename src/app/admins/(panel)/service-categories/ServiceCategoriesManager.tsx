'use client';

import React from 'react';
import type { ServiceCategoryRow } from '../../../../modules/serviceCategories/queries';
import { deleteServiceCategory, saveServiceCategory } from '../../../../modules/serviceCategories/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { FormGrid, NumberInput, TextInput } from '../../../../components/admin/ui/fields';
import { TranslatedInput, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = { title: TranslatedInput; slug: string; sortOrder: string };

export const ServiceCategoriesManager: React.FC<{ rows: ServiceCategoryRow[] }> = ({ rows }) => (
  <CrudManager<ServiceCategoryRow, Values>
    title="دسته‌بندی خدمات"
    description="فیلترهای صفحه «فهرست خدمات» و دسته نظرات مشتریان."
    noun="دسته"
    rows={rows}
    columns={[
      { key: 'title', header: 'عنوان', cell: (row) => <span className="font-bold">{fa(row.title)}</span> },
      { key: 'slug', header: 'نامک', cell: (row) => <span dir="ltr" className="text-[#5F7177]">{row.slug}</span> },
      { key: 'services', header: 'خدمات', cell: (row) => row.serviceCount.toLocaleString('fa-IR') },
      { key: 'testimonials', header: 'نظرات', hideOnMobile: true, cell: (row) => row.testimonialCount.toLocaleString('fa-IR') },
      { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
    ]}
    emptyValues={() => ({ title: emptyTranslated(), slug: '', sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ title: toInputs(row.title), slug: row.slug, sortOrder: String(row.sortOrder) })}
    save={saveServiceCategory}
    remove={deleteServiceCategory}
    deleteMessage={(row) => (row.serviceCount > 0 ? `«${fa(row.title)}» ${row.serviceCount.toLocaleString('fa-IR')} خدمت دارد؛ ابتدا آن‌ها را به دسته دیگری منتقل کنید.` : `دسته «${fa(row.title)}» حذف شود؟`)}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <TransTextInput label="عنوان" required name="title" value={values.title} onChange={(v) => set('title', v)} errors={errors} />
        <FormGrid>
          <TextInput label="نامک" required ltr hint="حروف کوچک انگلیسی، مثل cargo" value={values.slug} onChange={(v) => set('slug', v)} error={errors.slug} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
      </div>
    )}
  />
);
