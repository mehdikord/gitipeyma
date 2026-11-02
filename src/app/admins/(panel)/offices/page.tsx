import type { Metadata } from 'next';
import { listOffices } from '../../../../modules/offices/queries';
import { OfficesManager } from './OfficesManager';

export const metadata: Metadata = { title: 'دفاتر' };

export default async function OfficesPage() {
  return <OfficesManager rows={await listOffices()} />;
}
