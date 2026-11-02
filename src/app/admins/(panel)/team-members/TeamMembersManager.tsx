'use client';

import React from 'react';
import type { TeamMemberRow } from '../../../../modules/teamMembers/queries';
import { deleteTeamMember, saveTeamMember } from '../../../../modules/teamMembers/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { FormGrid, NumberInput, Switch, TextInput } from '../../../../components/admin/ui/fields';
import { ImageField } from '../../../../components/admin/ui/ImageField';
import { str } from '../../../../components/admin/ui/useForm';

type Values = { name: string; role: string; specialty: string; department: string; image: string; isActive: boolean; sortOrder: string };

export const TeamMembersManager: React.FC<{ rows: TeamMemberRow[] }> = ({ rows }) => (
  <CrudManager<TeamMemberRow, Values>
    title="اعضای تیم"
    description="کادر اجرایی و مشاورانی که در صفحه اصلی معرفی می‌شوند."
    noun="عضو تیم"
    rows={rows}
    modalSize="lg"
    columns={[
      {
        key: 'name',
        header: 'نام',
        cell: (row) => (
          <span className="flex items-center gap-3">
            {row.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4F3] font-black text-[#0B5F5B]">{row.name.charAt(0)}</span>
            )}
            <span>
              <span className="block font-bold">{row.name}</span>
              <span className="block text-xs text-[#5F7177]">{row.role}</span>
            </span>
          </span>
        ),
      },
      { key: 'department', header: 'دپارتمان', hideOnMobile: true, cell: (row) => row.department ?? '—' },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
      { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
    ]}
    emptyValues={() => ({ name: '', role: '', specialty: '', department: '', image: '', isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({
      name: row.name,
      role: row.role,
      specialty: str(row.specialty),
      department: str(row.department),
      image: str(row.image),
      isActive: row.isActive,
      sortOrder: String(row.sortOrder),
    })}
    save={saveTeamMember}
    remove={deleteTeamMember}
    deleteMessage={(row) => `«${row.name}» از اعضای تیم حذف شود؟`}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <FormGrid>
          <TextInput label="نام" required value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
          <TextInput label="سمت" required value={values.role} onChange={(v) => set('role', v)} error={errors.role} />
          <TextInput label="دپارتمان" value={values.department} onChange={(v) => set('department', v)} error={errors.department} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
        <TextInput label="تخصص" value={values.specialty} onChange={(v) => set('specialty', v)} error={errors.specialty} />
        <ImageField label="عکس" folder="team" value={values.image} onChange={(v) => set('image', v)} error={errors.image} />
        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
