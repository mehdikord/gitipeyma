import { getSiteData } from '../../modules/site/queries';
import { currentLocale, getI18n } from '../../i18n/server';
import { LOCALE_INFO, localePath } from '../../i18n/config';
import { absoluteUrl, jsonLd, siteUrl } from '../../lib/seo';

// Who runs the site, for Google's knowledge panel and rich results: the agency, its offices,
// phone numbers and social profiles, plus the site itself. Rendered once per page by the layout.
export async function OrganizationJsonLd() {
  const [{ settings, offices, socials }, locale, { t }, base] = await Promise.all([getSiteData(), currentLocale(), getI18n(), siteUrl()]);
  const home = absoluteUrl(base, localePath(locale));
  const orgId = `${base}/#organization`;
  const phone = settings.support_phone;

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': orgId,
        name: t.common.brand,
        alternateName: ['Royal Travel', 'رویال تراول'],
        url: home,
        logo: absoluteUrl(base, '/apple-icon.png'),
        image: absoluteUrl(base, '/images/about/istanbul-galata.webp'),
        description: t.common.meta.description,
        telephone: phone,
        email: offices.find((office) => office.email)?.email ?? undefined,
        areaServed: [
          { '@type': 'Country', name: 'Iran' },
          { '@type': 'Country', name: 'Turkey' },
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: phone,
            contactType: 'customer support',
            availableLanguage: ['Persian', 'English', 'Turkish'],
            hoursAvailable: { '@type': 'OpeningHoursSpecification', opens: '00:00', closes: '23:59' },
          },
        ],
        department: offices.map((office) => ({
          '@type': 'TravelAgency',
          name: `${t.common.brand} — ${office.name}`,
          description: office.role || undefined,
          telephone: office.phones[0] ?? phone,
          email: office.email ?? undefined,
          address: { '@type': 'PostalAddress', streetAddress: office.address, addressCountry: office.country },
          geo: Number.isFinite(office.at[1]) && Number.isFinite(office.at[0]) ? { '@type': 'GeoCoordinates', latitude: office.at[1], longitude: office.at[0] } : undefined,
        })),
        sameAs: socials.map((social) => social.url).filter((url) => /^https?:\/\//i.test(url)),
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: home,
        name: t.common.brand,
        inLanguage: LOCALE_INFO[locale].intl,
        publisher: { '@id': orgId },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />;
}
