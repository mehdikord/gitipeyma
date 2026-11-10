import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type ServiceCategoryRow = { id: number; title: Translated; slug: string; sortOrder: number; serviceCount: number; testimonialCount: number };

export async function listServiceCategories(): Promise<ServiceCategoryRow[]> {
  await requireRoot();
  const rows = await db.serviceCategory.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], include: { _count: { select: { services: true, testimonials: true } } } });
  return rows.map((row) => ({ id: Number(row.id), title: asTranslated(row.title), slug: row.slug, sortOrder: row.sortOrder, serviceCount: row._count.services, testimonialCount: row._count.testimonials }));
}
