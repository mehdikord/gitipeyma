import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceFormForAdmin } from '../../../../../../modules/serviceForms/queries';
import { ServiceFormBuilder } from './ServiceFormBuilder';

export const metadata: Metadata = { title: 'مدیریت فرم خدمت' };

export default async function ServiceFormPage({ params }: { params: Promise<{ id: string }> }) {
  const form = await getServiceFormForAdmin(Number((await params).id));
  if (!form) notFound();
  return <ServiceFormBuilder key={form.service.id} form={form} />;
}
