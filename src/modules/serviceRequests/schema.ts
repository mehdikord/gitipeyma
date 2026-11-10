import { z } from 'zod';
import { id, optionalText, personName, visitorPhone } from '../../lib/validation';
import type { Locale } from '../../i18n/config';
import { SITE_MESSAGES } from '../site/messages';
import { REQUEST_STATUS_KEYS } from './statuses';

// What a visitor sends from a service page: who they are and how to reach them, which every form
// asks, plus the answers to that service's own questions keyed by field id. The answers are checked
// against the service's fields in the action (checkAnswer in ../serviceForms/fields.ts).
export const serviceRequestSubmitSchema = (locale: Locale = 'fa') =>
  z.object({
    serviceId: z.coerce.number({ error: SITE_MESSAGES[locale].chooseService }).int().positive({ error: SITE_MESSAGES[locale].chooseService }),
    name: personName(locale),
    phone: visitorPhone(locale),
    answers: z.record(z.string(), z.union([z.string().max(10_000), z.array(z.string().max(255)).max(100), z.boolean(), z.null()]).optional()).default({}),
  });

export type ServiceRequestSubmitInput = z.input<ReturnType<typeof serviceRequestSubmitSchema>>;

// What the panel changes on a request (service, consultation): its progress and the team's note.
export const requestUpdateSchema = z.object({
  id: id(),
  status: z.enum(REQUEST_STATUS_KEYS, { error: 'وضعیت معتبر نیست.' }),
  adminNote: optionalText('یادداشت', 5000),
});

export type RequestUpdateInput = z.input<typeof requestUpdateSchema>;
