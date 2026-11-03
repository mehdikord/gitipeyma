import { z } from 'zod';
import { optionalId, personName, visitorPhone } from '../../lib/validation';
import type { Locale } from '../../i18n/config';
import { SITE_MESSAGES } from '../site/messages';
import { CALL_TIME_KEYS } from './callTimes';

// No service means "I don't know yet, guide me".
export const consultationSubmitSchema = (locale: Locale = 'fa') =>
  z.object({
    serviceId: optionalId,
    callTime: z.enum(CALL_TIME_KEYS, { error: SITE_MESSAGES[locale].chooseCallTime }),
    name: personName(locale),
    phone: visitorPhone(locale),
    description: z.string().trim().max(2000, { error: SITE_MESSAGES[locale].descriptionLong }).nullish().transform((value) => value || null),
  });

export type ConsultationSubmitInput = z.input<ReturnType<typeof consultationSubmitSchema>>;
