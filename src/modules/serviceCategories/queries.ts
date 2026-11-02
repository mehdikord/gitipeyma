import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type ServiceCategoryRow = { id: number; title: string; slug: string; sortOrder: number; serviceCount: number; testimonialCount: number };

export async function listServiceCategories(): Promise<ServiceCategoryRow[]> {
  await requireAdmin();
  const rows = await db.serviceCategory.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], include: { _count: { select: { services: true, testimonials: true } } } });
  return rows.map((row) => ({ id: Number(row.id), title: row.title, slug: row.slug, sortOrder: row.sortOrder, serviceCount: row._count.services, testimonialCount: row._count.testimonials }));
}
