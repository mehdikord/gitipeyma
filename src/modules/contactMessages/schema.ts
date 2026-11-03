import { z } from 'zod';
import { personName, visitorPhone } from '../../lib/validation';
import type { Locale } from '../../i18n/config';
import { SITE_MESSAGES } from '../site/messages';

export const contactMessageSubmitSchema = (locale: Locale = 'fa') => {
  const messages = SITE_MESSAGES[locale];
  return z.object({
    topic: z.string().trim().max(255, { error: messages.topicLong }).nullish().transform((value) => value || null),
    name: personName(locale),
    phone: visitorPhone(locale),
    message: z
      .string({ error: messages.messageMissing })
      .trim()
      .min(10, { error: messages.messageShort })
      .max(3000, { error: messages.messageLong }),
  });
};

export type ContactMessageSubmitInput = z.input<ReturnType<typeof contactMessageSubmitSchema>>;
