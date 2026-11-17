import { z } from 'zod';
import { optionalId, personName, visitorPhone } from '../../lib/validation';
import type { Locale } from '../../i18n/config';
import { SITE_MESSAGES } from '../site/messages';

// Name, number and what they want advice on. A service is set only when they came from that service's page.
export const consultationSubmitSchema = (locale: Locale = 'fa') => {
  const messages = SITE_MESSAGES[locale];
  return z.object({
    serviceId: optionalId,
    name: personName(locale),
    phone: visitorPhone(locale),
    message: z
      .string({ error: messages.messageMissing })
      .trim()
      .min(10, { error: messages.messageShort })
      .max(3000, { error: messages.messageLong }),
  });
};

export type ConsultationSubmitInput = z.input<ReturnType<typeof consultationSubmitSchema>>;
