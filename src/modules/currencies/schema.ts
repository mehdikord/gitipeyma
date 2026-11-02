import { z } from 'zod';
import { flag, optionalText, requiredText, sortOrder } from '../../lib/validation';
import { normalizeDigits } from '../../utils/validation';

export const currencySchema = z.object({
  code: requiredText('کد ارز', 10)
    .transform((value) => value.toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{3}$/, { error: 'کد ارز سه حرف انگلیسی است، مثل USD.' })),
  name: requiredText('نام ارز', 100),
  symbol: requiredText('نماد', 10),
  flag: optionalText('پرچم', 16),
  rateToToman: z.preprocess(
    (value) => (typeof value === 'string' ? normalizeDigits(value).replace(/[,٬\s]/g, '') : value),
    z.coerce.number({ error: 'نرخ باید عدد باشد.' }).positive({ error: 'نرخ باید بیشتر از صفر باشد.' }).max(1e15),
  ),
  isActive: flag,
  sortOrder,
});

export type CurrencyInput = z.input<typeof currencySchema>;
