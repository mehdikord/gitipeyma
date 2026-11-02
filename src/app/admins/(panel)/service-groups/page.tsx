import type { Metadata } from 'next';
import { listServiceGroups } from '../../../../modules/serviceGroups/queries';
import { ServiceGroupsManager } from './ServiceGroupsManager';

export const metadata: Metadata = { title: 'گروه‌های صفحه اصلی' };

export default async function ServiceGroupsPage() {
  return <ServiceGroupsManager rows={await listServiceGroups()} />;
}
