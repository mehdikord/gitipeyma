import type { Metadata } from 'next';
import { categoryOptions, groupOptions, listServicesForAdmin } from '../../../../modules/services/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { ServicesManager } from './ServicesManager';

export const metadata: Metadata = { title: 'خدمات' };

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [services, categories, groups] = await Promise.all([listServicesForAdmin(params), categoryOptions(), groupOptions()]);
  return <ServicesManager services={services} categories={categories} groups={groups} />;
}
