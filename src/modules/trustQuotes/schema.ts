import { z } from 'zod';
import { flag, sortOrder, translatedText } from '../../lib/validation';

export const trustQuoteSchema = z.object({ text: translatedText('متن', 500, { required: true }), isActive: flag, sortOrder });

export type TrustQuoteInput = z.input<typeof trustQuoteSchema>;
