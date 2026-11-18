/**
 * The blog for the public site: published articles only (published, and their publish time has come),
 * as plain text in the language of the page. Like the rest of src/modules/site, every read renders
 * per request, so what the panel saves shows on the next visit.
 */

import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { db } from '../../lib/db';
import { currentLocale } from '../../i18n/server';
import { asTranslated, pick } from '../../i18n/translated';
import { FALLBACKS, LOCALES, Locale } from '../../i18n/config';
import type { Prisma } from '../../generated/prisma/client';
import { textSearch } from '../../lib/search';
import { htmlToText, prepareArticleHtml, readingMinutes } from '../articles/html';
import type { ArticleCardItem, ArticleDetail, BlogFilterItem, BlogListing } from '../../types/blog';

export const BLOG_PAGE_SIZE = 9;

/** Out on the site: published, and its time has come. */
const live = (): Prisma.ArticleWhereInput => ({ status: 'published', publishedAt: { lte: new Date() } });

const cardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  image: true,
  views: true,
  isFeatured: true,
  publishedAt: true,
  category: { select: { id: true, name: true } },
} satisfies Prisma.ArticleSelect;

type CardRow = Prisma.ArticleGetPayload<{ select: typeof cardSelect }>;

const newestFirst = [{ publishedAt: 'desc' as const }, { id: 'desc' as const }];

/** The excerpt, or the opening words of the body when none was written. */
const excerptOf = (excerpt: unknown, html: string, locale: Locale) => {
  const written = pick(excerpt, locale);
  if (written) return written;
  const text = htmlToText(html);
  return text.length > 180 ? `${text.slice(0, 180).replace(/\s+\S*$/, '')}…` : text;
};

const toCard = (article: CardRow, locale: Locale): ArticleCardItem => {
  const html = pick(article.content, locale);
  return {
    id: Number(article.id),
    slug: article.slug,
    title: pick(article.title, locale),
    excerpt: excerptOf(article.excerpt, html, locale),
    image: article.image,
    category: { id: Number(article.category.id), name: pick(article.category.name, locale) },
    publishedAt: (article.publishedAt ?? new Date()).toISOString(),
    readingMinutes: readingMinutes(html),
    views: article.views,
    isFeatured: article.isFeatured,
  };
};

/** The newest articles, for the home page. */
export const getLatestArticles = cache(async (limit = 4): Promise<ArticleCardItem[]> => {
  await connection();
  const locale = await currentLocale();
  const articles = await db.article.findMany({ where: live(), orderBy: newestFirst, take: limit, select: cardSelect });
  return articles.map((article) => toCard(article, locale));
});

/** One page of /blog, narrowed to a category, a tag or a search. Plain arguments, so cache() can share the result. */
export const getBlogListing = cache(async (page: number, category: number | null, tag: number | null, q: string, excludeId: number | null = null): Promise<BlogListing> => {
  await connection();
  const locale = await currentLocale();
  const where: Prisma.ArticleWhereInput = {
    ...live(),
    // The featured article, already shown large above the list
    id: excludeId ? { not: excludeId } : undefined,
    articleCategoryId: category ?? undefined,
    tags: tag ? { some: { tagId: tag } } : undefined,
    OR: q ? [...textSearch('title', q), ...textSearch('excerpt', q)] : undefined,
  };
  const total = await db.article.count({ where });
  const pages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const articles = await db.article.findMany({ where, orderBy: newestFirst, skip: (current - 1) * BLOG_PAGE_SIZE, take: BLOG_PAGE_SIZE, select: cardSelect });
  return { articles: articles.map((article) => toCard(article, locale)), page: current, pages, total };
});

/** The newest featured article, shown large at the top of the blog. */
export const getFeaturedArticle = cache(async (): Promise<ArticleCardItem | null> => {
  await connection();
  const locale = await currentLocale();
  const article = await db.article.findFirst({ where: { ...live(), isFeatured: true }, orderBy: newestFirst, select: cardSelect });
  return article ? toCard(article, locale) : null;
});

/** Categories with at least one article out, for the filters. */
export const getBlogCategories = cache(async (): Promise<BlogFilterItem[]> => {
  await connection();
  const locale = await currentLocale();
  const categories = await db.articleCategory.findMany({
    where: { articles: { some: live() } },
    orderBy: { id: 'asc' },
    select: { id: true, name: true, _count: { select: { articles: { where: live() } } } },
  });
  return categories.map((category) => ({ id: Number(category.id), name: pick(category.name, locale), count: category._count.articles }));
});

