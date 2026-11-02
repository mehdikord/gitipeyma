import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type MetricRow = { id: number; value: string; label: string; subtext: string | null; trend: string | null; isActive: boolean; sortOrder: number };

export async function listMetrics(): Promise<MetricRow[]> {
  await requireAdmin();
  const rows = await db.metric.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map(({ id, createdAt, updatedAt, ...row }) => ({ id: Number(id), ...row }));
}
