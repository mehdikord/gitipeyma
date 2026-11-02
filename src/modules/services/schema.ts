import { z } from 'zod';
import { flag, id, imagePath, optionalId, optionalText, requiredText, slug, sortOrder } from '../../lib/validation';

export const serviceSchema = z.object({
  title: requiredText('عنوان کامل'),
  shortTitle: requiredText('عنوان کوتاه'),
  slug: slug(),
  serviceCategoryId: id('دسته‌بندی'),
  serviceGroupId: optionalId,
  categoryLabel: optionalText('برچسب دسته'),
  eyebrow: optionalText('متن بالای عنوان'),
  badge: optionalText('نشان'),
  icon: optionalText('آیکن', 50),
  image: imagePath(),
  summary: requiredText('خلاصه', 2000),
  description: requiredText('معرفی', 5000),
  content: optionalText('متن تکمیلی', 20000),
  isActive: flag,
  isHighlighted: flag,
  sortOrder,
  features: z.array(z.object({ title: requiredText('متن ویژگی', 500) })).max(30, { error: 'حداکثر ۳۰ ویژگی.' }).default([]),
  steps: z.array(z.object({ title: requiredText('عنوان مرحله'), description: requiredText('توضیح مرحله', 2000) })).max(12, { error: 'حداکثر ۱۲ مرحله.' }).default([]),
  faqs: z.array(z.object({ question: requiredText('پرسش', 500), answer: requiredText('پاسخ', 3000) })).max(30, { error: 'حداکثر ۳۰ پرسش.' }).default([]),
});

export type ServiceInput = z.input<typeof serviceSchema>;
