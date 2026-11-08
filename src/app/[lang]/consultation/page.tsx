import { ConsultationPage } from '../../../components/consultation/ConsultationPage';
import { getServiceGroups, getServices } from '../../../modules/site/queries';
import { getI18n, pageMetadata } from '../../../i18n/metadata';
import { JsonLd } from '../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../components/seo/breadcrumbs';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/consultation', t.common.meta.consultation);
}

export default async function Page() {
  const [services, groups, { t }] = await Promise.all([getServices(), getServiceGroups(), getI18n()]);
  return (
    <>
      <JsonLd data={await breadcrumbs([[t.common.meta.consultation, '/consultation']])} />
      <ConsultationPage services={services.map(({ id, slug, shortTitle }) => ({ id, slug, shortTitle }))} groups={groups} />
    </>
  );
}