/** The tags most used on articles that are out. */
export const getBlogTags = cache(async (limit = 24): Promise<BlogFilterItem[]> => {
  await connection();
  const locale = await currentLocale();
  const tags = await db.tag.findMany({
    where: { articles: { some: { article: live() } } },
    select: { id: true, name: true, _count: { select: { articles: { where: { article: live() } } } } },
  });
  return tags
    .map((tag) => ({ id: Number(tag.id), name: pick(tag.name, locale), count: tag._count.articles }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
});

/** The names of a category and a tag the list is filtered by, for its heading and title. */
export const getBlogFilterNames = cache(async (category: number | null, tag: number | null) => {
  const locale = await currentLocale();
  const [categoryRow, tagRow] = await Promise.all([
    category ? db.articleCategory.findUnique({ where: { id: category }, select: { name: true } }) : null,
    tag ? db.tag.findUnique({ where: { id: tag }, select: { name: true } }) : null,
  ]);
  return { category: categoryRow ? pick(categoryRow.name, locale) : null, tag: tagRow ? pick(tagRow.name, locale) : null };
});

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleDetail | null> => {
  await connection();
  const locale = await currentLocale();
  const article = await db.article.findFirst({
    where: { slug, ...live() },
    select: {
      ...cardSelect,
      metaTitle: true,
      metaDescription: true,
      updatedAt: true,
      tags: { select: { tag: { select: { id: true, name: true } } }, orderBy: { id: 'asc' } },
    },
  });
  if (!article) return null;

  const bodies = asTranslated(article.content);
  const contentLocale = FALLBACKS[locale].find((candidate) => bodies[candidate]) ?? locale;
  const html = bodies[contentLocale] ?? '';
  const titles = asTranslated(article.title);
  const { html: prepared, toc } = prepareArticleHtml(html);

  return {
    ...toCard(article, locale),
    html: prepared,
    toc,
    contentLocale,
    // Written in a language means it has both a title and a body there
    writtenIn: LOCALES.filter((code) => bodies[code] && titles[code]),
    tags: article.tags.map(({ tag }) => ({ id: Number(tag.id), name: pick(tag.name, locale) })),
    updatedAt: article.updatedAt.toISOString(),
    metaTitle: pick(article.metaTitle, locale) || null,
    metaDescription: pick(article.metaDescription, locale) || null,
    wordCount: htmlToText(html).split(' ').filter(Boolean).length,
  };
});

/** Up to `limit` articles to read next: the same category first, then shared tags, then the newest. */
export const getRelatedArticles = cache(async (article: Pick<ArticleDetail, 'id' | 'category' | 'tags'>, limit = 3): Promise<ArticleCardItem[]> => {
  await connection();
  const locale = await currentLocale();
  const others = { ...live(), id: { not: article.id } };
  const picked: CardRow[] = [];
  const add = (rows: CardRow[]) => rows.forEach((row) => picked.length < limit && !picked.some((p) => p.id === row.id) && picked.push(row));

  add(await db.article.findMany({ where: { ...others, articleCategoryId: article.category.id }, orderBy: newestFirst, take: limit, select: cardSelect }));
  if (picked.length < limit && article.tags.length) {
    add(await db.article.findMany({ where: { ...others, tags: { some: { tagId: { in: article.tags.map((tag) => tag.id) } } } }, orderBy: newestFirst, take: limit, select: cardSelect }));
  }
  if (picked.length < limit) add(await db.article.findMany({ where: others, orderBy: newestFirst, take: limit * 2, select: cardSelect }));
  return picked.map((row) => toCard(row, locale));
});

/** The most read articles, for the article page's sidebar. */
export const getPopularArticles = cache(async (excludeId: number, limit = 4): Promise<ArticleCardItem[]> => {
  await connection();
  const locale = await currentLocale();
  const articles = await db.article.findMany({ where: { ...live(), id: { not: excludeId } }, orderBy: [{ views: 'desc' }, ...newestFirst], take: limit, select: cardSelect });
  return articles.map((article) => toCard(article, locale));
});
