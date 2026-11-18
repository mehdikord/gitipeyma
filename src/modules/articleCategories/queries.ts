import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, fa, Translated } from '../../i18n/translated';

export type ArticleCategoryRow = { id: number; name: Translated; articleCount: number };

export async function listArticleCategories(): Promise<ArticleCategoryRow[]> {
  await requireRoot();
  const rows = await db.articleCategory.findMany({ orderBy: { id: 'asc' }, include: { _count: { select: { articles: true } } } });
  return rows.map((row) => ({ id: Number(row.id), name: asTranslated(row.name), articleCount: row._count.articles }));
}

/** For the category dropdowns of the article form and the list filter. */
export async function articleCategoryOptions() {
  await requireRoot();
  const rows = await db.articleCategory.findMany({ orderBy: { id: 'asc' }, select: { id: true, name: true } });
  return rows.map((row) => ({ value: String(row.id), label: fa(row.name) }));
}
