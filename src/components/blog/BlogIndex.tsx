import React from 'react';
import Link from 'next/link';
import { BookOpenText, ChevronLeft, ChevronRight, Hash, Search, X } from 'lucide-react';
import type { ArticleCardItem, BlogFilterItem, BlogListing } from '../../types/blog';
import { getI18n } from '../../i18n/server';
import { ArticleCard } from './ArticleCard';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

export type BlogFilters = { category: number | null; tag: number | null; q: string };

type Props = {
  listing: BlogListing;
  featured: ArticleCardItem | null;
  categories: BlogFilterItem[];
  tags: BlogFilterItem[];
  filters: BlogFilters;
  filterNames: { category: string | null; tag: string | null };
};

/** The /blog address for a set of filters and a page; page 1 and empty filters stay out of it. */
export const blogHref = (path: (to: string) => string, filters: Partial<BlogFilters>, page = 1) => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', String(filters.category));
  if (filters.tag) params.set('tag', String(filters.tag));
  if (filters.q) params.set('q', filters.q);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return path('/blog') + (query ? `?${query}` : '');
};

export async function BlogIndex({ listing, featured, categories, tags, filters, filterNames }: Props) {
  const { t: { blog: t }, path, num, fill } = await getI18n();
  const filtered = Boolean(filters.category || filters.tag || filters.q);
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  const chip = (active: boolean) =>
    `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${FOCUS} ${
      active ? 'bg-brand-fill text-on-accent shadow-lg shadow-brand/20' : 'border border-ink/10 bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink-strong'
    }`;
  const count = (value: number, active: boolean) => <span className={`rounded-full px-1.5 text-[10px] ${active ? 'bg-black/15' : 'bg-ink/10'}`}>{num(value)}</span>;

  // The current page with two on each side, plus the first and the last
  const pageNumbers = Array.from(new Set([1, ...Array.from({ length: 5 }, (_, i) => listing.page - 2 + i), listing.pages])).filter((n) => n >= 1 && n <= listing.pages);

  return (
    <main className="min-h-screen bg-canvas pb-24 text-ink">
      {/* Hero with the search */}
      <header className="relative overflow-hidden border-b border-ink/5 bg-gradient-to-b from-canvas-deep to-canvas py-16 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute top-0 start-1/3 h-96 w-96 rounded-full bg-brand/10 blur-[140px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/emblem-gold-lg.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-24 -end-10 hidden h-[420px] w-auto opacity-[0.06] md:block" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-deep-line/30 bg-gold-deep/15 px-3.5 py-1 text-xs font-bold text-gold">
            <BookOpenText aria-hidden="true" className="h-3.5 w-3.5" />
            {t.list.eyebrow}
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black leading-tight tracking-tight text-ink [text-wrap:balance]">{t.list.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-8 text-ink-muted">{t.list.intro}</p>

          {/* A plain GET form: searching works without JavaScript and every result has an address */}
          <form action={path('/blog')} method="get" role="search" className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-full border border-brand/30 bg-surface p-1.5 ps-4 shadow-xl shadow-black/5 focus-within:border-gold-line">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-dim" />
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            {filters.tag && <input type="hidden" name="tag" value={filters.tag} />}
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder={t.list.searchPlaceholder}
              aria-label={t.list.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink-strong placeholder:text-ink-dim focus:outline-none"
            />
            <button type="submit" className={`shrink-0 rounded-full bg-brand-fill px-5 py-2 text-xs font-bold text-on-accent hover:bg-brand-bright-fill ${FOCUS}`}>
              {t.list.search}
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        {categories.length > 0 && (
          <nav aria-label={t.list.all} className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-8 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <Link href={blogHref(path, { tag: filters.tag, q: filters.q })} aria-current={!filters.category ? 'page' : undefined} className={chip(!filters.category)}>
              {t.list.all}
              {count(total, !filters.category)}
            </Link>
            {categories.map((category) => {
              const active = filters.category === category.id;
              return (
                <Link key={category.id} href={blogHref(path, { category: category.id, tag: filters.tag, q: filters.q })} aria-current={active ? 'page' : undefined} className={chip(active)}>
                  {category.name}
                  {count(category.count, active)}
                </Link>
              );
            })}
          </nav>
        )}

        {/* What the list is narrowed to */}
        {filtered && (
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-ink/10 bg-surface/60 px-4 py-3 text-sm">
            <span className="font-bold text-ink">{fill(t.list.count, { count: num(listing.total) })}</span>
            {filters.q && <span className="text-ink-muted">· {fill(t.list.resultsFor, { query: filters.q })}</span>}
            {filterNames.category && <span className="text-ink-muted">· {fill(t.list.inCategory, { name: filterNames.category })}</span>}
            {filterNames.tag && <span className="text-ink-muted">· {fill(t.list.withTag, { name: filterNames.tag })}</span>}
            <Link href={path('/blog')} className={`ms-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-gold hover:bg-gold-deep/10 ${FOCUS}`}>
              <X aria-hidden="true" className="h-3.5 w-3.5" />
              {t.list.clear}
            </Link>
          </div>
        )}

        {featured && (
          <div className="mt-10">
            <ArticleCard article={featured} variant="featured" headingLevel={2} eager />
          </div>
        )}

        {listing.articles.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listing.articles.map((article, index) => (
              <li key={article.id}>
                <ArticleCard article={article} headingLevel={2} eager={!featured && index < 3} />
              </li>
            ))}
          </ul>
        ) : (
          !featured && (
            <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-ink/10 bg-surface px-6 py-16 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/emblem-gold.webp" alt="" aria-hidden="true" className="h-16 w-auto opacity-60" />
              <p className="max-w-md text-base leading-8 text-ink-muted">{filtered ? t.list.noResults : t.list.empty}</p>
              {filtered && (
                <Link href={path('/blog')} className={`rounded-full bg-brand-fill px-5 py-2 text-xs font-bold text-on-accent ${FOCUS}`}>
                  {t.list.all}
                </Link>
              )}
            </div>
          )
        )}

        {/* Pages, as real links so crawlers reach every article */}
        {listing.pages > 1 && (
          <nav aria-label={t.list.pagination} className="mt-14 flex items-center justify-center gap-1.5">
            {listing.page > 1 && (
              <Link href={blogHref(path, filters, listing.page - 1)} rel="prev" className={`inline-flex h-10 items-center gap-1 rounded-full border border-ink/10 bg-surface px-4 text-xs font-bold text-ink hover:border-brand ${FOCUS}`}>
                <ChevronRight aria-hidden="true" className="h-4 w-4 ltr:rotate-180" />
                {t.list.previous}
              </Link>
            )}
            {pageNumbers.map((n, index) => (
              <React.Fragment key={n}>
                {index > 0 && n - pageNumbers[index - 1] > 1 && <span className="px-1 text-ink-dim">…</span>}
                <Link
                  href={blogHref(path, filters, n)}
                  aria-current={n === listing.page ? 'page' : undefined}
                  aria-label={fill(t.list.pageTitle, { page: num(n) })}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold ${FOCUS} ${
                    n === listing.page ? 'bg-brand-fill text-on-accent' : 'border border-ink/10 bg-surface text-ink-muted hover:text-ink-strong'
                  }`}
                >
                  {num(n)}
                </Link>
              </React.Fragment>
            ))}
            {listing.page < listing.pages && (
              <Link href={blogHref(path, filters, listing.page + 1)} rel="next" className={`inline-flex h-10 items-center gap-1 rounded-full border border-ink/10 bg-surface px-4 text-xs font-bold text-ink hover:border-brand ${FOCUS}`}>
                {t.list.next}
                <ChevronLeft aria-hidden="true" className="h-4 w-4 ltr:rotate-180" />
              </Link>
            )}
          </nav>
        )}

        {/* Topics */}
        {tags.length > 0 && (
          <section aria-labelledby="blog-topics" className="mt-20 rounded-3xl border border-ink/10 bg-surface/50 p-6 sm:p-8">
            <h2 id="blog-topics" className="text-lg font-black text-ink">
              {t.list.topics}
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = filters.tag === tag.id;
                return (
                  <li key={tag.id}>
                    <Link
                      href={blogHref(path, { tag: active ? null : tag.id })}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${FOCUS} ${
                        active ? 'bg-gold-fill text-on-accent' : 'border border-gold-deep-line/30 text-gold hover:bg-gold-deep/10'
                      }`}
                    >
                      <Hash aria-hidden="true" className="h-3 w-3" />
                      {tag.name}
                      <span className="opacity-60">{num(tag.count)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
