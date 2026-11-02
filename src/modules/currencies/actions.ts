'use server';

import { db } from '../../lib/db';
import { adminAction, FormError, idSchema } from '../../lib/actions';
import { CurrencyInput, currencySchema } from './schema';

export async function saveCurrency(id: number | null, input: CurrencyInput) {
  return adminAction(currencySchema, input, async (data) => {
    const taken = await db.currency.findFirst({ where: { code: data.code, NOT: id ? { id } : undefined }, select: { id: true } });
    if (taken) throw new FormError('این ارز قبلاً اضافه شده است.', { code: 'این کد تکراری است.' });
    if (id) await db.currency.update({ where: { id }, data });
    else await db.currency.create({ data });
  });
}

export async function deleteCurrency(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.currency.delete({ where: { id: data.id } });
  });
}
