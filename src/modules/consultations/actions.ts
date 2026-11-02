'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { RequestUpdateInput, requestUpdateSchema } from '../serviceRequests/schema';

export async function updateConsultation(input: RequestUpdateInput) {
  return adminAction(requestUpdateSchema, input, async ({ id, status, adminNote }) => {
    await db.consultationRequest.update({ where: { id }, data: { status, adminNote } });
    return { ok: true, message: 'درخواست مشاوره به‌روزرسانی شد.' };
  });
}

export async function deleteConsultation(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.consultationRequest.delete({ where: { id: data.id } });
    return { ok: true, message: 'درخواست مشاوره حذف شد.' };
  });
}
