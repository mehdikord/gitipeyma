import { z } from 'zod';
import { flag, optionalText, requiredText, sortOrder } from '../../lib/validation';

const hour = (label: string) =>
  z.coerce.number({ error: `${label} را وارد کنید.` }).int({ error: `${label} عدد صحیح است.` }).min(0, { error: `${label} بین ۰ تا ۲۴ است.` }).max(24, { error: `${label} بین ۰ تا ۲۴ است.` });

const coordinate = (label: string, limit: number) =>
  z.coerce.number({ error: `${label} را وارد کنید.` }).min(-limit, { error: `${label} معتبر نیست.` }).max(limit, { error: `${label} معتبر نیست.` });

export const officeSchema = z
  .object({
    name: requiredText('نام کوتاه', 100),
    role: requiredText('نقش دفتر'),
    country: requiredText('کشور', 100),
    address: requiredText('نشانی', 1000),
    phones: z.array(requiredText('شماره تلفن', 30)).min(1, { error: 'دست‌کم یک شماره تلفن وارد کنید.' }).max(6),
    email: optionalText('ایمیل').pipe(z.email({ error: 'ایمیل معتبر نیست.' }).nullable()),
    workingHours: requiredText('ساعت کاری (متن)'),
    timeZone: z.string().refine(
      (zone) => {
        try {
          new Intl.DateTimeFormat('en-US', { timeZone: zone });
          return true;
        } catch {
          return false;
        }
      },
      { error: 'منطقه زمانی معتبر نیست، مثل Europe/Istanbul.' },
    ),
    openHour: hour('ساعت شروع'),
    closeHour: hour('ساعت پایان'),
    closedWeekdays: z.array(z.coerce.number().int().min(0).max(6)).default([]),
    latitude: coordinate('عرض جغرافیایی', 90),
    longitude: coordinate('طول جغرافیایی', 180),
    isActive: flag,
    sortOrder,
  })
  .refine((office) => office.closeHour > office.openHour, { path: ['closeHour'], error: 'ساعت پایان باید بعد از ساعت شروع باشد.' });

export type OfficeInput = z.input<typeof officeSchema>;

export const TIME_ZONES = [
  { value: 'Europe/Istanbul', label: 'ترکیه (Europe/Istanbul)' },
  { value: 'Asia/Tehran', label: 'ایران (Asia/Tehran)' },
  { value: 'Asia/Dubai', label: 'امارات (Asia/Dubai)' },
  { value: 'Europe/Berlin', label: 'آلمان و اروپای مرکزی (Europe/Berlin)' },
  { value: 'Europe/London', label: 'بریتانیا (Europe/London)' },
];

export const WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
