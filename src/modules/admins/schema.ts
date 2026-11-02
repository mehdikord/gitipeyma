import { z } from 'zod';
import { adminPhone, newPassword, requiredText } from '../../lib/validation';

// On edit the password may be left empty to keep the current one.
export const adminSchema = (creating: boolean) =>
  z.object({
    name: requiredText('نام'),
    phone: adminPhone,
    password: creating ? newPassword : z.union([z.literal(''), newPassword]).default(''),
  });

export type AdminInput = { name: string; phone: string; password: string };

export const profileSchema = z
  .object({
    name: requiredText('نام'),
    phone: adminPhone,
    currentPassword: z.string().default(''),
    password: z.union([z.literal(''), newPassword]).default(''),
    passwordConfirmation: z.string().default(''),
  })
  .refine((data) => data.password === data.passwordConfirmation, { path: ['passwordConfirmation'], error: 'تکرار رمز عبور با رمز جدید یکی نیست.' });

export type ProfileInput = z.input<typeof profileSchema>;
