import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type MetricRow = { id: number; value: Translated; label: Translated; subtext: Translated; trend: Translated; isActive: boolean; sortOrder: number };

export async function listMetrics(): Promise<MetricRow[]> {
  await requireAdmin();
  const rows = await db.metric.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map((row) => ({
    id: Number(row.id),
    value: asTranslated(row.value),
    label: asTranslated(row.label),
    subtext: asTranslated(row.subtext),
    trend: asTranslated(row.trend),
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  }));
}
