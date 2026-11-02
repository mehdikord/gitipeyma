import { z } from 'zod';
import { flag, optionalId, optionalText, personName, requiredText, sortOrder } from '../../lib/validation';

const rating = z.coerce.number({ error: 'امتیاز را انتخاب کنید.' }).int().min(1, { error: 'امتیاز بین ۱ تا ۵ است.' }).max(5, { error: 'امتیاز بین ۱ تا ۵ است.' });

// A visitor's review from the home page. It waits for approval in the panel before it shows.
export const testimonialSubmitSchema = z.object({
  name: personName,
  serviceId: optionalId,
  trackingCode: optionalText('کد پرونده', 100),
  rating,
  comment: z
    .string({ error: 'متن نظر را بنویسید.' })
    .trim()
    .min(10, { error: 'متن نظر باید حداقل ۱۰ کاراکتر باشد.' })
    .max(2000, { error: 'متن نظر حداکثر ۲٬۰۰۰ کاراکتر است.' }),
});

export type TestimonialSubmitInput = z.input<typeof testimonialSubmitSchema>;

export const testimonialSchema = z.object({
  serviceCategoryId: optionalId,
  clientName: requiredText('نام مشتری'),
  serviceTitle: requiredText('خدمت دریافت‌شده'),
  context: optionalText('شرح پرونده', 500),
  comment: requiredText('متن نظر', 5000),
  year: optionalText('سال', 10),
  rating,
  categoryLabel: optionalText('برچسب دسته'),
  verifiedCode: optionalText('کد تأیید'),
  outcomeHeadline: optionalText('تیتر نتیجه', 500),
  originDestination: optionalText('مبدأ و مقصد'),
  trackingCode: optionalText('کد پرونده', 100),
  isPublished: flag,
  sortOrder,
  milestones: z
    .array(z.object({ title: requiredText('عنوان مرحله'), description: optionalText('توضیح مرحله', 500) }))
    .max(10, { error: 'حداکثر ۱۰ مرحله.' })
    .default([]),
});

export type TestimonialInput = z.input<typeof testimonialSchema>;
