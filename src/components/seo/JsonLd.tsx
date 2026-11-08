import { jsonLd } from '../../lib/seo';

/** Structured data for one page (breadcrumbs, a service, its FAQ). */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />;
}
