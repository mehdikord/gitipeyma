import { z } from 'zod';
import { translatedText } from '../../lib/validation';

export const articleCategorySchema = z.object({ name: translatedText('نام', 255, { required: true }) });

export type ArticleCategoryInput = z.input<typeof articleCategorySchema>;
