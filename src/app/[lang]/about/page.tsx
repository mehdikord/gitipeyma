import { AboutPage } from '../../../components/about/AboutPage';
import { getI18n, pageMetadata } from '../../../i18n/metadata';
import { JsonLd } from '../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../components/seo/breadcrumbs';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/about', t.common.meta.about);
}

export default async function Page() {
  const { t } = await getI18n();
  return (
    <>
      <JsonLd data={await breadcrumbs([[t.common.meta.about, '/about']])} />
      <AboutPage />
    </>
  );
}
