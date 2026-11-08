import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceDetailView } from '../../../../components/services/ServiceDetailView';
import { getCurrencies, getServiceBySlug, getServices, getSettings } from '../../../../modules/site/queries';
import { getI18n, pageMetadata } from '../../../../i18n/metadata';
import { currentLocale } from '../../../../i18n/server';
import { localePath } from '../../../../i18n/config';
import { JsonLd } from '../../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../../components/seo/breadcrumbs';
import { absoluteUrl, siteUrl } from '../../../../lib/seo';

// The service whose page carries the transfer calculator.
const CURRENCY_SERVICE_SLUG = 'currency-exchange-swift';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(decodeURIComponent((await params).slug));
  return service ? pageMetadata(`/services/${service.slug}`, service.title, service.summary || service.description, { image: service.image }) : {};
}

export default async function Page({ params }: Props) {
  const service = await getServiceBySlug(decodeURIComponent((await params).slug));
  if (!service) notFound();

  const [services, currencies, settings, { t }, locale, base] = await Promise.all([
    getServices(),
    service.slug === CURRENCY_SERVICE_SLUG ? getCurrencies() : null,
    getSettings(),
    getI18n(),
    currentLocale(),
    siteUrl(),
  ]);

  const url = absoluteUrl(base, localePath(locale, `/services/${service.slug}`));
  const structured: unknown[] = [
    await breadcrumbs([
      [t.common.meta.services, '/services'],
      [service.shortTitle || service.title, `/services/${service.slug}`],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url}#service`,
      name: service.title,
      alternateName: service.shortTitle || undefined,
      description: service.summary || service.description,
      serviceType: service.categoryLabel,
      url,
      image: service.image ? absoluteUrl(base, service.image) : undefined,
      provider: { '@id': `${base}/#organization` },
      areaServed: [
        { '@type': 'Country', name: 'Iran' },
        { '@type': 'Country', name: 'Turkey' },
      ],
      hasOfferCatalog: service.features.length
        ? {
            '@type': 'OfferCatalog',
            name: service.title,
            itemListElement: service.features.map((feature) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: feature } })),
          }
        : undefined,
    },
  ];
  if (service.faqs.length) {
    structured.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
    });
  }

  // Related means the same kind of work first, then the rest of the catalog
  const relatedServices = [
    ...services.filter((s) => s.slug !== service.slug && s.category === service.category),
    ...services.filter((s) => s.slug !== service.slug && s.category !== service.category),
  ].slice(0, 3);

  return (
    <>
      <JsonLd data={structured} />
      <ServiceDetailView
      service={service}
      relatedServices={relatedServices}
      currencies={currencies ? { rates: currencies, feePercent: Number(settings.currency_fee_percent) || 0 } : undefined}
    />
    </>
  );
}
