import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceDetailView } from '../../../../components/services/ServiceDetailView';
import { getCurrencies, getServiceBySlug, getServices, getSettings } from '../../../../modules/site/queries';
import { pageMetadata } from '../../../../i18n/metadata';

// The service whose page carries the transfer calculator.
const CURRENCY_SERVICE_SLUG = 'currency-exchange-swift';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(decodeURIComponent((await params).slug));
  return service ? pageMetadata(`/services/${service.slug}`, service.title, service.summary) : {};
}

export default async function Page({ params }: Props) {
  const service = await getServiceBySlug(decodeURIComponent((await params).slug));
  if (!service) notFound();

  const [services, currencies, settings] = await Promise.all([
    getServices(),
    service.slug === CURRENCY_SERVICE_SLUG ? getCurrencies() : null,
    getSettings(),
  ]);

  // Related means the same kind of work first, then the rest of the catalog
  const relatedServices = [
    ...services.filter((s) => s.slug !== service.slug && s.category === service.category),
    ...services.filter((s) => s.slug !== service.slug && s.category !== service.category),
  ].slice(0, 3);

  return (
    <ServiceDetailView
      service={service}
      relatedServices={relatedServices}
      currencies={currencies ? { rates: currencies, feePercent: Number(settings.currency_fee_percent) || 0 } : undefined}
    />
  );
}
