import { z } from 'zod';
import { flag, optionalId, optionalText, personName, sortOrder, translatedText } from '../../lib/validation';
import type { Locale } from '../../i18n/config';
import { SITE_MESSAGES } from '../site/messages';

const rating = z.coerce.number({ error: 'امتیاز را انتخاب کنید.' }).int().min(1, { error: 'امتیاز بین ۱ تا ۵ است.' }).max(5, { error: 'امتیاز بین ۱ تا ۵ است.' });

// A visitor's review from the home page. It waits for approval in the panel before it shows.
export const testimonialSubmitSchema = (locale: Locale = 'fa') => {
  const messages = SITE_MESSAGES[locale];
  return z.object({
    name: personName(locale),
    serviceId: optionalId,
    trackingCode: z.string().trim().max(100, { error: messages.trackingLong }).nullish().transform((value) => value || null),
    rating: z.coerce.number({ error: messages.rating }).int().min(1, { error: messages.rating }).max(5, { error: messages.rating }),
    comment: z
      .string({ error: messages.commentMissing })
      .trim()
      .min(10, { error: messages.commentShort })
      .max(2000, { error: messages.commentLong }),
  });
};

export type TestimonialSubmitInput = z.input<ReturnType<typeof testimonialSubmitSchema>>;

export const testimonialSchema = z.object({
  serviceCategoryId: optionalId,
  clientName: translatedText('نام مشتری', 255, { required: true }),
  serviceTitle: translatedText('خدمت دریافت‌شده', 255, { required: true }),
  context: translatedText('شرح پرونده', 500),
  comment: translatedText('متن نظر', 5000, { required: true }),
  year: translatedText('سال', 10),
  rating,
  categoryLabel: translatedText('برچسب دسته'),
  verifiedCode: translatedText('کد تأیید'),
  outcomeHeadline: translatedText('تیتر نتیجه', 500),
  originDestination: translatedText('مبدأ و مقصد'),
  trackingCode: optionalText('کد پرونده', 100),
  isPublished: flag,
  sortOrder,
  milestones: z
    .array(z.object({ title: translatedText('عنوان مرحله', 255, { required: true }), description: translatedText('توضیح مرحله', 500) }))
    .max(10, { error: 'حداکثر ۱۰ مرحله.' })
    .default([]),
});

export type TestimonialInput = z.input<typeof testimonialSchema>;
