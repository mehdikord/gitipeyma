import { z } from 'zod';
import { id, optionalText, personName, visitorPhone } from '../../lib/validation';
import type { Locale } from '../../i18n/config';
import { SITE_MESSAGES } from '../site/messages';
import { REQUEST_STATUS_KEYS } from './statuses';

// What a visitor sends from any service page: the same three fields for every service.
export const serviceRequestSubmitSchema = (locale: Locale = 'fa') =>
  z.object({
    serviceId: z.coerce.number({ error: SITE_MESSAGES[locale].chooseService }).int().positive({ error: SITE_MESSAGES[locale].chooseService }),
    name: personName(locale),
    phone: visitorPhone(locale),
    description: z.string().trim().max(2000, { error: SITE_MESSAGES[locale].descriptionLong }).nullish().transform((value) => value || null),
  });

export type ServiceRequestSubmitInput = z.input<ReturnType<typeof serviceRequestSubmitSchema>>;

// What the panel changes on a request (service, consultation): its progress and the team's note.
export const requestUpdateSchema = z.object({
  id: id(),
  status: z.enum(REQUEST_STATUS_KEYS, { error: 'وضعیت معتبر نیست.' }),
  adminNote: optionalText('یادداشت', 5000),
});

export type RequestUpdateInput = z.input<typeof requestUpdateSchema>;
