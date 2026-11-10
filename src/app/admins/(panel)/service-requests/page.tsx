import type { Metadata } from 'next';
import { listServiceRequests, serviceOptions } from '../../../../modules/serviceRequests/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { ServiceRequestsView } from './ServiceRequestsView';
import { requireAdmin } from '../../../../lib/auth/currentAdmin';

export const metadata: Metadata = { title: 'درخواست خدمات' };

export default async function ServiceRequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  // Root and internal admins both work here; the queries limit an internal admin to their services
  const [admin, list, services] = await Promise.all([requireAdmin(), listServiceRequests(params), serviceOptions()]);
  return <ServiceRequestsView list={list} services={services} isRoot={admin.isRoot} />;
}
