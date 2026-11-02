'use server';

import { db } from '../../lib/db';
import { adminAction, FormError, idSchema } from '../../lib/actions';
import { ServiceInput, serviceSchema } from './schema';
import { z } from 'zod';

const withSortOrder = <T>(items: T[]) => items.map((item, index) => ({ ...item, sortOrder: index + 1 }));

/** Creates (id null) or updates a service; its features, steps and FAQs are replaced as given. */
export async function saveService(id: number | null, input: ServiceInput) {
  return adminAction(serviceSchema, input, async ({ features, steps, faqs, ...data }) => {
    const taken = await db.service.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined }, select: { id: true } });
    if (taken) throw new FormError('این نامک برای خدمت دیگری استفاده شده است.', { slug: 'این نامک تکراری است.' });

    await db.$transaction(async (tx) => {
      const service = id ? await tx.service.update({ where: { id }, data }) : await tx.service.create({ data });
      if (id) {
        await Promise.all([
          tx.serviceFeature.deleteMany({ where: { serviceId: service.id } }),
          tx.serviceStep.deleteMany({ where: { serviceId: service.id } }),
          tx.serviceFaq.deleteMany({ where: { serviceId: service.id } }),
        ]);
      }
      const serviceId = service.id;
      await tx.serviceFeature.createMany({ data: withSortOrder(features).map((row) => ({ ...row, serviceId })) });
      await tx.serviceStep.createMany({ data: withSortOrder(steps).map((row) => ({ ...row, serviceId })) });
      await tx.serviceFaq.createMany({ data: withSortOrder(faqs).map((row) => ({ ...row, serviceId })) });
    });
  });
}

export async function setServiceActive(id: number, isActive: boolean) {
  return adminAction(z.object({ id: z.number().int().positive(), isActive: z.boolean() }), { id, isActive }, async (data) => {
    await db.service.update({ where: { id: data.id }, data: { isActive: data.isActive } });
    return { ok: true, message: data.isActive ? 'خدمت فعال شد.' : 'خدمت غیرفعال شد و دیگر در سایت نمایش داده نمی‌شود.' };
  });
}

export async function deleteService(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    const requests = await db.serviceRequest.count({ where: { serviceId: data.id } });
    if (requests > 0) {
      throw new FormError(`این خدمت ${requests.toLocaleString('fa-IR')} درخواست ثبت‌شده دارد و حذف نمی‌شود تا درخواست‌ها از دست نروند. به جای حذف، آن را غیرفعال کنید.`);
    }
    await db.service.delete({ where: { id: data.id } });
    return { ok: true, message: 'خدمت حذف شد.' };
  });
}
