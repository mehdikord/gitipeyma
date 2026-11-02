'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { ServiceGroupInput, serviceGroupSchema } from './schema';

export async function saveServiceGroup(id: number | null, input: ServiceGroupInput) {
  return adminAction(serviceGroupSchema, input, async (data) => {
    if (id) await db.serviceGroup.update({ where: { id }, data });
    else await db.serviceGroup.create({ data });
  });
}

// Its services stay, without a group (they no longer show on the home page map).
export async function deleteServiceGroup(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.serviceGroup.delete({ where: { id: data.id } });
    return { ok: true, message: 'گروه حذف شد.' };
  });
}
