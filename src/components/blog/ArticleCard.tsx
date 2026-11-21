/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Clock3, Eye, Sparkles } from 'lucide-react';
import type { ArticleCardItem } from '../../types/blog';
import { getI18n } from '../../i18n/server';
import type { Locale } from '../../i18n/config';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

/** A date as readers there write it: the Persian calendar on the Persian site. */
export const formatArticleDate = (iso: string, locale: Locale, intl: string) =>
  new Date(iso).toLocaleDateString(intl, { year: 'numeric', month: 'long', day: 'numeric', timeZone: locale === 'fa' ? 'Asia/Tehran' : 'Europe/Istanbul' });

/** The article's picture, or the brand's lamassu on the page colors when it has none. */
export const ArticleImage: React.FC<{ src: string | null; alt: string; className?: string; eager?: boolean }> = ({ src, alt, className = '', eager }) =>
  src ? (
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : undefined} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div role="img" aria-label={alt} className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface-2 via-surface to-canvas-deep ${className}`}>
      <div aria-hidden="true" className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-brand/15 blur-3xl" />
      <img src="/brand/emblem-gold-lg.webp" alt="" aria-hidden="true" className="relative h-3/5 w-auto opacity-25" />
    </div>
  );

/** Date, reading time and (optionally) views on one line. */
export async function ArticleMeta({ article, views = false, className = '' }: { article: ArticleCardItem; views?: boolean; className?: string }) {
  const { t, locale, intl, num, fill } = await getI18n();
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-dim ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt, locale, intl)}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
        {fill(t.blog.card.minutes, { count: num(article.readingMinutes) })}
      </span>
      {views && (
        <span className="inline-flex items-center gap-1.5">
          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
          {fill(t.blog.card.views, { count: num(article.views) })}
        </span>
      )}
    </div>
  );
}

type Variant = 'grid' | 'featured' | 'compact';

/**
 * An article in a list. The title is the link and stretches over the whole card; the category above
 * it is its own link to that category's list.
 */
export async function ArticleCard({
  article,
  variant = 'grid',
  headingLevel = 3,
  eager,
  large,
}: {
  article: ArticleCardItem;
  variant?: Variant;
  headingLevel?: 2 | 3;
  eager?: boolean;
  // compact only: a bigger picture and title, beside a large card
  large?: boolean;
}) {
  const { t, path } = await getI18n();
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const href = path(`/blog/${article.slug}`);
  const categoryHref = path(`/blog?category=${article.category.id}`);

  if (variant === 'compact') {
    return (
      <article className="group relative flex items-center gap-4 rounded-2xl p-2 -m-2 transition-colors hover:bg-surface/70">
        <div className={`relative shrink-0 overflow-hidden rounded-xl border border-ink/10 ${large ? 'h-24 w-28 sm:h-32 sm:w-44' : 'h-20 w-24 sm:h-24 sm:w-32'}`}>
          <ArticleImage src={article.image} alt="" className="transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-gold">{article.category.name}</p>
          <Heading dir="auto" className={`mt-1 font-bold text-ink line-clamp-2 transition-colors group-hover:text-gold ${large ? 'text-base sm:text-lg leading-8' : 'text-[15px] leading-7'}`}>
            <Link href={href} className={`rounded after:absolute after:inset-0 after:content-[''] ${FOCUS}`}>
              {article.title}
            </Link>
          </Heading>
          <ArticleMeta article={article} className="mt-1.5" />
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group relative grid overflow-hidden rounded-3xl border border-gold-line/25 bg-surface shadow-2xl shadow-black/10 md:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[380px]">
          <ArticleImage src={article.image} alt={article.title} eager={eager} className="transition-transform duration-700 group-hover:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-none" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-fill px-3 py-1 text-[11px] font-black text-on-accent">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              {t.blog.list.featured}
            </span>
            <Link href={categoryHref} className={`relative z-10 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand hover:border-brand ${FOCUS}`}>
              {article.category.name}
            </Link>
          </div>
          <Heading dir="auto" className="mt-5 text-2xl sm:text-3xl font-black leading-[1.45] text-ink [text-wrap:balance] transition-colors group-hover:text-gold">
            <Link href={href} className={`rounded after:absolute after:inset-0 after:content-[''] ${FOCUS}`}>
              {article.title}
            </Link>
          </Heading>
          <p dir="auto" className="mt-4 text-[15px] leading-8 text-ink-muted line-clamp-3">{article.excerpt}</p>
          <ArticleMeta article={article} views className="mt-6" />
          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-fill px-5 py-2.5 text-sm font-bold text-on-brand transition-colors group-hover:bg-brand-bright-fill">
            {t.blog.card.read}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-gold-line/40 hover:shadow-2xl hover:shadow-black/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ArticleImage src={article.image} alt={article.title} eager={eager} className="transition-transform duration-700 group-hover:scale-105" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Link
          href={categoryHref}
          className={`absolute bottom-3 start-3 z-10 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/75 ${FOCUS}`}
        >
          {article.category.name}
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ArticleMeta article={article} />
        <Heading dir="auto" className="mt-3 text-lg font-bold leading-8 text-ink line-clamp-2 transition-colors group-hover:text-gold">
          <Link href={href} className={`rounded after:absolute after:inset-0 after:content-[''] ${FOCUS}`}>
            {article.title}
          </Link>
        </Heading>
        <p dir="auto" className="mt-2 text-sm leading-7 text-ink-muted line-clamp-3">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs font-bold text-brand">
          <span>{t.blog.card.read}</span>
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 transition-colors group-hover:bg-brand-fill group-hover:text-on-brand">
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </span>
        </div>
      </div>
    </article>
  );
}
