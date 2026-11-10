import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import type { ServiceGroupTone } from '../../generated/prisma/client';
import { asTranslated, fa, Translated } from '../../i18n/translated';

export type ServiceGroupRow = { id: number; title: Translated; tone: ServiceGroupTone; sortOrder: number; services: string[] };

export async function listServiceGroups(): Promise<ServiceGroupRow[]> {
  await requireRoot();
  const rows = await db.serviceGroup.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { services: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], select: { shortTitle: true } } },
  });
  return rows.map((row) => ({ id: Number(row.id), title: asTranslated(row.title), tone: row.tone, sortOrder: row.sortOrder, services: row.services.map((service) => fa(service.shortTitle)) }));
}
