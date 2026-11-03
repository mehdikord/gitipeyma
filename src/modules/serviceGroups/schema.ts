import { z } from 'zod';
import { sortOrder, translatedText } from '../../lib/validation';

export const serviceGroupSchema = z.object({
  title: translatedText('عنوان', 255, { required: true }),
  tone: z.enum(['teal', 'gold'], { error: 'رنگ را انتخاب کنید.' }),
  sortOrder,
});

export type ServiceGroupInput = z.input<typeof serviceGroupSchema>;
