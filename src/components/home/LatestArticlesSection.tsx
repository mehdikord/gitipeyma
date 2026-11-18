import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpenText } from 'lucide-react';
import type { ArticleCardItem } from '../../types/blog';
import { getI18n } from '../../i18n/server';
import { ArticleCard } from '../blog/ArticleCard';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

/** The four newest articles: the latest large, the next three beside it, and the way to the rest. */
export async function LatestArticlesSection({ articles }: { articles: ArticleCardItem[] }) {
  const { t, path } = await getI18n();
  const [lead, ...rest] = articles;
  const viewAll = (
    <Link
      href={path('/blog')}
      className={`group inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-surface px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-brand hover:bg-brand-fill hover:text-on-accent ${FOCUS}`}
    >
      {t.blog.home.viewAll}
      <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
    </Link>
  );

  return (
    <section aria-labelledby="latest-articles-title" className="relative overflow-hidden border-b border-ink/5 bg-canvas-deep py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 start-1/4 h-72 w-72 rounded-full bg-gold-deep/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-deep-line/30 bg-gold-deep/15 px-3 py-1 text-xs font-bold text-gold">
              <BookOpenText aria-hidden="true" className="h-3.5 w-3.5" />
              {t.blog.home.eyebrow}
            </span>
            <h2 id="latest-articles-title" className="mt-4 text-3xl sm:text-4xl font-black leading-tight text-ink">
              {t.blog.home.title}
            </h2>
            <p className="mt-3 text-[15px] leading-8 text-ink-muted">{t.blog.home.intro}</p>
          </div>
          <div className="hidden sm:block">{viewAll}</div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className={rest.length ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <ArticleCard article={lead} />
          </div>
          {rest.length > 0 && (
            <ul className="flex flex-col divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-surface/40 px-5 lg:col-span-5 lg:justify-around">
              {rest.map((article) => (
                <li key={article.id} className="py-5">
                  <ArticleCard article={article} variant="compact" large />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 sm:hidden">{viewAll}</div>
      </div>
    </section>
  );
}
