import 'server-only';
import { localePath } from '../../i18n/config';
import { currentLocale, getI18n } from '../../i18n/server';
import { absoluteUrl, siteUrl } from '../../lib/seo';

/** BreadcrumbList from Home to a page: [["Services", "/services"], ["Visa", "/services/visa"]]. */
export async function breadcrumbs(trail: [name: string, path: string][]) {
  const [locale, { t }, base] = await Promise.all([currentLocale(), getI18n(), siteUrl()]);
  const items: [string, string][] = [[t.layout.header.nav.home, '/'], ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(base, localePath(locale, path)),
    })),
  };
}
