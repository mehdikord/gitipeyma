'use client';

import React from 'react';
import type { ServiceCategoryRow } from '../../../../modules/serviceCategories/queries';
import { deleteServiceCategory, saveServiceCategory } from '../../../../modules/serviceCategories/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { FormGrid, NumberInput, TextInput } from '../../../../components/admin/ui/fields';

type Values = { title: string; slug: string; sortOrder: string };

export const ServiceCategoriesManager: React.FC<{ rows: ServiceCategoryRow[] }> = ({ rows }) => (
  <CrudManager<ServiceCategoryRow, Values>
    title="دسته‌بندی خدمات"
    description="فیلترهای صفحه «فهرست خدمات» و دسته نظرات مشتریان."
    noun="دسته"
    rows={rows}
    columns={[
      { key: 'title', header: 'عنوان', cell: (row) => <span className="font-bold">{row.title}</span> },
      { key: 'slug', header: 'نامک', cell: (row) => <span dir="ltr" className="text-[#5F7177]">{row.slug}</span> },
      { key: 'services', header: 'خدمات', cell: (row) => row.serviceCount.toLocaleString('fa-IR') },
      { key: 'testimonials', header: 'نظرات', hideOnMobile: true, cell: (row) => row.testimonialCount.toLocaleString('fa-IR') },
      { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
    ]}
    emptyValues={() => ({ title: '', slug: '', sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({ title: row.title, slug: row.slug, sortOrder: String(row.sortOrder) })}
    save={saveServiceCategory}
    remove={deleteServiceCategory}
    deleteMessage={(row) => (row.serviceCount > 0 ? `«${row.title}» ${row.serviceCount.toLocaleString('fa-IR')} خدمت دارد؛ ابتدا آن‌ها را به دسته دیگری منتقل کنید.` : `دسته «${row.title}» حذف شود؟`)}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <TextInput label="عنوان" required value={values.title} onChange={(v) => set('title', v)} error={errors.title} />
        <FormGrid>
          <TextInput label="نامک" required ltr hint="حروف کوچک انگلیسی، مثل cargo" value={values.slug} onChange={(v) => set('slug', v)} error={errors.slug} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
      </div>
    )}
  />
);
