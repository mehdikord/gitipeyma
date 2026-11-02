import type { Metadata } from 'next';
import { listConsultations } from '../../../../modules/consultations/queries';
import { serviceOptions } from '../../../../modules/serviceRequests/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { ConsultationsView } from './ConsultationsView';

export const metadata: Metadata = { title: 'درخواست مشاوره' };

export default async function ConsultationRequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [list, services] = await Promise.all([listConsultations(params), serviceOptions()]);
  return <ConsultationsView list={list} services={services} />;
}
