import { ConsultationPage } from '../../../components/consultation/ConsultationPage';
import { getServiceGroups, getServices } from '../../../modules/site/queries';
import { getI18n, pageMetadata } from '../../../i18n/metadata';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/consultation', t.common.meta.consultation);
}

export default async function Page() {
  const [services, groups] = await Promise.all([getServices(), getServiceGroups()]);
  return <ConsultationPage services={services.map(({ id, slug, shortTitle }) => ({ id, slug, shortTitle }))} groups={groups} />;
}
