'use server';

import { db } from '../../lib/db';
import { adminAction, FormError, idSchema } from '../../lib/actions';
import { ServiceCategoryInput, serviceCategorySchema } from './schema';

export async function saveServiceCategory(id: number | null, input: ServiceCategoryInput) {
  return adminAction(serviceCategorySchema, input, async (data) => {
    const taken = await db.serviceCategory.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined }, select: { id: true } });
    if (taken) throw new FormError('این نامک برای دسته دیگری استفاده شده است.', { slug: 'این نامک تکراری است.' });
    if (id) await db.serviceCategory.update({ where: { id }, data });
    else await db.serviceCategory.create({ data });
  });
}

export async function deleteServiceCategory(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    const services = await db.service.count({ where: { serviceCategoryId: data.id } });
    if (services > 0) throw new FormError(`${services.toLocaleString('fa-IR')} خدمت در این دسته است. ابتدا آن‌ها را به دسته دیگری منتقل کنید.`);
    await db.serviceCategory.delete({ where: { id: data.id } });
    return { ok: true, message: 'دسته حذف شد.' };
  });
}
