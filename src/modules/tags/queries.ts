import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, fa, Translated } from '../../i18n/translated';
import { param } from '../../lib/pagination';
import { textSearch } from '../../lib/search';

export type TagRow = { id: number; name: Translated; articleCount: number };

export async function listTags(params: Record<string, string | string[] | undefined>): Promise<TagRow[]> {
  await requireRoot();
  const q = param(params, 'q');
  const rows = await db.tag.findMany({
    where: q ? { OR: textSearch('name', q) } : undefined,
    orderBy: { id: 'desc' },
    include: { _count: { select: { articles: true } } },
  });
  return rows.map((row) => ({ id: Number(row.id), name: asTranslated(row.name), articleCount: row._count.articles }));
}

/** Every tag, for the picker on the article form. */
export async function tagOptions() {
  await requireRoot();
  const rows = await db.tag.findMany({ orderBy: { id: 'asc' }, select: { id: true, name: true } });
  return rows.map((row) => ({ value: String(row.id), label: fa(row.name) }));
}
