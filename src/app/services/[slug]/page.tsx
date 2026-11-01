import { ServiceDetailView } from '../../../components/services/ServiceDetailView';

// Unknown slugs fall back to the first service, so they must not be cached as generated pages.
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceDetailView slug={slug} />;
}
