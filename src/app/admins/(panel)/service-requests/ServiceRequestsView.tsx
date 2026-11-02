'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { ServiceRequestRow } from '../../../../modules/serviceRequests/queries';
import type { Paginated } from '../../../../lib/pagination';
import { deleteServiceRequest, updateServiceRequest } from '../../../../modules/serviceRequests/actions';
import { REQUEST_STATUSES } from '../../../../modules/serviceRequests/statuses';
import { RequestInbox } from '../../../../components/admin/RequestInbox';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import type { Option } from '../../../../components/admin/ui/fields';

export const ServiceRequestsView: React.FC<{ list: Paginated<ServiceRequestRow> & { opened: ServiceRequestRow | null }; services: Option[] }> = ({ list, services }) => (
  <>
    <PageHeader title="درخواست خدمات" description="درخواست‌هایی که بازدیدکنندگان از صفحه هر خدمت ثبت کرده‌اند: نام، شماره تماس و توضیحات." />
    <FilterBar
      searchPlaceholder="جستجوی نام یا شماره تماس"
      filters={[
        { name: 'status', label: 'وضعیت', options: REQUEST_STATUSES.map((status) => ({ value: status.key, label: status.label })) },
        { name: 'service', label: 'خدمت', options: services },
      ]}
    />
    <RequestInbox
      rows={list.rows}
      pagination={list}
      initialOpen={list.opened}
      emptyText="درخواستی با این مشخصات پیدا نشد."
      update={updateServiceRequest}
      remove={deleteServiceRequest}
      columns={[{ key: 'service', header: 'خدمت', cell: (row) => <span className="font-normal">{row.service.title}</span> }]}
      details={(row) => [
        {
          label: 'خدمت',
          value: (
            <Link href={`/services/${row.service.slug}`} target="_blank" className="inline-flex items-center gap-1 text-[#0B7A75] hover:underline">
              {row.service.title}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ),
        },
      ]}
    />
  </>
);
