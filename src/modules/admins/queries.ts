import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { fa } from '../../i18n/translated';

export type AdminRow = {
  id: number;
  name: string;
  phone: string;
  isRoot: boolean;
  // The services an internal admin works on
  services: { id: number; title: string }[];
  lastLoginAt: string | null;
  createdAt: string;
  isCurrent: boolean;
};

export async function listAdmins(): Promise<AdminRow[]> {
  const current = await requireRoot();
  const rows = await db.admin.findMany({
    orderBy: [{ isRoot: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
      phone: true,
      isRoot: true,
      lastLoginAt: true,
      createdAt: true,
      services: { orderBy: { service: { sortOrder: 'asc' } }, select: { service: { select: { id: true, shortTitle: true } } } },
    },
  });
  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    phone: row.phone,
    isRoot: row.isRoot,
    services: row.isRoot ? [] : row.services.map(({ service }) => ({ id: Number(service.id), title: fa(service.shortTitle) })),
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    isCurrent: row.id === current.id,
  }));
}
