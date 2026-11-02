import { z } from 'zod';
import { optionalId, optionalText, personName, visitorPhone } from '../../lib/validation';
import { CALL_TIME_KEYS } from './callTimes';

// No service means "I don't know yet, guide me".
export const consultationSubmitSchema = z.object({
  serviceId: optionalId,
  callTime: z.enum(CALL_TIME_KEYS, { error: 'زمان تماس را انتخاب کنید.' }),
  name: personName,
  phone: visitorPhone,
  description: optionalText('توضیحات', 2000),
});

export type ConsultationSubmitInput = z.input<typeof consultationSubmitSchema>;
