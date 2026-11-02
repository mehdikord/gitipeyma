import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type AdminRow = { id: number; name: string; phone: string; lastLoginAt: string | null; createdAt: string; isCurrent: boolean };

export async function listAdmins(): Promise<AdminRow[]> {
  const current = await requireAdmin();
  const rows = await db.admin.findMany({ orderBy: { id: 'asc' }, select: { id: true, name: true, phone: true, lastLoginAt: true, createdAt: true } });
  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    phone: row.phone,
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    isCurrent: row.id === current.id,
  }));
}
