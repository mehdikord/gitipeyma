import { z } from 'zod';
import { optionalText, personName, visitorPhone } from '../../lib/validation';

export const contactMessageSubmitSchema = z.object({
  topic: optionalText('موضوع'),
  name: personName,
  phone: visitorPhone,
  message: z
    .string({ error: 'لطفاً متن پیام خود را بنویسید.' })
    .trim()
    .min(10, { error: 'متن پیام باید حداقل ۱۰ کاراکتر باشد.' })
    .max(3000, { error: 'متن پیام حداکثر ۳٬۰۰۰ کاراکتر است.' }),
});

export type ContactMessageSubmitInput = z.input<typeof contactMessageSubmitSchema>;
