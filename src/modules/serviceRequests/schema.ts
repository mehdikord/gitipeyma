import { z } from 'zod';
import { id, optionalText, personName, visitorPhone } from '../../lib/validation';
import { REQUEST_STATUS_KEYS } from './statuses';

// What a visitor sends from any service page: the same three fields for every service.
export const serviceRequestSubmitSchema = z.object({
  serviceId: id('خدمت'),
  name: personName,
  phone: visitorPhone,
  description: optionalText('توضیحات', 2000),
});

export type ServiceRequestSubmitInput = z.input<typeof serviceRequestSubmitSchema>;

// What the panel changes on a request (service, consultation): its progress and the team's note.
export const requestUpdateSchema = z.object({
  id: id(),
  status: z.enum(REQUEST_STATUS_KEYS, { error: 'وضعیت معتبر نیست.' }),
  adminNote: optionalText('یادداشت', 5000),
});

export type RequestUpdateInput = z.input<typeof requestUpdateSchema>;
