import { z } from 'zod';
import { flag, id, imagePath, optionalId, optionalText, slug, sortOrder, translatedText } from '../../lib/validation';

export const serviceSchema = z.object({
  title: translatedText('عنوان کامل', 255, { required: true }),
  shortTitle: translatedText('عنوان کوتاه', 255, { required: true }),
  slug: slug(),
  serviceCategoryId: id('دسته‌بندی'),
  serviceGroupId: optionalId,
  categoryLabel: translatedText('برچسب دسته'),
  eyebrow: translatedText('متن بالای عنوان'),
  badge: translatedText('نشان'),
  icon: optionalText('آیکن', 50),
  image: imagePath(),
  summary: translatedText('خلاصه', 2000, { required: true }),
  description: translatedText('معرفی', 5000, { required: true }),
  content: translatedText('متن تکمیلی', 20000),
  isActive: flag,
  isHighlighted: flag,
  sortOrder,
  features: z.array(z.object({ title: translatedText('متن ویژگی', 500, { required: true }) })).max(30, { error: 'حداکثر ۳۰ ویژگی.' }).default([]),
  steps: z
    .array(z.object({ title: translatedText('عنوان مرحله', 255, { required: true }), description: translatedText('توضیح مرحله', 2000, { required: true }) }))
    .max(12, { error: 'حداکثر ۱۲ مرحله.' })
    .default([]),
  faqs: z
    .array(z.object({ question: translatedText('پرسش', 500, { required: true }), answer: translatedText('پاسخ', 3000, { required: true }) }))
    .max(30, { error: 'حداکثر ۳۰ پرسش.' })
    .default([]),
});

export type ServiceInput = z.input<typeof serviceSchema>;
