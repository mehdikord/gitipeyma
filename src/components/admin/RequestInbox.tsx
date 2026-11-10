'use client';

import React, { useEffect, useState } from 'react';
import { Copy, Eye, PhoneCall, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ActionResult } from '../../lib/actions';
import type { RequestStatus } from '../../generated/prisma/enums';
import { REQUEST_STATUSES, requestStatus } from '../../modules/serviceRequests/statuses';
import { formatDateTime } from '../../lib/format';
import { telHref } from '../../utils/contact';
import { Badge } from './ui/Badge';
import { Button, IconButton } from './ui/Button';
import { useConfirm } from './ui/Confirm';
import { Column, DataTable } from './ui/DataTable';
import { FormAlert, Select, TextArea } from './ui/fields';
import { Modal } from './ui/Modal';
import { Pagination } from './ui/Pagination';
import { useToast } from './ui/Toast';
import { useForm } from './ui/useForm';

export type InboxRow = {
  id: number;
  name: string;
  phone: string;
  // Requests with a free-text box (consultations); service requests show their form answers instead.
  description?: string | null;
  status: RequestStatus;
  // The single internal note of a consultation; service requests keep a list of notes instead (notes prop).
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
};

type RequestInboxProps<R extends InboxRow> = {
  rows: R[];
  pagination: { page: number; pages: number; total: number; perPage: number };
  // Columns between the applicant and the status, e.g. the service.
  columns: Column<R>[];
  // Extra lines in the detail modal, e.g. the service and the call time.
  details: (row: R) => { label: string; value: React.ReactNode }[];
  // What the applicant wrote, under the details. By default their description.
  body?: (row: R) => React.ReactNode;
  update: (input: { id: number; status: RequestStatus; adminNote: string }) => Promise<ActionResult<unknown>>;
  // Left out when this admin may not delete requests
  remove?: (id: number) => Promise<ActionResult<unknown>>;
  // The team's notes on a request, in place of the single note box
  notes?: (row: R) => React.ReactNode;
  // A request opened from a link (?open=12), even when it is not on this page of the list.
  initialOpen?: R | null;
  emptyText: string;
  modalSize?: 'lg' | 'xl';
};

const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 text-sm">
    <dt className="text-[#5F7177]">{label}</dt>
    <dd className="min-w-0 font-bold text-[#14282D]">{children}</dd>
  </div>
);

