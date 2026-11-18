'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Eye, EyeOff, FileText, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import type { ArticleAdminRow } from '../../../../modules/articles/queries';
import { deleteArticle, setArticleStatus } from '../../../../modules/articles/actions';
import type { Paginated } from '../../../../lib/pagination';
import { Badge } from '../../../../components/admin/ui/Badge';
import { ButtonLink, IconButton } from '../../../../components/admin/ui/Button';
import { useConfirm } from '../../../../components/admin/ui/Confirm';
import { DataTable } from '../../../../components/admin/ui/DataTable';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import type { Option } from '../../../../components/admin/ui/fields';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import { Pagination } from '../../../../components/admin/ui/Pagination';
import { useToast } from '../../../../components/admin/ui/Toast';
import { TranslationStatus } from '../../../../components/admin/ui/translations';
import { fa, toInputs } from '../../../../i18n/translated';

const STATE = {
  draft: { label: 'پیش‌نویس', tone: 'gray' },
  published: { label: 'منتشر شده', tone: 'green' },
  scheduled: { label: 'زمان‌بندی‌شده', tone: 'blue' },
} as const;

const STATE_OPTIONS: Option[] = [
  { value: 'published', label: 'منتشر شده' },
  { value: 'scheduled', label: 'زمان‌بندی‌شده' },
  { value: 'draft', label: 'پیش‌نویس' },
];

const num = (n: number) => n.toLocaleString('fa-IR');
// In Iran time, so the server's render and the browser's agree whatever clock the server runs on
const date = (iso: string) => new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Tehran' });

export const ArticlesManager: React.FC<{ articles: Paginated<ArticleAdminRow>; categories: Option[] }> = ({ articles, categories }) => {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const edit = (row: ArticleAdminRow) => router.push(`/admins/articles/${row.id}/edit`);

  const report = (result: { ok: boolean; message?: string }) => (result.ok ? toast.success(result.message ?? 'انجام شد.') : toast.error(result.message ?? 'انجام نشد.'));

  const togglePublished = async (row: ArticleAdminRow) => {
    const publishing = row.state === 'draft';
    if (!publishing && !(await confirm({ title: 'لغو انتشار', message: `«${fa(row.title)}» از سایت برداشته و پیش‌نویس می‌شود.`, confirmLabel: 'لغو انتشار', tone: 'primary' }))) return;
    report(await setArticleStatus(row.id, publishing ? 'published' : 'draft'));
  };

  const remove = async (row: ArticleAdminRow) => {
    if (!(await confirm({ title: 'حذف مقاله', message: `مقاله «${fa(row.title)}» برای همیشه حذف شود؟ این کار قابل بازگشت نیست.` }))) return;
    report(await deleteArticle(row.id));
  };

  return (
    <>
      <PageHeader
        title="مقالات"
        description="نوشتن، ویرایش و انتشار مقالات وبلاگ سایت."
        actions={
          <ButtonLink href="/admins/articles/new" variant="primary" icon={Plus}>
            مقاله جدید
          </ButtonLink>
        }
      />

      <FilterBar
        searchPlaceholder="جستجو در عنوان یا نامک..."
        filters={[
          { name: 'state', label: 'وضعیت', options: STATE_OPTIONS },
          { name: 'category', label: 'دسته', options: categories },
        ]}
      />

      <DataTable
        rows={articles.rows}
        rowKey={(row) => row.id}
        onRowClick={edit}
        emptyText="مقاله‌ای پیدا نشد. با «مقاله جدید» اولین مقاله را بنویسید."
        columns={[
          {
            key: 'title',
            header: 'مقاله',
            cell: (row) => (
              <div className="flex min-w-64 items-center gap-3">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#EEF2F3]">
                  {row.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <FileText className="h-5 w-5 text-[#B8C5C9]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-bold leading-snug">
                    {row.isFeatured && <Star aria-label="مقاله ویژه" className="h-3.5 w-3.5 shrink-0 fill-[#E2C98C] text-[#C6A15B]" />}
                    <span className="line-clamp-2">{fa(row.title)}</span>
                  </p>
                  <p dir="ltr" className="mt-0.5 truncate text-right text-xs text-[#94A3A8]">
                    /blog/{row.slug}
                  </p>
                </div>
              </div>
            ),
          },
          { key: 'category', header: 'دسته', hideOnMobile: true, cell: (row) => <span className="text-[13px]">{row.categoryName}</span> },
          { key: 'state', header: 'وضعیت', cell: (row) => <Badge tone={STATE[row.state].tone}>{STATE[row.state].label}</Badge> },
          {
            key: 'date',
            header: 'تاریخ انتشار',
            hideOnMobile: true,
            cell: (row) => <span className="whitespace-nowrap text-[13px] text-[#3F5257]">{row.publishedAt ? date(row.publishedAt) : '—'}</span>,
          },
          {
            key: 'views',
            header: 'بازدید',
            hideOnMobile: true,
            cell: (row) => (
              <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#3F5257]">
                <Eye className="h-3.5 w-3.5 text-[#94A3A8]" />
                {num(row.views)}
              </span>
            ),
          },
          { key: 'tags', header: 'برچسب', hideOnMobile: true, cell: (row) => <span className="text-[13px] text-[#5F7177]">{row.tagCount ? num(row.tagCount) : '—'}</span> },
          {
            key: 'translations',
            header: 'ترجمه',
            hideOnMobile: true,
            cell: (row) => (
              <TranslationStatus values={{ title: toInputs(row.translations.title), excerpt: toInputs(row.translations.excerpt), content: toInputs(row.translations.content) }} />
            ),
          },
        ]}
        actions={(row) => (
          <>
            {row.state === 'published' && (
              <a
                href={`/fa/blog/${row.slug}`}
                target="_blank"
                rel="noreferrer"
                title="مشاهده در سایت"
                aria-label="مشاهده در سایت"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#3F5257] hover:bg-[#EEF2F3]"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <IconButton label={row.state === 'draft' ? 'انتشار' : 'لغو انتشار'} icon={row.state === 'draft' ? Eye : EyeOff} onClick={() => togglePublished(row)} />
            <IconButton label="ویرایش" icon={Pencil} onClick={() => edit(row)} />
            <IconButton label="حذف" icon={Trash2} tone="danger" onClick={() => remove(row)} />
          </>
        )}
      />

      <Pagination page={articles.page} pages={articles.pages} total={articles.total} perPage={articles.perPage} />
    </>
  );
};
