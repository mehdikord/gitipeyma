'use client';

import React from 'react';
import type { TeamMemberRow } from '../../../../modules/teamMembers/queries';
import { deleteTeamMember, saveTeamMember } from '../../../../modules/teamMembers/actions';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { FormGrid, NumberInput, Switch } from '../../../../components/admin/ui/fields';
import { TranslatedInput, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';
import { ImageField } from '../../../../components/admin/ui/ImageField';
import { str } from '../../../../components/admin/ui/useForm';

type Values = { name: TranslatedInput; role: TranslatedInput; specialty: TranslatedInput; department: TranslatedInput; image: string; isActive: boolean; sortOrder: string };

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
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4F3] font-black text-[#0B5F5B]">{fa(row.name).charAt(0)}</span>
            )}
            <span>
              <span className="block font-bold">{fa(row.name)}</span>
              <span className="block text-xs text-[#5F7177]">{fa(row.role)}</span>
            </span>
          </span>
        ),
      },
      { key: 'department', header: 'دپارتمان', hideOnMobile: true, cell: (row) => fa(row.department) || '—' },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
      { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
    ]}
    emptyValues={() => ({ name: emptyTranslated(), role: emptyTranslated(), specialty: emptyTranslated(), department: emptyTranslated(), image: '', isActive: true, sortOrder: String(rows.length + 1) })}
    toValues={(row) => ({
      name: toInputs(row.name),
      role: toInputs(row.role),
      specialty: toInputs(row.specialty),
      department: toInputs(row.department),
      image: str(row.image),
      isActive: row.isActive,
      sortOrder: String(row.sortOrder),
    })}
    save={saveTeamMember}
    remove={deleteTeamMember}
    deleteMessage={(row) => `«${fa(row.name)}» از اعضای تیم حذف شود؟`}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-4">
        <FormGrid>
          <TransTextInput label="نام" required name="name" value={values.name} onChange={(v) => set('name', v)} errors={errors} />
          <TransTextInput label="سمت" required name="role" value={values.role} onChange={(v) => set('role', v)} errors={errors} />
          <TransTextInput label="دپارتمان" name="department" value={values.department} onChange={(v) => set('department', v)} errors={errors} />
          <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
        </FormGrid>
        <TransTextInput label="تخصص" name="specialty" value={values.specialty} onChange={(v) => set('specialty', v)} errors={errors} />
        <ImageField label="عکس" folder="team" value={values.image} onChange={(v) => set('image', v)} error={errors.image} />
        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
