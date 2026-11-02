import { ConsultationPage } from '../../../components/consultation/ConsultationPage';
import { getServiceGroups, getServices } from '../../../modules/site/queries';

export default async function Page() {
  const [services, groups] = await Promise.all([getServices(), getServiceGroups()]);
  return <ConsultationPage services={services.map(({ id, slug, shortTitle }) => ({ id, slug, shortTitle }))} groups={groups} />;
}
