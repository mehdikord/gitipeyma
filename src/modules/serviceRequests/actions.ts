'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema, noAccess, staffAction } from '../../lib/actions';
import { serviceRequestNoteSchema, ServiceRequestNoteInput, serviceRequestStatusSchema, ServiceRequestStatusInput } from './schema';
import { assertRequestAccess, requestScope } from './access';

// Root admins work on every request; an internal admin only on those of their services.

export async function updateServiceRequest(input: ServiceRequestStatusInput) {
  return staffAction(serviceRequestStatusSchema, input, async ({ id, status }, admin) => {
    await assertRequestAccess(admin, id);
    await db.serviceRequest.update({ where: { id }, data: { status } });
    return { ok: true, message: 'وضعیت درخواست به‌روزرسانی شد.' };
  });
}

/** Root admins only: an internal admin manages a request but cannot remove it. */
export async function deleteServiceRequest(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.serviceRequest.delete({ where: { id: data.id } });
    return { ok: true, message: 'درخواست حذف شد.' };
  });
}

/** Adds a note to a request (the id is the request's). */
export async function addServiceRequestNote(input: ServiceRequestNoteInput) {
  return staffAction(serviceRequestNoteSchema, input, async ({ id, body }, admin) => {
    await assertRequestAccess(admin, id);
    await db.serviceRequestNote.create({ data: { serviceRequestId: id, adminId: admin.id, body } });
    return { ok: true, message: 'یادداشت ثبت شد.' };
  });
}

/** Edits a note (the id is the note's). Anyone who can see the request may edit any of its notes. */
export async function updateServiceRequestNote(input: ServiceRequestNoteInput) {
  return staffAction(serviceRequestNoteSchema, input, async ({ id, body }, admin) => {
    const note = await db.serviceRequestNote.findFirst({ where: { id, request: requestScope(admin) }, select: { id: true, body: true } });
    if (!note) throw noAccess();
    if (note.body === body) return { ok: true, message: 'تغییری در یادداشت نبود.' };
    await db.serviceRequestNote.update({ where: { id }, data: { body, editorId: admin.id, editedAt: new Date() } });
    return { ok: true, message: 'یادداشت ویرایش شد.' };
  });
}
