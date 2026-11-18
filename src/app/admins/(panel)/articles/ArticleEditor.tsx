'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarClock, Copy, Eye, FileText, FolderOpen, Globe, ImageIcon, Save, Search, Send, Star, Tags, Undo2 } from 'lucide-react';
import type { ArticleForEdit } from '../../../../modules/articles/queries';
import { saveArticle } from '../../../../modules/articles/actions';
import { createQuickTag } from '../../../../modules/tags/actions';
import { Badge } from '../../../../components/admin/ui/Badge';
import { Button, ButtonLink } from '../../../../components/admin/ui/Button';
import { FormAlert, Option, Select, Switch, TextInput } from '../../../../components/admin/ui/fields';
import { ImageField } from '../../../../components/admin/ui/ImageField';
import { RichTextEditor } from '../../../../components/admin/ui/RichTextEditor';
import { TagPicker } from '../../../../components/admin/ui/TagPicker';
import { useForm } from '../../../../components/admin/ui/useForm';
import { LanguageTabs, TranslatedInput, TranslationProvider, TransTextArea, TransTextInput, useEditingLocale } from '../../../../components/admin/ui/translations';
import { CARD } from '../../../../components/admin/ui/styles';
import { LOCALE_INFO, SOURCE_LOCALE } from '../../../../i18n/config';
import { emptyTranslated, toInputs } from '../../../../i18n/translated';

type Values = {
  title: TranslatedInput;
  slug: string;
  articleCategoryId: string;
  excerpt: TranslatedInput;
  content: TranslatedInput;
  image: string;
  metaTitle: TranslatedInput;
  metaDescription: TranslatedInput;
  status: 'draft' | 'published';
  isFeatured: boolean;
  // A datetime-local value in the admin's own clock
  publishedAt: string;
  tagIds: string[];
};

const STATE = {
  draft: { label: 'پیش‌نویس', tone: 'gray' },
  published: { label: 'منتشر شده', tone: 'green' },
  scheduled: { label: 'زمان‌بندی‌شده', tone: 'blue' },
} as const;

const pad = (n: number) => String(n).padStart(2, '0');
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const persianDate = (value: string | Date) =>
  new Date(value).toLocaleString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const fa = (n: number) => n.toLocaleString('fa-IR');

const valuesOf = (article: ArticleForEdit | null): Values => ({
  title: article ? toInputs(article.title) : emptyTranslated(),
  slug: article?.slug ?? '',
  articleCategoryId: article ? String(article.articleCategoryId) : '',
  excerpt: article ? toInputs(article.excerpt) : emptyTranslated(),
  content: article ? toInputs(article.content) : emptyTranslated(),
  image: article?.image ?? '',
  metaTitle: article ? toInputs(article.metaTitle) : emptyTranslated(),
  metaDescription: article ? toInputs(article.metaDescription) : emptyTranslated(),
  status: article?.status ?? 'draft',
  isFeatured: article?.isFeatured ?? false,
  publishedAt: toLocalInput(article?.publishedAt ?? null),
  tagIds: article?.tagIds.map(String) ?? [],
});

