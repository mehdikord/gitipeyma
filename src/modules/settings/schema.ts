import { z } from 'zod';
import { SETTING_FIELDS } from './definitions';

const fieldSchema = (field: (typeof SETTING_FIELDS)[number]) => {
  if (field.key === 'whatsapp_number') return z.string().trim().regex(/^\d{8,15}$/, { error: 'فقط ارقام با کد کشور، مثل 905367008090.' });
  if (field.type === 'number') return z.string().trim().regex(/^\d+(\.\d+)?$/, { error: `${field.label} باید عدد باشد.` });
  return z.string().trim().min(1, { error: `${field.label} را وارد کنید.` }).max(1000);
};

export const settingsSchema = z.object(Object.fromEntries(SETTING_FIELDS.map((field) => [field.key, fieldSchema(field)])));
