import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type CurrencyRow = { id: number; code: string; name: Translated; symbol: string; flag: string | null; rateToToman: number; isActive: boolean; sortOrder: number; updatedAt: string };

export async function listCurrencies(): Promise<CurrencyRow[]> {
  await requireRoot();
  const rows = await db.currency.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map((row) => ({
    id: Number(row.id),
    code: row.code,
    name: asTranslated(row.name),
    symbol: row.symbol,
    flag: row.flag,
    rateToToman: row.rateToToman.toNumber(),
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt.toISOString(),
  }));
}
