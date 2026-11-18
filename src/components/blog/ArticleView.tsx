import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, Hash, Languages, PhoneCall } from 'lucide-react';
import type { ArticleCardItem, ArticleDetail } from '../../types/blog';
import { getI18n } from '../../i18n/server';
import { LOCALE_INFO } from '../../i18n/config';
import { ArticleCard, ArticleImage, ArticleMeta, formatArticleDate } from './ArticleCard';
import { ArticleViewTracker, ReadingProgress, ShareButtons, TableOfContents } from './ArticleInteractive';
import { blogHref } from './BlogIndex';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

type Props = { article: ArticleDetail; related: ArticleCardItem[]; popular: ArticleCardItem[]; url: string };

export async function ArticleView({ article, related, popular, url }: Props) {
  const { t: { blog: t }, path, locale, intl, fill } = await getI18n();
  const contentDir = LOCALE_INFO[article.contentLocale].dir;
  const shareLabels = { share: t.detail.share, copy: t.detail.copyLink, copied: t.detail.copied };
  const updated = new Date(article.updatedAt).getTime() - new Date(article.publishedAt).getTime() > 24 * 3600 * 1000;

  return (
    <main className="bg-canvas text-ink">
      <ArticleViewTracker id={article.id} />
      <ReadingProgress targetId="article-body" label={t.detail.progress} />

      <article>
        {/* Title, standfirst and details */}
        <header className="relative overflow-hidden bg-gradient-to-b from-canvas-deep to-canvas">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 start-1/4 h-80 w-80 rounded-full bg-brand/10 blur-[140px]" />
          <div className="relative mx-auto max-w-4xl px-4 pt-10 pb-10 text-center sm:px-6 sm:pt-14">
            <nav aria-label={t.detail.breadcrumb} className="flex flex-wrap items-center justify-center gap-1 text-[13px] text-ink-muted">
              <Link href={path('/')} className={`rounded py-1 transition-colors hover:text-ink-strong ${FOCUS}`}>
                {t.detail.home}
              </Link>
              <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5 ltr:rotate-180" />
              <Link href={path('/blog')} className={`rounded py-1 transition-colors hover:text-ink-strong ${FOCUS}`}>
                {t.detail.blog}
              </Link>
              <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5 ltr:rotate-180" />
              <Link href={blogHref(path, { category: article.category.id })} className={`rounded py-1 transition-colors hover:text-ink-strong ${FOCUS}`}>
                {article.category.name}
              </Link>
            </nav>

            <Link
              href={blogHref(path, { category: article.category.id })}
              className={`mt-6 inline-flex rounded-full border border-gold-deep-line/30 bg-gold-deep/15 px-3.5 py-1 text-xs font-bold text-gold hover:border-gold-line ${FOCUS}`}
            >
              {article.category.name}
            </Link>
            <h1 dir="auto" className="mt-5 text-[1.85rem] sm:text-4xl lg:text-[2.75rem] font-black leading-[1.4] text-ink [text-wrap:balance]">{article.title}</h1>
            {article.excerpt && <p dir="auto" className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-[1.95] text-ink-soft">{article.excerpt}</p>}
            <ArticleMeta article={article} views className="mt-6 justify-center text-[13px]" />
            {updated && <p className="mt-2 text-xs text-ink-dim">{fill(t.detail.updated, { date: formatArticleDate(article.updatedAt, locale, intl) })}</p>}
          </div>

          {/* The cover, as wide as the page allows */}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-ink/10 shadow-2xl shadow-black/20 sm:aspect-[21/9]">
              <ArticleImage src={article.image} alt={article.title} eager />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <div className="min-w-0 lg:col-span-8">
            {article.contentLocale !== locale && (
              <p className="mb-8 flex items-start gap-2 rounded-2xl border border-gold-deep-line/30 bg-gold-deep/10 px-4 py-3 text-sm leading-7 text-ink-soft">
                <Languages aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-gold" />
                {t.detail.translated}
              </p>
            )}

            {article.toc.length > 1 && (
              <div className="mb-10 lg:hidden">
                <TableOfContents items={article.toc} title={t.detail.toc} collapsible dir={contentDir} lang={article.contentLocale} />
              </div>
            )}

            {/* The body: HTML from the panel's editor, cleaned on save and again in prepareArticleHtml */}
            <div
              id="article-body"
              dir={contentDir}
              lang={article.contentLocale}
              className="article-prose article-body"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            {article.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-8">
                <span className="me-1 text-sm font-black text-ink">{t.detail.tags}</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={blogHref(path, { tag: tag.id })}
                    rel="tag"
                    className={`inline-flex items-center gap-1 rounded-full border border-gold-deep-line/30 px-3.5 py-1.5 text-xs font-bold text-gold transition-colors hover:bg-gold-deep/10 ${FOCUS}`}
                  >
                    <Hash aria-hidden="true" className="h-3 w-3" />
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 border-t border-ink/10 pt-8">
              <ShareButtons url={url} title={article.title} labels={shareLabels} />
            </div>

            {/* The way from reading to asking */}
            <aside className="relative mt-12 overflow-hidden rounded-3xl border border-brand/25 bg-gradient-to-br from-surface via-surface to-surface-2 p-7 sm:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/emblem-gold.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-6 end-4 h-36 w-auto opacity-10" />
              <h2 className="relative text-xl sm:text-2xl font-black text-ink">{t.detail.ctaTitle}</h2>
              <p className="relative mt-3 max-w-xl text-[15px] leading-8 text-ink-muted">{t.detail.ctaText}</p>
              <Link
                href={path('/consultation')}
                className={`relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-deep-fill via-gold-fill to-gold-deep-fill px-6 py-3 text-sm font-bold text-on-accent shadow-lg shadow-gold-deep-fill/20 transition-transform hover:scale-[1.02] ${FOCUS}`}
              >
                <PhoneCall aria-hidden="true" className="h-4 w-4" />
                {t.detail.ctaButton}
              </Link>
            </aside>
          </div>

          {/* Beside the text on wide screens: contents, sharing and the most read */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-8">
              {article.toc.length > 1 && (
                <div className="rounded-2xl border border-ink/10 bg-surface/60 p-5">
                  <TableOfContents items={article.toc} title={t.detail.toc} dir={contentDir} lang={article.contentLocale} />
                </div>
              )}
              <div className="rounded-2xl border border-ink/10 bg-surface/60 p-5">
                <ShareButtons url={url} title={article.title} labels={shareLabels} />
              </div>
              {popular.length > 0 && (
                <div>
                  <p className="mb-4 text-sm font-black text-ink">{t.detail.popular}</p>
                  <ul className="space-y-5">
                    {popular.map((item) => (
                      <li key={item.id}>
                        <ArticleCard article={item} variant="compact" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-articles" className="border-t border-ink/5 bg-canvas-deep py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-articles" className="text-2xl sm:text-3xl font-black text-ink">
                {t.detail.related}
              </h2>
              <Link href={path('/blog')} className={`group inline-flex items-center gap-1.5 rounded text-sm font-bold text-brand hover:text-brand-bright ${FOCUS}`}>
                {t.detail.back}
                <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ArticleCard article={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
