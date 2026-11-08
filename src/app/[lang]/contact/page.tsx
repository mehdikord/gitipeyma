import { ContactPage } from '../../../components/contact/ContactPage';
import { getI18n, pageMetadata } from '../../../i18n/metadata';
import { JsonLd } from '../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../components/seo/breadcrumbs';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/contact', t.common.meta.contact);
}

export default async function Page() {
  const { t } = await getI18n();
  return (
    <>
      <JsonLd data={await breadcrumbs([[t.common.meta.contact, '/contact']])} />
      <ContactPage />
    </>
  );
}