export function RequestInbox<R extends InboxRow>({ rows, pagination, columns, details, body, update, remove, notes, initialOpen, emptyText, modalSize = 'lg' }: RequestInboxProps<R>) {
  const [picked, setSelected] = useState<R | null>(initialOpen ?? null);
  // The open request as the server last sent it, so a saved note or status shows without closing it
  const selected = picked ? (rows.find((row) => row.id === picked.id) ?? (initialOpen?.id === picked.id ? initialOpen : null) ?? picked) : null;
  const form = useForm({ status: 'pending' as RequestStatus, adminNote: '' });
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (selected) form.reset({ status: selected.status, adminNote: selected.adminNote ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const close = () => {
    setSelected(null);
    // Drop ?open= so a refresh doesn't reopen it
    if (searchParams.has('open')) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('open');
      router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
    }
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    form.submit(() => update({ id: selected.id, ...form.values }), { onSuccess: close });
  };

  const handleDelete = async (row: R) => {
    if (!remove) return;
    const agreed = await confirm({ title: 'حذف درخواست', message: `درخواست «${row.name}» برای همیشه حذف شود؟` });
    if (!agreed) return;
    const result = await remove(row.id);
    if (result.ok) {
      toast.success(result.message ?? 'حذف شد.');
      if (selected?.id === row.id) close();
    } else toast.error(result.message ?? 'حذف انجام نشد.');
  };

  const allColumns: Column<R>[] = [
    { key: 'id', header: '#', className: 'w-14 text-[#5F7177]', cell: (row) => row.id.toLocaleString('fa-IR', { useGrouping: false }) },
    {
      key: 'person',
      header: 'متقاضی',
      cell: (row) => (
        <>
          <span className="block">{row.name}</span>
          <span dir="ltr" className="block text-xs font-normal text-[#5F7177]">
            {row.phone}
          </span>
        </>
      ),
    },
    ...columns,
    {
      key: 'status',
      header: 'وضعیت',
      cell: (row) => {
        const status = requestStatus(row.status);
        return <Badge tone={status.tone}>{status.label}</Badge>;
      },
    },
    { key: 'createdAt', header: 'تاریخ ثبت', hideOnMobile: true, className: 'whitespace-nowrap text-xs font-normal text-[#5F7177]', cell: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <>
      <DataTable
        rows={rows}
        columns={allColumns}
        rowKey={(row) => row.id}
        onRowClick={setSelected}
        highlight={(row) => row.status === 'pending'}
        emptyText={emptyText}
        actions={(row) => (
          <>
            <IconButton label="مشاهده و رسیدگی" icon={Eye} onClick={() => setSelected(row)} />
            {remove && <IconButton label="حذف" icon={Trash2} tone="danger" onClick={() => handleDelete(row)} />}
          </>
        )}
      />
      <Pagination {...pagination} />

      <Modal
        open={selected !== null}
        onClose={() => !form.pending && close()}
        title={selected ? `درخواست شماره ${selected.id.toLocaleString('fa-IR', { useGrouping: false })}` : ''}
        description={selected ? `ثبت‌شده در ${formatDateTime(selected.createdAt)}` : undefined}
        size={modalSize}
        onSubmit={save}
        footer={
          selected && (
            <>
              {remove && (
                <Button variant="ghost" icon={Trash2} className="ml-auto text-[#B91C1C]" onClick={() => handleDelete(selected)} disabled={form.pending}>
                  حذف
                </Button>
              )}
              <Button variant="secondary" onClick={close} disabled={form.pending}>
                بستن
              </Button>
              <Button type="submit" loading={form.pending}>
                ذخیره وضعیت
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <div className="md:col-span-3">
              <dl className="divide-y divide-[#EEF2F3]">
                <Detail label="نام">{selected.name}</Detail>
                <Detail label="شماره تماس">
                  <span className="flex flex-wrap items-center gap-2">
                    <a dir="ltr" href={telHref(selected.phone)} className="text-[#0B7A75] hover:underline">
                      {selected.phone}
                    </a>
                    <IconButton
                      label="کپی شماره"
                      icon={Copy}
                      onClick={() => {
                        navigator.clipboard?.writeText(selected.phone);
                        toast.success('شماره کپی شد.');
                      }}
                    />
                    <a href={telHref(selected.phone)} title="تماس" aria-label="تماس" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#3F5257] hover:bg-[#EEF2F3]">
                      <PhoneCall className="h-4 w-4" />
                    </a>
                  </span>
                </Detail>
                {details(selected).map((item) => (
                  <Detail key={item.label} label={item.label}>
                    {item.value}
                  </Detail>
                ))}
                {selected.updatedAt !== selected.createdAt && <Detail label="آخرین تغییر">{formatDateTime(selected.updatedAt)}</Detail>}
              </dl>
              {body ? (
                body(selected)
              ) : (
                <div className="mt-4">
                  <p className="mb-1.5 text-[13px] text-[#5F7177]">توضیحات متقاضی</p>
                  <p className="whitespace-pre-line rounded-lg bg-[#F4F6F7] px-4 py-3 text-sm leading-7 text-[#14282D]">{selected.description || 'توضیحی نوشته نشده است.'}</p>
                </div>
              )}
            </div>

            <div className="space-y-4 md:col-span-2 md:border-r md:border-[#EEF2F3] md:pr-6">
              <FormAlert message={form.formError} />
              <Select
                label="وضعیت رسیدگی"
                value={form.values.status}
                onChange={(value) => form.set('status', value as RequestStatus)}
                options={REQUEST_STATUSES.map((status) => ({ value: status.key, label: status.label }))}
                error={form.errors.status}
              />
              {notes ? (
                notes(selected)
              ) : (
                <TextArea
                  label="یادداشت داخلی"
                  hint="فقط مدیران می‌بینند؛ مثلاً نتیجه تماس یا قدم بعدی."
                  rows={6}
                  value={form.values.adminNote}
                  onChange={(value) => form.set('adminNote', value)}
                  error={form.errors.adminNote}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
