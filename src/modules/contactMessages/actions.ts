'use server';

import { z } from 'zod';
import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';

export async function setContactMessageRead(id: number, read: boolean) {
  return adminAction(z.object({ id: z.number().int().positive(), read: z.boolean() }), { id, read }, async (data) => {
    await db.contactMessage.update({ where: { id: data.id }, data: { readAt: data.read ? new Date() : null } });
    return { ok: true, message: data.read ? 'پیام خوانده‌شده علامت خورد.' : 'پیام خوانده‌نشده علامت خورد.' };
  });
}

export async function deleteContactMessage(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.contactMessage.delete({ where: { id: data.id } });
    return { ok: true, message: 'پیام حذف شد.' };
  });
}
