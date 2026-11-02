import { z } from 'zod';
import { flag, requiredText, sortOrder } from '../../lib/validation';

export const trustQuoteSchema = z.object({ text: requiredText('متن', 500), isActive: flag, sortOrder });

export type TrustQuoteInput = z.input<typeof trustQuoteSchema>;
