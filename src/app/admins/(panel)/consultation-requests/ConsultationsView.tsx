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

const topic = (row: ConsultationRow) => row.service?.title ?? 'مشاوره عمومی (هنوز نمی‌داند)';

export const ConsultationsView: React.FC<{ list: Paginated<ConsultationRow> & { opened: ConsultationRow | null }; services: Option[] }> = ({ list, services }) => (
  <>
    <PageHeader title="درخواست مشاوره" description="درخواست‌های صفحه مشاوره، با موضوع و زمانی که متقاضی برای تماس خواسته است." />
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
        { key: 'callTime', header: 'زمان تماس', hideOnMobile: true, cell: (row) => <span className="font-normal">{callTimeText(row.callTime)}</span> },
      ]}
      details={(row) => [
        { label: 'موضوع', value: topic(row) },
        { label: 'زمان تماس', value: callTimeText(row.callTime) },
      ]}
    />
  </>
);
