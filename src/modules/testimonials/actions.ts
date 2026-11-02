'use server';

import { z } from 'zod';
import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { TestimonialInput, testimonialSchema } from './schema';

export async function saveTestimonial(id: number | null, input: TestimonialInput) {
  return adminAction(testimonialSchema, input, async ({ milestones, ...data }) => {
    await db.$transaction(async (tx) => {
      const testimonial = id ? await tx.testimonial.update({ where: { id }, data }) : await tx.testimonial.create({ data: { ...data, source: 'admin' } });
      if (id) await tx.testimonialMilestone.deleteMany({ where: { testimonialId: testimonial.id } });
      await tx.testimonialMilestone.createMany({ data: milestones.map((milestone, index) => ({ ...milestone, testimonialId: testimonial.id, sortOrder: index + 1 })) });
    });
  });
}

export async function setTestimonialPublished(id: number, isPublished: boolean) {
  return adminAction(z.object({ id: z.number().int().positive(), isPublished: z.boolean() }), { id, isPublished }, async (data) => {
    await db.testimonial.update({ where: { id: data.id }, data: { isPublished: data.isPublished } });
    return { ok: true, message: data.isPublished ? 'نظر منتشر شد و در سایت نمایش داده می‌شود.' : 'نظر از سایت برداشته شد.' };
  });
}

export async function deleteTestimonial(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.testimonial.delete({ where: { id: data.id } });
    return { ok: true, message: 'نظر حذف شد.' };
  });
}
