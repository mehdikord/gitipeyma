'use client';

import React from 'react';
import type { AdminRow } from '../../../../modules/admins/queries';
import { deleteAdmin, saveAdmin } from '../../../../modules/admins/actions';
import { formatDateTime } from '../../../../lib/format';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { Badge } from '../../../../components/admin/ui/Badge';
import { Button } from '../../../../components/admin/ui/Button';
import { CheckboxGroup, Option, TextInput } from '../../../../components/admin/ui/fields';

type Values = { name: string; phone: string; password: string; serviceIds: string[] };

const ServicesCell: React.FC<{ row: AdminRow }> = ({ row }) => {
  if (row.isRoot) return <span className="text-[#5F7177]">همه بخش‌ها</span>;
  if (row.services.length === 0) return <span className="text-[#B45309]">هیچ خدمتی؛ درخواستی نمی‌بیند</span>;
  const shown = row.services.slice(0, 3).map((service) => service.title).join('، ');
  const more = row.services.length - 3;
  return (
    <span title={row.services.map((service) => service.title).join('، ')}>
      {shown}
      {more > 0 && <span className="text-[#5F7177]"> و {more.toLocaleString('fa-IR')} خدمت دیگر</span>}
    </span>
  );
};

export const AdminsManager: React.FC<{ rows: AdminRow[]; services: Option[] }> = ({ rows, services }) => (
  <CrudManager<AdminRow, Values>
    title="مدیران"
    description="مدیر کل به همه بخش‌ها دسترسی دارد. مدیرانی که اینجا اضافه می‌کنید مدیر داخلی‌اند و فقط درخواست‌های خدماتی را می‌بینند و رسیدگی می‌کنند که برایشان انتخاب کنید."
    noun="مدیر داخلی"
    rows={rows}
    canEdit={(row) => !row.isRoot}
    canDelete={(row) => !row.isRoot && !row.isCurrent}
    columns={[
      {
        key: 'name',
        header: 'نام',
        cell: (row) => (
          <span className="flex items-center gap-2 font-bold">
            {row.name}
            {row.isCurrent && <Badge tone="teal">شما</Badge>}
          </span>
        ),
      },
      { key: 'role', header: 'نقش', cell: (row) => (row.isRoot ? <Badge tone="amber">مدیر کل</Badge> : <Badge tone="blue">مدیر داخلی</Badge>) },
      { key: 'phone', header: 'شماره موبایل', hideOnMobile: true, cell: (row) => <span dir="ltr">{row.phone}</span> },
      { key: 'services', header: 'خدمات قابل دسترسی', className: 'text-[13px] font-normal', cell: (row) => <ServicesCell row={row} /> },
      { key: 'lastLogin', header: 'آخرین ورود', hideOnMobile: true, className: 'whitespace-nowrap text-xs text-[#5F7177]', cell: (row) => formatDateTime(row.lastLoginAt) },
    ]}
    emptyValues={() => ({ name: '', phone: '', password: '', serviceIds: [] })}
    toValues={(row) => ({ name: row.name, phone: row.phone, password: '', serviceIds: row.services.map((service) => String(service.id)) })}
    save={saveAdmin}
    remove={deleteAdmin}
    deleteMessage={(row) => `دسترسی «${row.name}» به پنل حذف شود؟ یادداشت‌هایی که روی درخواست‌ها نوشته باقی می‌مانند.`}
    renderForm={({ values, set, errors }, editing) => (
      <div className="space-y-4">
        <TextInput label="نام" required value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
        <TextInput label="شماره موبایل" required ltr type="tel" inputMode="tel" placeholder="09120000000" hint="با همین شماره وارد پنل می‌شود." value={values.phone} onChange={(v) => set('phone', v)} error={errors.phone} />
        <TextInput
          label={editing ? 'رمز عبور جدید' : 'رمز عبور'}
          required={!editing}
          type="password"
          autoComplete="new-password"
          ltr
          hint={editing ? 'برای حفظ رمز فعلی خالی بگذارید.' : 'دست‌کم ۶ کاراکتر.'}
          value={values.password}
          onChange={(v) => set('password', v)}
          error={errors.password}
        />
        <div className="rounded-lg border border-[#E3E8EA] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#5F7177]">
              {values.serviceIds.length.toLocaleString('fa-IR')} از {services.length.toLocaleString('fa-IR')} خدمت انتخاب شده
            </p>
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={() => set('serviceIds', services.map((service) => service.value))}>
                انتخاب همه
              </Button>
              <Button size="sm" variant="ghost" onClick={() => set('serviceIds', [])}>
                هیچ‌کدام
              </Button>
            </div>
          </div>
          <CheckboxGroup
            label="خدماتی که درخواست‌هایشان را می‌بیند"
            hint="این مدیر در پنل فقط بخش «درخواست خدمات» را دارد و فقط درخواست‌های همین خدمات را می‌بیند، وضعیتشان را تغییر می‌دهد و برایشان یادداشت می‌نویسد."
            values={values.serviceIds}
            onChange={(v) => set('serviceIds', v)}
            options={services}
            error={errors.serviceIds}
          />
        </div>
      </div>
    )}
  />
);
