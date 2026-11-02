'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { OfficeInput, officeSchema } from './schema';

export async function saveOffice(id: number | null, input: OfficeInput) {
  return adminAction(officeSchema, input, async (data) => {
    const office = { ...data, closedWeekdays: [...new Set(data.closedWeekdays)].sort() };
    if (id) await db.office.update({ where: { id }, data: office });
    else await db.office.create({ data: office });
  });
}

export async function deleteOffice(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.office.delete({ where: { id: data.id } });
  });
}
