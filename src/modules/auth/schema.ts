import { z } from 'zod';
import { adminPhone } from '../../lib/validation';

export const loginSchema = z.object({
  phone: adminPhone,
  password: z.string({ error: 'رمز عبور را وارد کنید.' }).min(1, { error: 'رمز عبور را وارد کنید.' }).max(100),
});

export type LoginInput = z.input<typeof loginSchema>;
