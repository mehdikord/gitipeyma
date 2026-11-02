'use client';

import React from 'react';
import type { AdminRow } from '../../../../modules/admins/queries';
import { deleteAdmin, saveAdmin } from '../../../../modules/admins/actions';
import { formatDateTime } from '../../../../lib/format';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { Badge } from '../../../../components/admin/ui/Badge';
import { TextInput } from '../../../../components/admin/ui/fields';

type Values = { name: string; phone: string; password: string };

export const AdminsManager: React.FC<{ rows: AdminRow[] }> = ({ rows }) => (
  <CrudManager<AdminRow, Values>
    title="مدیران"
    description="کسانی که با شماره موبایل و رمز عبور وارد این پنل می‌شوند."
    noun="مدیر"
    rows={rows}
    canDelete={(row) => !row.isCurrent}
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
      { key: 'phone', header: 'شماره موبایل', cell: (row) => <span dir="ltr">{row.phone}</span> },
      { key: 'lastLogin', header: 'آخرین ورود', hideOnMobile: true, className: 'whitespace-nowrap text-xs text-[#5F7177]', cell: (row) => formatDateTime(row.lastLoginAt) },
    ]}
    emptyValues={() => ({ name: '', phone: '', password: '' })}
    toValues={(row) => ({ name: row.name, phone: row.phone, password: '' })}
    save={saveAdmin}
    remove={deleteAdmin}
    deleteMessage={(row) => `دسترسی «${row.name}» به پنل حذف شود؟`}
    renderForm={({ values, set, errors }, editing) => (
      <div className="space-y-4">
        <TextInput label="نام" required value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
        <TextInput label="شماره موبایل" required ltr type="tel" inputMode="tel" placeholder="09120000000" value={values.phone} onChange={(v) => set('phone', v)} error={errors.phone} />
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
      </div>
    )}
  />
);
