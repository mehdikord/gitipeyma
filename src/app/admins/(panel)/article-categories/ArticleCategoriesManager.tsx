'use client';

import React from 'react';
import Link from 'next/link';
import type { ArticleCategoryRow } from '../../../../modules/articleCategories/queries';
import { deleteArticleCategory, saveArticleCategory } from '../../../../modules/articleCategories/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { TranslatedInput, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = { name: TranslatedInput };

export const ArticleCategoriesManager: React.FC<{ rows: ArticleCategoryRow[] }> = ({ rows }) => (
  <CrudManager<ArticleCategoryRow, Values>
    title="دسته‌بندی مقالات"
    description="بخش‌های وبلاگ؛ هر مقاله در یکی از این دسته‌ها قرار می‌گیرد."
    noun="دسته"
    rows={rows}
    modalSize="sm"
    emptyText="هنوز دسته‌ای ساخته نشده است."
    columns={[
      { key: 'name', header: 'نام دسته', cell: (row) => <span className="font-bold">{fa(row.name)}</span> },
      {
        key: 'articles',
        header: 'مقالات',
        cell: (row) =>
          row.articleCount > 0 ? (
            <Link href={`/admins/articles?category=${row.id}`} onClick={(event) => event.stopPropagation()} className="font-bold text-[#094BAF] hover:underline">
              {row.articleCount.toLocaleString('fa-IR')} مقاله
            </Link>
          ) : (
            <span className="text-[#94A1B5]">—</span>
          ),
      },
    ]}
    emptyValues={() => ({ name: emptyTranslated() })}
    toValues={(row) => ({ name: toInputs(row.name) })}
    save={saveArticleCategory}
    remove={deleteArticleCategory}
    deleteMessage={(row) =>
      row.articleCount > 0
        ? `«${fa(row.name)}» ${row.articleCount.toLocaleString('fa-IR')} مقاله دارد؛ ابتدا آن‌ها را به دسته دیگری منتقل کنید.`
        : `دسته «${fa(row.name)}» حذف شود؟`
    }
    renderForm={({ values, set, errors }) => <TransTextInput label="نام دسته" required name="name" value={values.name} onChange={(v) => set('name', v)} errors={errors} />}
  />
);
