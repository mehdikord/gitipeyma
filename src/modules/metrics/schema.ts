import { z } from 'zod';
import { flag, optionalText, requiredText, sortOrder } from '../../lib/validation';

export const metricSchema = z.object({
  value: requiredText('عدد', 50),
  label: requiredText('عنوان'),
  subtext: optionalText('توضیح'),
  trend: optionalText('روند'),
  isActive: flag,
  sortOrder,
});

export type MetricInput = z.input<typeof metricSchema>;
