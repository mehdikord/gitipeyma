import { z } from 'zod';
import { flag, id, optionalId, requiredText, translatedText } from '../../lib/validation';
import { FORM_FIELD_TYPE_KEYS } from './fields';

const MAX_FIELDS = 40;
const MAX_OPTIONS = 50;

const optionSchema = z.object({
  value: requiredText('مقدار گزینه', 100),
  label: translatedText('عنوان گزینه', 255, { required: true }),
});

// One question of the form. A select needs options with distinct values; the settings that do not
// apply to a type are cleared, so what is stored is only what the site uses.
const fieldSchema = z
  .object({
    id: optionalId,
    type: z.enum(FORM_FIELD_TYPE_KEYS, { error: 'نوع فیلد را انتخاب کنید.' }),
    label: translatedText('عنوان فیلد', 255, { required: true }),
    help: translatedText('راهنمای فیلد', 1000),
    isRequired: flag,
    isMultiple: flag,
    isMultiline: flag,
    options: z.array(optionSchema).max(MAX_OPTIONS, { error: `حداکثر ${MAX_OPTIONS.toLocaleString('fa-IR')} گزینه.` }).default([]),
  })
  .superRefine((field, context) => {
    if (field.type !== 'select') return;
    if (field.options.length === 0) context.addIssue({ code: 'custom', path: ['options'], message: 'برای فیلد چند گزینه‌ای دست‌کم یک گزینه تعریف کنید.' });
    const seen = new Map<string, number>();
    field.options.forEach((option, index) => {
      if (seen.has(option.value)) context.addIssue({ code: 'custom', path: ['options', index, 'value'], message: `این مقدار در گزینه ${(seen.get(option.value)! + 1).toLocaleString('fa-IR')} هم آمده است؛ مقدار هر گزینه باید یکتا باشد.` });
      else seen.set(option.value, index);
    });
  })
  .transform((field) => ({
    ...field,
    isMultiple: field.type === 'select' && field.isMultiple,
    isMultiline: field.type === 'text' && field.isMultiline,
    options: field.type === 'select' ? field.options : [],
  }));

export const serviceFormSchema = z.object({
  serviceId: id('خدمت'),
  fields: z.array(fieldSchema).max(MAX_FIELDS, { error: `حداکثر ${MAX_FIELDS.toLocaleString('fa-IR')} فیلد.` }).default([]),
});

export type ServiceFormInput = z.input<typeof serviceFormSchema>;
