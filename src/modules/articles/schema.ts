import { z } from 'zod';
import { flag, id, imagePath, translatedText } from '../../lib/validation';

export const ARTICLE_STATUSES = ['draft', 'published'] as const;
export type ArticleStatusValue = (typeof ARTICLE_STATUSES)[number];

export const articleSchema = z.object({
  title: translatedText('عنوان', 255, { required: true }),
  // Empty: made from the English (or Turkish) title when saved
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(191, { error: 'نامک حداکثر ۱۹۱ کاراکتر است.' })
    .default('')
    .refine((value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), { error: 'نامک فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.' }),
  articleCategoryId: id('دسته‌بندی'),
  excerpt: translatedText('خلاصه', 1000),
  // HTML, cleaned in the action; whether it is blank is checked there too
  content: translatedText('محتوا', 400_000),
  image: imagePath('تصویر شاخص'),
  metaTitle: translatedText('عنوان سئو', 255),
  metaDescription: translatedText('توضیح سئو', 500),
  status: z.enum(ARTICLE_STATUSES, { error: 'وضعیت انتشار را انتخاب کنید.' }),
  isFeatured: flag,
  // An ISO time from the browser, so it means the admin's own clock; empty means "now" once published
  publishedAt: z.preprocess((value) => (value === '' || value === undefined ? null : value), z.coerce.date({ error: 'زمان انتشار معتبر نیست.' }).nullable()),
  tagIds: z.array(z.coerce.number().int().positive()).max(30, { error: 'حداکثر ۳۰ برچسب.' }).default([]),
});

export type ArticleInput = z.input<typeof articleSchema>;