const Card: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, icon: Icon, children, actions }) => (
  <section className={`${CARD} p-4 sm:p-5`}>
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-sm font-black text-[#0B5F5B]">
        <Icon className="h-4 w-4" />
        {title}
      </h2>
      {actions}
    </div>
    {children}
  </section>
);

/** The body in the language picked at the top; a translation can start from a copy of the Persian body. */
const TransRichText: React.FC<{ value: TranslatedInput; onChange: (value: TranslatedInput) => void; error?: string }> = ({ value, onChange, error }) => {
  const { locale } = useEditingLocale();
  const source = value[SOURCE_LOCALE];
  const canCopy = locale !== SOURCE_LOCALE && !value[locale].trim() && source.trim();
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#14282D]">
          متن مقاله
          <span dir="ltr" className="rounded bg-[#E6F4F3] px-1.5 py-px text-[10px] font-black text-[#0B5F5B]">
            {LOCALE_INFO[locale].short}
          </span>
        </span>
        {canCopy && (
          <Button variant="secondary" size="sm" icon={Copy} onClick={() => onChange({ ...value, [locale]: source })}>
            شروع ترجمه از روی متن فارسی
          </Button>
        )}
      </div>
      {/* A fresh editor per language, so undo history and direction belong to that language */}
      <RichTextEditor
        key={locale}
        value={value[locale]}
        onChange={(html) => onChange({ ...value, [locale]: html })}
        dir={LOCALE_INFO[locale].dir}
        lang={locale}
        invalid={Boolean(error)}
        placeholder={locale === SOURCE_LOCALE ? 'متن مقاله را اینجا بنویسید...' : `ترجمه ${LOCALE_INFO[locale].adminName} متن مقاله...`}
      />
      {error && <p className="mt-1.5 text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
};

const textOf = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** How the article will look in Google, in the language being edited. */
const SnippetPreview: React.FC<{ values: Values; siteName: string }> = ({ values, siteName }) => {
  const { locale } = useEditingLocale();
  const title = values.metaTitle[locale] || values.title[locale] || values.title[SOURCE_LOCALE];
  const description = values.metaDescription[locale] || values.excerpt[locale] || textOf(values.content[locale]).slice(0, 160);
  const fullTitle = title ? `${title} | ${siteName}` : '';
  const dir = LOCALE_INFO[locale].dir;
  return (
    <div className="rounded-lg border border-[#E3E8EA] bg-[#FAFBFB] p-4">
      <p className="mb-2 text-[11px] font-bold text-[#94A3A8]">پیش‌نمایش در نتایج گوگل ({LOCALE_INFO[locale].adminName})</p>
      <div dir={dir} lang={locale} className="font-[Arial,sans-serif]">
        <p dir="ltr" className={`truncate text-xs text-[#3F5257] ${dir === 'rtl' ? 'text-right' : ''}`}>
          …/{locale}/blog/{values.slug || '…'}
        </p>
        <p className="mt-0.5 truncate text-lg leading-snug text-[#1A0DAB]">{fullTitle || 'عنوان مقاله'}</p>
        <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-[#4D5156]">{description || 'خلاصه یا توضیح سئو اینجا نمایش داده می‌شود.'}</p>
      </div>
      <p className="mt-3 text-[11px] text-[#5F7177]">
        عنوان: {fa(fullTitle.length)} کاراکتر (بهتر است زیر ۶۰) · توضیح: {fa(description.length)} کاراکتر (بهتر است ۷۰ تا ۱۶۰)
      </p>
    </div>
  );
};

export const ArticleEditor: React.FC<{ article: ArticleForEdit | null; categories: Option[]; tags: Option[] }> = ({ article, categories, tags }) => {
  const router = useRouter();
  const form = useForm<Values>(valuesOf(article));
  const { values, set, errors } = form;
  const saved = useRef(JSON.stringify(valuesOf(article)));
  const [, rerender] = useState(0);
  const dirty = JSON.stringify(values) !== saved.current;
  const isLive = article?.state === 'published' || article?.state === 'scheduled';

  // Leaving with unsaved changes asks first
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = (status: Values['status']) => {
    const payload = {
      ...values,
      status,
      publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
      tagIds: values.tagIds.map(Number),
    };
    form.submit(() => saveArticle(article?.id ?? null, payload), {
      onSuccess: (result) => {
        const next = { ...values, status };
        set('status', status);
        saved.current = JSON.stringify(next);
        rerender((n) => n + 1);
        const data = result.data as { id: number; slug: string } | undefined;
        if (!article && data) router.replace(`/admins/articles/${data.id}/edit`);
        else router.refresh();
      },
    });
  };

  // Ctrl+S saves without changing whether the article is out
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveRef.current(values.status);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [values.status]);

  const state = article ? STATE[article.state] : null;
  const future = values.publishedAt && new Date(values.publishedAt) > new Date();

  return (
    <TranslationProvider>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          save(isLive ? 'published' : values.status);
        }}
      >
        {/* Header: where we are and the save buttons, always in reach */}
        <div className="sticky top-16 z-10 -mx-4 mb-5 border-b border-[#E3E8EA] bg-[#F4F6F7]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Link href="/admins/articles" className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-[#5F7177] hover:text-[#0B7A75]">
                <ArrowRight className="h-3.5 w-3.5" />
                همه مقالات
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-black text-[#14282D]">{article ? 'ویرایش مقاله' : 'افزودن مقاله'}</h1>
                {state && <Badge tone={state.tone}>{state.label}</Badge>}
                {dirty && <Badge tone="amber">تغییرات ذخیره‌نشده</Badge>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {article?.state === 'published' && (
                <ButtonLink href={`/fa/blog/${article.slug}`} icon={Eye} className="!h-10">
                  <span className="sr-only sm:not-sr-only">مشاهده در سایت</span>
                </ButtonLink>
              )}
              {isLive ? (
                <>
                  <Button variant="secondary" icon={Undo2} disabled={form.pending} onClick={() => save('draft')}>
                    برگرداندن به پیش‌نویس
                  </Button>
                  <Button type="submit" icon={Save} loading={form.pending}>
                    ذخیره تغییرات
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" icon={Save} disabled={form.pending} onClick={() => save('draft')}>
                    ذخیره پیش‌نویس
                  </Button>
                  <Button icon={future ? CalendarClock : Send} loading={form.pending} onClick={() => save('published')}>
                    {future ? 'زمان‌بندی انتشار' : 'انتشار'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <FormAlert message={form.formError} />

        <div className={`${CARD} mb-5 overflow-hidden`}>
          <LanguageTabs values={values} errors={errors} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Main column: the article itself */}
          <div className="space-y-5 lg:col-span-8">
            <Card title="محتوای مقاله" icon={FileText}>
              <div className="space-y-4">
                <TransTextInput label="عنوان مقاله" required name="title" value={values.title} onChange={(v) => set('title', v)} errors={errors} />
                <TextInput
                  label="نامک (آدرس صفحه)"
                  ltr
                  value={values.slug}
                  onChange={(v) => set('slug', v)}
                  error={errors.slug}
                  placeholder="istanbul-residency-guide"
                  hint={
                    <span dir="ltr" className="inline-block">
                      /fa/blog/{values.slug || <span className="text-[#94A3A8]">auto</span>}
                      <span dir="rtl" className="mr-2 text-[#94A3A8]">
                        — برای همه زبان‌ها یکی است. خالی بماند، از عنوان انگلیسی ساخته می‌شود (بدون عنوان انگلیسی: article-شماره).
                      </span>
                    </span>
                  }
                />
                <TransTextArea
                  label="خلاصه مقاله"
                  name="excerpt"
                  rows={3}
                  hint={`روی کارت مقاله و زیر عنوان نمایش داده می‌شود. ${fa(values.excerpt[SOURCE_LOCALE].length)} کاراکتر.`}
                  value={values.excerpt}
                  onChange={(v) => set('excerpt', v)}
                  errors={errors}
                />
                <TransRichText value={values.content} onChange={(v) => set('content', v)} error={errors.content} />
              </div>
            </Card>

            <Card title="سئو و اشتراک‌گذاری" icon={Search}>
              <div className="space-y-4">
                <TransTextInput label="عنوان سئو (اختیاری)" name="metaTitle" hint="خالی بماند، عنوان مقاله استفاده می‌شود." value={values.metaTitle} onChange={(v) => set('metaTitle', v)} errors={errors} />
                <TransTextArea
                  label="توضیح سئو (اختیاری)"
                  name="metaDescription"
                  rows={2}
                  hint="خالی بماند، خلاصه مقاله استفاده می‌شود."
                  value={values.metaDescription}
                  onChange={(v) => set('metaDescription', v)}
                  errors={errors}
                />
                <SnippetPreview values={values} siteName="رویال تراول" />
              </div>
            </Card>
          </div>

          {/* Sidebar: publishing and how the article is filed */}
          <aside className="space-y-5 lg:col-span-4">
            <Card title="انتشار" icon={Globe}>
              <div className="space-y-4">
                <TextInput
                  label="زمان انتشار"
                  type="datetime-local"
                  ltr
                  value={values.publishedAt}
                  onChange={(v) => set('publishedAt', v)}
                  error={errors.publishedAt}
                  hint={
                    values.publishedAt
                      ? `${persianDate(values.publishedAt)}${future ? ' — تا آن زمان در سایت دیده نمی‌شود.' : ''}`
                      : 'خالی بماند، هنگام انتشار زمان همان لحظه ثبت می‌شود. زمانی در آینده، مقاله را خودکار در همان زمان منتشر می‌کند.'
                  }
                />
                <Switch label="مقاله ویژه" hint="در بالای صفحه مقالات، بزرگ‌تر نمایش داده می‌شود." checked={values.isFeatured} onChange={(v) => set('isFeatured', v)} />
                {article && (
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-[#F4F6F7] p-3 text-xs">
                    <dt className="text-[#5F7177]">بازدید</dt>
                    <dd className="font-bold">{fa(article.views)}</dd>
                    <dt className="text-[#5F7177]">نویسنده</dt>
                    <dd className="font-bold">{article.authorName ?? '—'}</dd>
                    <dt className="text-[#5F7177]">ایجاد</dt>
                    <dd className="font-bold">{persianDate(article.createdAt)}</dd>
                    <dt className="text-[#5F7177]">آخرین ویرایش</dt>
                    <dd className="font-bold">{persianDate(article.updatedAt)}</dd>
                  </dl>
                )}
                <p className="text-[11px] leading-relaxed text-[#94A3A8]">میان‌بر ذخیره: Ctrl + S</p>
              </div>
            </Card>

            <Card
              title="دسته‌بندی"
              icon={FolderOpen}
              actions={
                <Link href="/admins/article-categories" className="text-xs font-bold text-[#0B7A75] hover:underline">
                  مدیریت دسته‌ها
                </Link>
              }
            >
              {categories.length === 0 ? (
                <p className="rounded-lg bg-[#FEF3C7] p-3 text-xs leading-relaxed text-[#92400E]">
                  هنوز دسته‌ای ساخته نشده است. ابتدا از «دسته‌بندی مقالات» یک دسته بسازید.
                </p>
              ) : (
                <Select label="دسته مقاله" required placeholder="انتخاب کنید" value={values.articleCategoryId} onChange={(v) => set('articleCategoryId', v)} options={categories} error={errors.articleCategoryId} />
              )}
            </Card>

            <Card title="برچسب‌ها" icon={Tags}>
              <TagPicker label="برچسب‌های مقاله" options={tags} values={values.tagIds} onChange={(v) => set('tagIds', v)} onCreate={createQuickTag} error={errors.tagIds} />
            </Card>

            <Card title="تصویر شاخص" icon={ImageIcon}>
              <ImageField label="تصویر اصلی مقاله" folder="articles" value={values.image} onChange={(v) => set('image', v)} error={errors.image} hint="بالای مقاله، روی کارت‌ها و هنگام اشتراک‌گذاری. ابعاد پیشنهادی ۱۶۰۰×۹۰۰." />
              {values.isFeatured && !values.image && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#92400E]">
                  <Star className="h-3.5 w-3.5" />
                  مقاله ویژه بدون تصویر جلوه کمتری دارد.
                </p>
              )}
            </Card>
          </aside>
        </div>
      </form>
    </TranslationProvider>
  );
};
