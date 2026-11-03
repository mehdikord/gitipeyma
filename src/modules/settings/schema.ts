import { z } from 'zod';
import { translatedText } from '../../lib/validation';
import { SETTING_FIELDS, SettingField } from './definitions';

// A translatable setting is saved as its JSON text ({"fa": ..., "en": ...}), the others as they are.
const fieldSchema = (field: SettingField) => {
  if (field.translatable) return translatedText(field.label, 1000, { required: true }).transform((texts) => JSON.stringify(texts));
  if (field.key === 'whatsapp_number') return z.string().trim().regex(/^\d{8,15}$/, { error: 'فقط ارقام با کد کشور، مثل 905367008090.' });
  if (field.type === 'number') return z.string().trim().regex(/^\d+(\.\d+)?$/, { error: `${field.label} باید عدد باشد.` });
  return z.string().trim().min(1, { error: `${field.label} را وارد کنید.` }).max(1000);
};

export const settingsSchema = z.object(Object.fromEntries(SETTING_FIELDS.map((field) => [field.key, fieldSchema(field)])));
