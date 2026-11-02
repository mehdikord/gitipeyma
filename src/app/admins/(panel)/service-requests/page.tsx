import type { Metadata } from 'next';
import { listServiceRequests, serviceOptions } from '../../../../modules/serviceRequests/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { ServiceRequestsView } from './ServiceRequestsView';

export const metadata: Metadata = { title: 'درخواست خدمات' };

export default async function ServiceRequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [list, services] = await Promise.all([listServiceRequests(params), serviceOptions()]);
  return <ServiceRequestsView list={list} services={services} />;
}
