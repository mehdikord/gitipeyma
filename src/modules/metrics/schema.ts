import { z } from 'zod';
import { flag, sortOrder, translatedText } from '../../lib/validation';

export const metricSchema = z.object({
  value: translatedText('عدد', 50, { required: true }),
  label: translatedText('عنوان', 255, { required: true }),
  subtext: translatedText('توضیح'),
  trend: translatedText('روند'),
  isActive: flag,
  sortOrder,
});

export type MetricInput = z.input<typeof metricSchema>;
