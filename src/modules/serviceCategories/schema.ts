import { z } from 'zod';
import { requiredText, slug, sortOrder } from '../../lib/validation';

export const serviceCategorySchema = z.object({ title: requiredText('عنوان'), slug: slug(), sortOrder });

export type ServiceCategoryInput = z.input<typeof serviceCategorySchema>;
