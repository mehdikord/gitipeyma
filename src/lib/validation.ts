/**
 * Zod building blocks with Persian messages, shared by every form schema in src/modules.
 * Each takes the field's label so the message can name it.
 */

import { z } from 'zod';
import { normalizeDigits, validateFullName, validatePhoneNumber } from '../utils/validation';

export const requiredText = (label: string, max = 255) =>
  z
    .string({ error: `${label} را وارد کنید.` })
    .trim()
    .min(1, { error: `${label} را وارد کنید.` })
    .max(max, { error: `${label} حداکثر ${max.toLocaleString('fa-IR')} کاراکتر است.` });

/** Empty input is stored as null. */
export const optionalText = (label: string, max = 255) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label} حداکثر ${max.toLocaleString('fa-IR')} کاراکتر است.` })
    .nullish()
    .transform((value) => value || null);

export const slug = (label = 'نامک') =>
  requiredText(label, 191)
    .transform((value) => value.toLowerCase())
    .pipe(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: `${label} فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.` }));

export const sortOrder = z.coerce
  .number({ error: 'ترتیب نمایش باید عدد باشد.' })
  .int({ error: 'ترتیب نمایش باید عدد صحیح باشد.' })
  .min(0, { error: 'ترتیب نمایش نمی‌تواند منفی باشد.' })
  .max(1_000_000)
  .default(0);

// Forms send their values as objects, so booleans arrive as booleans (no "false" strings to coerce).
export const flag = z.boolean().default(false);

export const id = (label = 'شناسه') => z.coerce.number({ error: `${label} معتبر نیست.` }).int().positive({ error: `${label} را انتخاب کنید.` });

export const optionalId = z.preprocess((value) => (value === '' || value === undefined ? null : value), z.coerce.number().int().positive().nullable());

/** A link to a file on this site (/images/..., /uploads/...) or a full http(s) address. */
export const imagePath = (label = 'تصویر') =>
  optionalText(label, 500).refine((value) => !value || value.startsWith('/') || /^https?:\/\//.test(value), { error: `آدرس ${label} معتبر نیست.` });

/** The visitor's name, with the same rules the public forms check in the browser. */
export const personName = z.string().superRefine((value, context) => {
  const check = validateFullName(value);
  if (!check.isValid) context.addIssue({ code: 'custom', message: check.error! });
}).transform((value) => value.trim());

/** A visitor's phone number (Iranian, Turkish or international), stored with Latin digits. */
export const visitorPhone = z.string().superRefine((value, context) => {
  const check = validatePhoneNumber(value);
  if (!check.isValid) context.addIssue({ code: 'custom', message: check.error! });
}).transform((value) => validatePhoneNumber(value).normalized);

/** An admin's login: an Iranian mobile number written 09xxxxxxxxx. */
export const adminPhone = z
  .string({ error: 'شماره موبایل را وارد کنید.' })
  .transform((value) => normalizeDigits(value).replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^09\d{9}$/, { error: 'شماره موبایل را به شکل ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.' }));

export const newPassword = z.string({ error: 'رمز عبور را وارد کنید.' }).min(6, { error: 'رمز عبور حداقل ۶ کاراکتر است.' }).max(100);

/** Field errors keyed by path ("steps.0.title"), the shape every form in the panel reads. */
export type FieldErrors = Record<string, string>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    errors[key] ??= issue.message;
  }
  return errors;
}
