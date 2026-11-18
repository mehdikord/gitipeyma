import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { pageArgs, paginated, Paginated, param } from '../../lib/pagination';
import { textSearch } from '../../lib/search';
import type { Prisma } from '../../generated/prisma/client';
import { asTranslated, fa, Translated } from '../../i18n/translated';
import type { ArticleStatusValue } from './schema';

/** Where an article stands on the site: a draft, out, or published to go out at a later time. */
export type ArticleState = 'draft' | 'published' | 'scheduled';

const stateOf = (status: ArticleStatusValue, publishedAt: Date | null): ArticleState =>
  status === 'draft' ? 'draft' : publishedAt && publishedAt > new Date() ? 'scheduled' : 'published';

export type ArticleAdminRow = {
  id: number;
  title: Translated;
  slug: string;
  image: string | null;
  categoryName: string;
  state: ArticleState;
  isFeatured: boolean;
  views: number;
  tagCount: number;
  publishedAt: string | null;
  updatedAt: string;
  // For the translation chips: which languages the title and body are written in
  translations: { title: Translated; excerpt: Translated; content: Translated };
};

export async function listArticlesForAdmin(params: Record<string, string | string[] | undefined>): Promise<Paginated<ArticleAdminRow>> {
  await requireRoot();
  const q = param(params, 'q');
  const category = Number(param(params, 'category'));
  const state = param(params, 'state');
  const now = new Date();
  const where: Prisma.ArticleWhereInput = {
    articleCategoryId: category > 0 ? category : undefined,
    ...(state === 'draft' ? { status: 'draft' } : {}),
    ...(state === 'published' ? { status: 'published', publishedAt: { lte: now } } : {}),
    ...(state === 'scheduled' ? { status: 'published', publishedAt: { gt: now } } : {}),
    OR: q ? [...textSearch('title', q), { slug: { contains: q } }] : undefined,
  };
  const page = pageArgs(params);

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      // Newest first: drafts by when they were last touched, the rest by their publish time
      orderBy: [{ publishedAt: { sort: 'desc', nulls: 'first' } }, { updatedAt: 'desc' }],
      skip: page.skip,
      take: page.take,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        slug: true,
        image: true,
        status: true,
        isFeatured: true,
        views: true,
        publishedAt: true,
        updatedAt: true,
        category: { select: { name: true } },
        _count: { select: { tags: true } },
      },
    }),
    db.article.count({ where }),
  ]);

  return paginated(
    articles.map((article) => {
      const content = asTranslated(article.content);
      return {
        id: Number(article.id),
        title: asTranslated(article.title),
        slug: article.slug,
        image: article.image,
        categoryName: fa(article.category.name),
        state: stateOf(article.status, article.publishedAt),
        isFeatured: article.isFeatured,
        views: article.views,
        tagCount: article._count.tags,
        publishedAt: article.publishedAt?.toISOString() ?? null,
        updatedAt: article.updatedAt.toISOString(),
        // Only whether each language has a body matters here, not the HTML itself
        translations: {
          title: asTranslated(article.title),
          excerpt: asTranslated(article.excerpt),
          content: Object.fromEntries(Object.keys(content).map((locale) => [locale, '✓'])) as Translated,
        },
      };
    }),
    total,
    page,
  );
}

export type ArticleForEdit = {
  id: number;
  title: Translated;
  slug: string;
  articleCategoryId: number;
  excerpt: Translated;
  content: Translated;
  image: string | null;
  metaTitle: Translated;
  metaDescription: Translated;
  status: ArticleStatusValue;
  state: ArticleState;
  isFeatured: boolean;
  publishedAt: string | null;
  tagIds: number[];
  views: number;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getArticleForAdmin(id: number): Promise<ArticleForEdit | null> {
  await requireRoot();
  if (!Number.isInteger(id) || id <= 0) return null;
  const article = await db.article.findUnique({
    where: { id },
    include: { tags: { select: { tagId: true } }, admin: { select: { name: true } } },
  });
  if (!article) return null;
  return {
    id: Number(article.id),
    title: asTranslated(article.title),
    slug: article.slug,
    articleCategoryId: Number(article.articleCategoryId),
    excerpt: asTranslated(article.excerpt),
    content: asTranslated(article.content),
    image: article.image,
    metaTitle: asTranslated(article.metaTitle),
    metaDescription: asTranslated(article.metaDescription),
    status: article.status,
    state: stateOf(article.status, article.publishedAt),
    isFeatured: article.isFeatured,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    tagIds: article.tags.map((tag) => Number(tag.tagId)),
    views: article.views,
    authorName: article.admin?.name ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}
