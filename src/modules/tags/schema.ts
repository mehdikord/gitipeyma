import { z } from 'zod';
import { requiredText, translatedText } from '../../lib/validation';

export const tagSchema = z.object({ name: translatedText('نام برچسب', 100, { required: true }) });

export type TagInput = z.input<typeof tagSchema>;

/** A tag made on the spot from the article form: just its Persian name, translated later on the tags page. */
export const quickTagSchema = z.object({ name: requiredText('نام برچسب', 100) });
