'use client';

import React from 'react';
import Link from 'next/link';
import type { TagRow } from '../../../../modules/tags/queries';
import { deleteTag, saveTag } from '../../../../modules/tags/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import { TranslatedInput, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = { name: TranslatedInput };

export const TagsManager: React.FC<{ rows: TagRow[] }> = ({ rows }) => (
  <CrudManager<TagRow, Values>
    title="برچسب‌ها"
    description="موضوعاتی که به مقالات زده می‌شود؛ هر مقاله می‌تواند چند برچسب داشته باشد."
    noun="برچسب"
    rows={rows}
    modalSize="sm"
    toolbar={<FilterBar searchPlaceholder="جستجوی برچسب..." />}
    emptyText="برچسبی پیدا نشد."
    columns={[
      { key: 'name', header: 'برچسب', cell: (row) => <span className="font-bold">#{fa(row.name)}</span> },
      {
        key: 'articles',
        header: 'مقالات',
        cell: (row) =>
          row.articleCount > 0 ? (
            <span className="font-bold text-[#073C8C]">{row.articleCount.toLocaleString('fa-IR')} مقاله</span>
          ) : (
            <span className="text-[#94A1B5]">بدون مقاله</span>
          ),
      },
    ]}
    emptyValues={() => ({ name: emptyTranslated() })}
    toValues={(row) => ({ name: toInputs(row.name) })}
    save={saveTag}
    remove={deleteTag}
    deleteMessage={(row) =>
      row.articleCount > 0
        ? `برچسب «${fa(row.name)}» از ${row.articleCount.toLocaleString('fa-IR')} مقاله برداشته و حذف می‌شود. ادامه می‌دهید؟`
        : `برچسب «${fa(row.name)}» حذف شود؟`
    }
    renderForm={({ values, set, errors }) => (
      <div className="space-y-3">
        <TransTextInput label="نام برچسب" required name="name" value={values.name} onChange={(v) => set('name', v)} errors={errors} />
        <p className="text-xs leading-relaxed text-[#5D6B82]">
          برچسب‌ها را می‌توانید هنگام نوشتن مقاله هم <Link href="/admins/articles/new" className="font-bold text-[#094BAF] hover:underline">در خود فرم مقاله</Link> بسازید.
        </p>
      </div>
    )}
  />
);
