import { z } from 'zod';
import { slug, sortOrder, translatedText } from '../../lib/validation';

export const serviceCategorySchema = z.object({ title: translatedText('عنوان', 255, { required: true }), slug: slug(), sortOrder });

export type ServiceCategoryInput = z.input<typeof serviceCategorySchema>;
