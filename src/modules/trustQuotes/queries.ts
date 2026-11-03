import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type TrustQuoteRow = { id: number; text: Translated; isActive: boolean; sortOrder: number };

export async function listTrustQuotes(): Promise<TrustQuoteRow[]> {
  await requireAdmin();
  const rows = await db.trustQuote.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map((row) => ({ id: Number(row.id), text: asTranslated(row.text), isActive: row.isActive, sortOrder: row.sortOrder }));
}
