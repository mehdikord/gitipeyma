import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogFilters, BlogIndex } from '../../../components/blog/BlogIndex';
import { getBlogCategories, getBlogFilterNames, getBlogListing, getBlogTags, getFeaturedArticle } from '../../../modules/site/articles';
import { getI18n, pageMetadata } from '../../../i18n/metadata';
import { currentLocale } from '../../../i18n/server';
import { localePath } from '../../../i18n/config';
import { JsonLd } from '../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../components/seo/breadcrumbs';
import { absoluteUrl, siteUrl } from '../../../lib/seo';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
const positive = (value: string) => (/^\d+$/.test(value) && Number(value) > 0 ? Number(value) : null);

async function readFilters(searchParams: Props['searchParams']): Promise<BlogFilters & { page: number }> {
  const params = await searchParams;
  return { page: positive(first(params.page)) ?? 1, category: positive(first(params.category)), tag: positive(first(params.tag)), q: first(params.q).slice(0, 100) };
}

/** The part of the address that makes this list its own page: category, tag and page, never the search. */
const canonicalQuery = ({ category, tag, page }: { category: number | null; tag: number | null; page: number }) => {
  const params = new URLSearchParams();
  if (category) params.set('category', String(category));
  if (tag) params.set('tag', String(tag));
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `?${query}` : '';
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [filters, { t, fill, num }] = await Promise.all([readFilters(searchParams), getI18n()]);
  const names = await getBlogFilterNames(filters.category, filters.tag);
  const parts = [names.category, names.tag ? `#${names.tag}` : null].filter(Boolean);
  let title = parts.length ? `${t.blog.meta.title}: ${parts.join(' · ')}` : t.blog.meta.title;
  if (filters.page > 1) title += ` – ${fill(t.blog.list.pageTitle, { page: num(filters.page) })}`;
  if (filters.q) title = fill(t.blog.list.resultsFor, { query: filters.q });
  return pageMetadata('/blog', title, t.blog.meta.description, {
    query: canonicalQuery(filters),
    feed: true,
    // Search results are for visitors, not for the index; the links on them are still followed
    robots: filters.q ? { index: false, follow: true } : undefined,
  });
}

export default async function Page({ searchParams }: Props) {
  const filters = await readFilters(searchParams);
  const filtered = Boolean(filters.category || filters.tag || filters.q);
  const featured = filtered ? null : await getFeaturedArticle();
  const [listing, categories, tags, filterNames, { t }, locale, base] = await Promise.all([
    getBlogListing(filters.page, filters.category, filters.tag, filters.q, featured?.id ?? null),
    getBlogCategories(),
    getBlogTags(),
    getBlogFilterNames(filters.category, filters.tag),
    getI18n(),
    currentLocale(),
    siteUrl(),
  ]);
  // A page past the end does not exist (rather than quietly showing the last one under another address)
  if (filters.page > listing.pages) notFound();
  const showFeatured = featured && listing.page === 1 ? featured : null;
  const articles = [...(showFeatured ? [showFeatured] : []), ...listing.articles];

  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${absoluteUrl(base, localePath(locale, '/blog'))}#blog`,
    name: t.blog.meta.title,
    description: t.blog.meta.description,
    url: absoluteUrl(base, localePath(locale, '/blog')),
    inLanguage: locale,
    publisher: { '@id': `${base}/#organization` },
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: absoluteUrl(base, localePath(locale, `/blog/${article.slug}`)),
      datePublished: article.publishedAt,
      image: article.image ? absoluteUrl(base, article.image) : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={[await breadcrumbs([[t.common.meta.blog, '/blog']]), blog]} />
      <BlogIndex listing={listing} featured={showFeatured} categories={categories} tags={tags} filters={filters} filterNames={filterNames} />
    </>
  );
}
