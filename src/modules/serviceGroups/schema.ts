import { z } from 'zod';
import { requiredText, sortOrder } from '../../lib/validation';

export const serviceGroupSchema = z.object({
  title: requiredText('عنوان'),
  tone: z.enum(['teal', 'gold'], { error: 'رنگ را انتخاب کنید.' }),
  sortOrder,
});

export type ServiceGroupInput = z.input<typeof serviceGroupSchema>;
