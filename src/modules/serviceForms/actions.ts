'use server';

import { db } from '../../lib/db';
import { adminAction, FormError } from '../../lib/actions';
import { ServiceFormInput, serviceFormSchema } from './schema';

/**
 * Saves a service's whole form as the builder shows it: fields keep their ids when edited, new ones
 * are added, and the ones no longer listed are removed. Requests already sent are not affected,
 * because each one keeps its own copy of the questions. Returns the ids in the order given.
 */
export async function saveServiceForm(input: ServiceFormInput) {
  return adminAction(serviceFormSchema, input, async ({ serviceId, fields }) => {
    const service = await db.service.findUnique({ where: { id: serviceId }, select: { id: true } });
    if (!service) throw new FormError('این خدمت پیدا نشد؛ شاید حذف شده باشد.');

    const ids = await db.$transaction(async (tx) => {
      const existing = new Set((await tx.serviceFormField.findMany({ where: { serviceId }, select: { id: true } })).map((field) => Number(field.id)));
      const kept = fields.map((field) => field.id).filter((fieldId): fieldId is number => fieldId !== null && existing.has(fieldId));
      await tx.serviceFormField.deleteMany({ where: { serviceId, id: { notIn: kept } } });

      const saved: number[] = [];
      for (const [index, { id, ...field }] of fields.entries()) {
        const data = { ...field, sortOrder: index + 1 };
        const row = id !== null && existing.has(id)
          ? await tx.serviceFormField.update({ where: { id }, data })
          : await tx.serviceFormField.create({ data: { ...data, serviceId } });
        saved.push(Number(row.id));
      }
      return saved;
    });

    return { ok: true, message: 'فرم خدمت ذخیره شد.', data: { ids } };
  });
}
