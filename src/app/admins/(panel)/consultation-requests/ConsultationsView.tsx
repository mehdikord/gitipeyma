'use client';

import React from 'react';
import type { ConsultationRow } from '../../../../modules/consultations/queries';
import type { Paginated } from '../../../../lib/pagination';
import { deleteConsultation, updateConsultation } from '../../../../modules/consultations/actions';
import { callTimeText } from '../../../../modules/consultations/callTimes';
import { REQUEST_STATUSES } from '../../../../modules/serviceRequests/statuses';
import { RequestInbox } from '../../../../components/admin/RequestInbox';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import type { Option } from '../../../../components/admin/ui/fields';

const topic = (row: ConsultationRow) => row.service?.title ?? 'مشاوره عمومی';
// Only requests from the old three-step form chose a call time.
const callTime = (row: ConsultationRow) => (row.callTime ? callTimeText(row.callTime) : '—');

export const ConsultationsView: React.FC<{ list: Paginated<ConsultationRow> & { opened: ConsultationRow | null }; services: Option[] }> = ({ list, services }) => (
  <>
    <PageHeader title="درخواست مشاوره" description="درخواست‌های صفحه مشاوره: نام، شماره تماس و پیام متقاضی." />
    <FilterBar
      searchPlaceholder="جستجوی نام یا شماره تماس"
      filters={[
        { name: 'status', label: 'وضعیت', options: REQUEST_STATUSES.map((status) => ({ value: status.key, label: status.label })) },
        { name: 'service', label: 'موضوع', options: [{ value: 'general', label: 'مشاوره عمومی' }, ...services] },
      ]}
    />
    <RequestInbox
      rows={list.rows}
      pagination={list}
      initialOpen={list.opened}
      emptyText="درخواست مشاوره‌ای با این مشخصات پیدا نشد."
      update={updateConsultation}
      remove={deleteConsultation}
      columns={[
        { key: 'topic', header: 'موضوع', cell: (row) => <span className="font-normal">{topic(row)}</span> },
        { key: 'callTime', header: 'زمان تماس', hideOnMobile: true, cell: (row) => <span className="font-normal">{callTime(row)}</span> },
      ]}
      details={(row) => [
        { label: 'موضوع', value: topic(row) },
        ...(row.callTime ? [{ label: 'زمان تماس', value: callTime(row) }] : []),
      ]}
    />
  </>
);
