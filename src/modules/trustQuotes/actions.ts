'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { TrustQuoteInput, trustQuoteSchema } from './schema';

export async function saveTrustQuote(id: number | null, input: TrustQuoteInput) {
  return adminAction(trustQuoteSchema, input, async (data) => {
    if (id) await db.trustQuote.update({ where: { id }, data });
    else await db.trustQuote.create({ data });
  });
}

export async function deleteTrustQuote(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.trustQuote.delete({ where: { id: data.id } });
  });
}
