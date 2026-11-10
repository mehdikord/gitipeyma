import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, fa, Translated } from '../../i18n/translated';
import { asOptions, FormFieldType } from './fields';

export type FormFieldAdminRow = {
  id: number;
  type: FormFieldType;
  label: Translated;
  help: Translated;
  isRequired: boolean;
  isMultiple: boolean;
  isMultiline: boolean;
  options: { value: string; label: Translated }[];
};

export type ServiceFormAdmin = {
  service: { id: number; title: string; slug: string; isActive: boolean; requestCount: number };
  fields: FormFieldAdminRow[];
};

/** A service's form for the builder in the panel; null when there is no such service. */
export async function getServiceFormForAdmin(serviceId: number): Promise<ServiceFormAdmin | null> {
  await requireRoot();
  if (!Number.isInteger(serviceId) || serviceId <= 0) return null;
  const service = await db.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      shortTitle: true,
      slug: true,
      isActive: true,
      formFields: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
      _count: { select: { requests: true } },
    },
  });
  if (!service) return null;

  return {
    service: { id: Number(service.id), title: fa(service.shortTitle), slug: service.slug, isActive: service.isActive, requestCount: service._count.requests },
    fields: service.formFields.map((field) => ({
      id: Number(field.id),
      type: field.type,
      label: asTranslated(field.label),
      help: asTranslated(field.help),
      isRequired: field.isRequired,
      isMultiple: field.isMultiple,
      isMultiline: field.isMultiline,
      options: asOptions(field.options).map((option) => ({ value: option.value, label: asTranslated(option.label) })),
    })),
  };
}
