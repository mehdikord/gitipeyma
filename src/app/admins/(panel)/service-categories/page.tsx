import type { Metadata } from 'next';
import { listServiceCategories } from '../../../../modules/serviceCategories/queries';
import { ServiceCategoriesManager } from './ServiceCategoriesManager';

export const metadata: Metadata = { title: 'دسته‌بندی خدمات' };

export default async function ServiceCategoriesPage() {
  return <ServiceCategoriesManager rows={await listServiceCategories()} />;
}
