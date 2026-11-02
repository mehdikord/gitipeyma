import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import type { ServiceGroupTone } from '../../generated/prisma/client';

export type ServiceGroupRow = { id: number; title: string; tone: ServiceGroupTone; sortOrder: number; services: string[] };

export async function listServiceGroups(): Promise<ServiceGroupRow[]> {
  await requireAdmin();
  const rows = await db.serviceGroup.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { services: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], select: { shortTitle: true } } },
  });
  return rows.map((row) => ({ id: Number(row.id), title: row.title, tone: row.tone, sortOrder: row.sortOrder, services: row.services.map((service) => service.shortTitle) }));
}
