'use client';

import React from 'react';
import type { OfficeRow } from '../../../../modules/offices/queries';
import { deleteOffice, saveOffice } from '../../../../modules/offices/actions';
import { TIME_ZONES, WEEKDAYS } from '../../../../modules/offices/schema';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge } from '../../../../components/admin/ui/Badge';
import { CheckboxGroup, FormGrid, NumberInput, SectionTitle, Select, Switch, TextArea, TextInput } from '../../../../components/admin/ui/fields';
import { ListField } from '../../../../components/admin/ui/ListField';
import { str } from '../../../../components/admin/ui/useForm';

type Values = {
  name: string;
  role: string;
  country: string;
  address: string;
  phones: { value: string }[];
  email: string;
  workingHours: string;
  timeZone: string;
  openHour: string;
  closeHour: string;
  closedWeekdays: string[];
  latitude: string;
  longitude: string;
  isActive: boolean;
  sortOrder: string;
};

const WEEKDAY_OPTIONS = WEEKDAYS.map((label, index) => ({ value: String(index), label }));

export const OfficesManager: React.FC<{ rows: OfficeRow[] }> = ({ rows }) => (
  <CrudManager<OfficeRow, Values>
    title="دفاتر"
    description="دفاتر در صفحه تماس، فوتر و بخش پشتیبانی ۲۴ ساعته نمایش داده می‌شوند. اولین دفتر فعال، دفتر مرکزی است."
    noun="دفتر"
    rows={rows}
    modalSize="lg"
    columns={[
      {
        key: 'name',
        header: 'دفتر',
        cell: (row) => (
          <>
            <span className="block font-bold">{row.name}</span>
            <span className="block text-xs text-[#5F7177]">{row.role}</span>
          </>
        ),
      },
      { key: 'country', header: 'کشور', hideOnMobile: true, cell: (row) => row.country },
      { key: 'phone', header: 'تلفن', cell: (row) => <span dir="ltr">{row.phones[0] ?? '—'}</span> },
      { key: 'hours', header: 'ساعت کاری', hideOnMobile: true, cell: (row) => <span dir="ltr">{`${row.openHour}:00 – ${row.closeHour}:00`}</span> },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
    ]}
    emptyValues={() => ({
      name: '',
      role: '',
      country: '',
      address: '',
      phones: [{ value: '' }],
      email: '',
      workingHours: '',
      timeZone: 'Europe/Istanbul',
      openHour: '8',
      closeHour: '20',
      closedWeekdays: [],
      latitude: '',
      longitude: '',
      isActive: true,
      sortOrder: String(rows.length + 1),
    })}
    toValues={(row) => ({
      name: row.name,
      role: row.role,
      country: row.country,
      address: row.address,
      phones: row.phones.map((value) => ({ value })),
      email: str(row.email),
      workingHours: row.workingHours,
      timeZone: row.timeZone,
      openHour: String(row.openHour),
      closeHour: String(row.closeHour),
      closedWeekdays: row.closedWeekdays.map(String),
      latitude: String(row.latitude),
      longitude: String(row.longitude),
      isActive: row.isActive,
      sortOrder: String(row.sortOrder),
    })}
    save={(id, values) => saveOffice(id, { ...values, phones: values.phones.map((phone) => phone.value) })}
    remove={deleteOffice}
    deleteMessage={(row) => `دفتر «${row.name}» حذف شود؟`}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-5">
        <FormGrid>
          <TextInput label="نام کوتاه" required hint="مثل «استانبول»" value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
          <TextInput label="نقش دفتر" required hint="مثل «دفتر مرکزی ترکیه»" value={values.role} onChange={(v) => set('role', v)} error={errors.role} />
          <TextInput label="کشور" required value={values.country} onChange={(v) => set('country', v)} error={errors.country} />
          <TextInput label="ایمیل" ltr type="email" value={values.email} onChange={(v) => set('email', v)} error={errors.email} />
        </FormGrid>
        <TextArea label="نشانی" required rows={2} value={values.address} onChange={(v) => set('address', v)} error={errors.address} />

        <ListField
          label="شماره‌های تلفن"
          addLabel="افزودن شماره"
          max={6}
          items={values.phones}
          onChange={(items) => set('phones', items)}
          newItem={() => ({ value: '' })}
          error={errors.phones}
          renderItem={(item, update, index) => (
            <TextInput label={index === 0 ? 'شماره اصلی' : 'شماره'} ltr value={item.value} onChange={(value) => update({ value })} error={errors[`phones.${index}`]} />
          )}
        />

        <div>
          <SectionTitle>ساعت کاری</SectionTitle>
          <div className="space-y-4">
            <TextInput label="متن ساعت کاری" required hint="همان‌طور که در سایت نوشته می‌شود." value={values.workingHours} onChange={(v) => set('workingHours', v)} error={errors.workingHours} />
            <FormGrid cols={3}>
              <Select label="منطقه زمانی" value={values.timeZone} onChange={(v) => set('timeZone', v)} options={TIME_ZONES} error={errors.timeZone} />
              <NumberInput label="ساعت شروع" min={0} max={24} value={values.openHour} onChange={(v) => set('openHour', v)} error={errors.openHour} />
              <NumberInput label="ساعت پایان" min={0} max={24} value={values.closeHour} onChange={(v) => set('closeHour', v)} error={errors.closeHour} />
            </FormGrid>
            <CheckboxGroup label="روزهای تعطیل" values={values.closedWeekdays} onChange={(v) => set('closedWeekdays', v)} options={WEEKDAY_OPTIONS} hint="وضعیت «الان باز است / بسته است» در سایت از این ساعت‌ها حساب می‌شود." />
          </div>
        </div>

        <div>
          <SectionTitle>موقعیت روی نقشه</SectionTitle>
          <FormGrid cols={3}>
            <NumberInput label="عرض جغرافیایی (Latitude)" step="any" value={values.latitude} onChange={(v) => set('latitude', v)} error={errors.latitude} />
            <NumberInput label="طول جغرافیایی (Longitude)" step="any" value={values.longitude} onChange={(v) => set('longitude', v)} error={errors.longitude} />
            <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
          </FormGrid>
        </div>

        <Switch label="نمایش در سایت" checked={values.isActive} onChange={(v) => set('isActive', v)} />
      </div>
    )}
  />
);
