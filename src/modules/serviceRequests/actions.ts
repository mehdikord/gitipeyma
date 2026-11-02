'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { RequestUpdateInput, requestUpdateSchema } from './schema';

export async function updateServiceRequest(input: RequestUpdateInput) {
  return adminAction(requestUpdateSchema, input, async ({ id, status, adminNote }) => {
    await db.serviceRequest.update({ where: { id }, data: { status, adminNote } });
    return { ok: true, message: 'درخواست به‌روزرسانی شد.' };
  });
}

export async function deleteServiceRequest(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.serviceRequest.delete({ where: { id: data.id } });
    return { ok: true, message: 'درخواست حذف شد.' };
  });
}
