import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type TrustQuoteRow = { id: number; text: string; isActive: boolean; sortOrder: number };

export async function listTrustQuotes(): Promise<TrustQuoteRow[]> {
  await requireAdmin();
  const rows = await db.trustQuote.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map(({ id, createdAt, updatedAt, ...row }) => ({ id: Number(id), ...row }));
}
