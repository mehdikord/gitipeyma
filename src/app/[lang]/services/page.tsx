import { ServicesDirectory } from '../../../components/services/ServicesDirectory';
import { getServiceCategories, getServices } from '../../../modules/site/queries';
import { getI18n, pageMetadata } from '../../../i18n/metadata';
import { currentLocale } from '../../../i18n/server';
import { localePath } from '../../../i18n/config';
import { JsonLd } from '../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../components/seo/breadcrumbs';
import { absoluteUrl, siteUrl } from '../../../lib/seo';

export async function generateMetadata() {
  const { t } = await getI18n();
  return pageMetadata('/services', t.common.meta.services);
}

export default async function Page() {
  const [services, categories, { t }, locale, base] = await Promise.all([getServices(), getServiceCategories(), getI18n(), currentLocale(), siteUrl()]);
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.common.meta.services,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: absoluteUrl(base, localePath(locale, `/services/${service.slug}`)),
    })),
  };
  return (
    <>
      <JsonLd data={[await breadcrumbs([[t.common.meta.services, '/services']]), list]} />
      <ServicesDirectory services={services} categories={categories} />
    </>
  );
}
