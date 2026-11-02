import type { Metadata } from 'next';
import { listTrustQuotes } from '../../../../modules/trustQuotes/queries';
import { TrustQuotesManager } from './TrustQuotesManager';

export const metadata: Metadata = { title: 'جملات کوتاه اعتماد' };

export default async function TrustQuotesPage() {
  return <TrustQuotesManager rows={await listTrustQuotes()} />;
}
