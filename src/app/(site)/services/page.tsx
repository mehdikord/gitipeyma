import { ServicesDirectory } from '../../../components/services/ServicesDirectory';
import { getServiceCategories, getServices } from '../../../modules/site/queries';

export default async function Page() {
  const [services, categories] = await Promise.all([getServices(), getServiceCategories()]);
  return <ServicesDirectory services={services} categories={categories} />;
}
