import { pick, pickOrNull } from '../../i18n/translated';
import type { Locale } from '../../i18n/config';
import type { ServiceFormField } from '../../generated/prisma/client';
import { asOptions, PublicFormField } from './fields';

/** A stored question in the visitor's language, as the service page and the submit check read it. */
export const publicFormField = (row: ServiceFormField, locale: Locale): PublicFormField => ({
  id: Number(row.id),
  type: row.type,
  label: pick(row.label, locale),
  help: pickOrNull(row.help, locale),
  required: row.isRequired,
  multiple: row.type === 'select' && row.isMultiple,
  multiline: row.type === 'text' && row.isMultiline,
  options: row.type === 'select' ? asOptions(row.options).map((option) => ({ value: option.value, label: pick(option.label, locale) || option.value })) : [],
});
