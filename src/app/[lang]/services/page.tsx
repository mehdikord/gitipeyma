import { ServicesDirectory } from '../../../components/services/ServicesDirectory';
import { getServiceCategories, getServices } from '../../../modules/site/queries';
import { getI18n, pageMetadata } from '../../../i18n/metadata';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/services', t.common.meta.services);
}

export default async function Page() {
  const [services, categories] = await Promise.all([getServices(), getServiceCategories()]);
  return <ServicesDirectory services={services} categories={categories} />;
}
