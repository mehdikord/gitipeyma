'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Eye, Mail, MailOpen, PhoneCall, Trash2 } from 'lucide-react';
import type { ContactMessageRow } from '../../../../modules/contactMessages/queries';
import type { Paginated } from '../../../../lib/pagination';
import { deleteContactMessage, setContactMessageRead } from '../../../../modules/contactMessages/actions';
import { CONTACT_TOPICS } from '../../../../modules/contactMessages/topics';
import { formatDateTime } from '../../../../lib/format';
import { telHref } from '../../../../utils/contact';
import { Badge } from '../../../../components/admin/ui/Badge';
import { Button, IconButton } from '../../../../components/admin/ui/Button';
import { useConfirm } from '../../../../components/admin/ui/Confirm';
import { DataTable } from '../../../../components/admin/ui/DataTable';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import { Modal } from '../../../../components/admin/ui/Modal';
import { PageHeader } from '../../../../components/admin/ui/PageHeader';
import { Pagination } from '../../../../components/admin/ui/Pagination';
import { useToast } from '../../../../components/admin/ui/Toast';

export const ContactMessagesView: React.FC<{ list: Paginated<ContactMessageRow> & { opened: ContactMessageRow | null } }> = ({ list }) => {
  const [selected, setSelected] = useState<ContactMessageRow | null>(list.opened);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Opening a message marks it read
  useEffect(() => {
    if (selected && !selected.readAt) setContactMessageRead(selected.id, true);
  }, [selected]);

  const close = () => {
    setSelected(null);
    if (searchParams.has('open')) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('open');
      router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
    }
  };

  const toggleRead = async (row: ContactMessageRow) => {
    const result = await setContactMessageRead(row.id, !row.readAt);
    if (result.ok) toast.success(result.message ?? 'انجام شد.');
    else toast.error(result.message ?? 'انجام نشد.');
  };

  const handleDelete = async (row: ContactMessageRow) => {
    if (!(await confirm({ title: 'حذف پیام', message: `پیام «${row.name}» برای همیشه حذف شود؟` }))) return;
    const result = await deleteContactMessage(row.id);
    if (result.ok) {
      toast.success(result.message ?? 'حذف شد.');
      if (selected?.id === row.id) close();
    } else toast.error(result.message ?? 'حذف انجام نشد.');
  };

  return (
    <>
      <PageHeader title="پیام‌های تماس" description="پیام‌هایی که از فرم صفحه «ارتباط با ما» رسیده است." />
      <FilterBar
        searchPlaceholder="جستجوی نام یا شماره تماس"
        filters={[
          { name: 'state', label: 'وضعیت', options: [{ value: 'unread', label: 'خوانده‌نشده' }, { value: 'read', label: 'خوانده‌شده' }] },
          { name: 'topic', label: 'موضوع', options: CONTACT_TOPICS.map((topic) => ({ value: topic, label: topic })) },
        ]}
      />
      <DataTable
        rows={list.rows}
        rowKey={(row) => row.id}
        onRowClick={setSelected}
        highlight={(row) => !row.readAt}
        emptyText="پیامی با این مشخصات پیدا نشد."
        columns={[
          {
            key: 'person',
            header: 'فرستنده',
            cell: (row) => (
              <>
                <span className="block">{row.name}</span>
                <span dir="ltr" className="block text-xs font-normal text-[#5F7177]">
                  {row.phone}
                </span>
              </>
            ),
          },
          { key: 'topic', header: 'موضوع', hideOnMobile: true, cell: (row) => <span className="font-normal">{row.topic ?? '—'}</span> },
          { key: 'message', header: 'پیام', cell: (row) => <span className="line-clamp-1 max-w-sm font-normal text-[#3F5257]">{row.message}</span> },
          { key: 'state', header: 'وضعیت', cell: (row) => (row.readAt ? <Badge>خوانده‌شده</Badge> : <Badge tone="amber">جدید</Badge>) },
          { key: 'createdAt', header: 'تاریخ', hideOnMobile: true, className: 'whitespace-nowrap text-xs font-normal text-[#5F7177]', cell: (row) => formatDateTime(row.createdAt) },
        ]}
        actions={(row) => (
          <>
            <IconButton label="مشاهده" icon={Eye} onClick={() => setSelected(row)} />
            <IconButton label={row.readAt ? 'علامت خوانده‌نشده' : 'علامت خوانده‌شده'} icon={row.readAt ? Mail : MailOpen} onClick={() => toggleRead(row)} />
            <IconButton label="حذف" icon={Trash2} tone="danger" onClick={() => handleDelete(row)} />
          </>
        )}
      />
      <Pagination {...list} />

      <Modal
        open={selected !== null}
        onClose={close}
        size="md"
        title={selected ? `پیام ${selected.name}` : ''}
        description={selected ? formatDateTime(selected.createdAt) : undefined}
        footer={
          selected && (
            <>
              <Button variant="ghost" icon={Trash2} className="ml-auto text-[#B91C1C]" onClick={() => handleDelete(selected)}>
                حذف
              </Button>
              <a href={telHref(selected.phone)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B7A75] px-4 text-sm font-bold text-white hover:bg-[#096762]">
                <PhoneCall className="h-4 w-4" />
                تماس
              </a>
              <Button variant="secondary" onClick={close}>
                بستن
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <p>
                <span className="text-[#5F7177]">شماره تماس: </span>
                <a dir="ltr" href={telHref(selected.phone)} className="font-bold text-[#0B7A75] hover:underline">
                  {selected.phone}
                </a>
              </p>
              <p>
                <span className="text-[#5F7177]">موضوع: </span>
                <span className="font-bold">{selected.topic ?? 'بدون موضوع'}</span>
              </p>
            </div>
            <p className="whitespace-pre-line rounded-lg bg-[#F4F6F7] px-4 py-3 leading-7">{selected.message}</p>
          </div>
        )}
      </Modal>
    </>
  );
};
