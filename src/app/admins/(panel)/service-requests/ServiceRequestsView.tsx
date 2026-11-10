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
import { RequestNotes } from './RequestNotes';

// The visitor's answers to the service's form, one line each: "label : value".
const Answers: React.FC<{ row: ServiceRequestRow }> = ({ row }) => (
  <div className="mt-4">
    <p className="mb-1.5 text-[13px] text-[#5F7177]">اطلاعات فرم خدمت</p>
    {row.answers.length === 0 ? (
      <p className="rounded-lg bg-[#F4F6F7] px-4 py-3 text-sm text-[#5F7177]">این درخواست اطلاعات دیگری جز نام و شماره تماس ندارد.</p>
    ) : (
      <dl className="divide-y divide-[#E3E8EA] rounded-lg bg-[#F4F6F7] px-4">
        {row.answers.map((answer, index) => (
          <div key={index} className="flex flex-col gap-1 py-2.5 text-sm sm:flex-row sm:gap-2">
            <dt className="shrink-0 text-[#5F7177] sm:max-w-[45%]">{answer.label} :</dt>
            <dd className={`min-w-0 whitespace-pre-line break-words font-bold leading-7 ${answer.value === '—' ? 'text-[#94A3A8]' : 'text-[#14282D]'}`}>{answer.value}</dd>
          </div>
        ))}
      </dl>
    )}
  </div>
);

// A root admin sees every request; an internal admin only those of their services (the query
// already limits them), and cannot delete.
export const ServiceRequestsView: React.FC<{ list: Paginated<ServiceRequestRow> & { opened: ServiceRequestRow | null }; services: Option[]; isRoot: boolean }> = ({
  list,
  services,
  isRoot,
}) => (
  <>
    <PageHeader
      title="درخواست خدمات"
      description={
        isRoot
          ? 'درخواست‌هایی که بازدیدکنندگان با فرم صفحه هر خدمت ثبت کرده‌اند: نام، شماره تماس و پاسخ به پرسش‌های فرم همان خدمت.'
          : `درخواست‌های ثبت‌شده برای خدماتی که به شما سپرده شده است${services.length ? `: ${services.map((service) => service.label).join('، ')}` : '.'}`
      }
    />
    {!isRoot && services.length === 0 && (
      <p className="mb-4 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">هنوز هیچ خدمتی به شما سپرده نشده است؛ برای دیدن درخواست‌ها با مدیر کل هماهنگ کنید.</p>
    )}
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
      remove={isRoot ? deleteServiceRequest : undefined}
      modalSize="xl"
      notes={(row) => <RequestNotes requestId={row.id} notes={row.notes} />}
      columns={[{ key: 'service', header: 'خدمت', cell: (row) => <span className="font-normal">{row.service.title}</span> }]}
      details={(row) => [
        {
          label: 'خدمت',
          value: (
            <Link href={`/fa/services/${row.service.slug}`} target="_blank" className="inline-flex items-center gap-1 text-[#0B7A75] hover:underline">
              {row.service.title}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ),
        },
      ]}
      body={(row) => <Answers row={row} />}
    />
  </>
);
