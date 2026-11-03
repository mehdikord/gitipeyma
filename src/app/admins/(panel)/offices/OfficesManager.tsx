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
import { TranslatedInput, TransTextArea, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = {
  name: TranslatedInput;
  role: TranslatedInput;
  country: TranslatedInput;
  address: TranslatedInput;
  phones: { value: string }[];
  email: string;
  workingHours: TranslatedInput;
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
            <span className="block font-bold">{fa(row.name)}</span>
            <span className="block text-xs text-[#5F7177]">{fa(row.role)}</span>
          </>
        ),
      },
      { key: 'country', header: 'کشور', hideOnMobile: true, cell: (row) => fa(row.country) },
      { key: 'phone', header: 'تلفن', cell: (row) => <span dir="ltr">{row.phones[0] ?? '—'}</span> },
      { key: 'hours', header: 'ساعت کاری', hideOnMobile: true, cell: (row) => <span dir="ltr">{`${row.openHour}:00 – ${row.closeHour}:00`}</span> },
      { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
    ]}
    emptyValues={() => ({
      name: emptyTranslated(),
      role: emptyTranslated(),
      country: emptyTranslated(),
      address: emptyTranslated(),
      phones: [{ value: '' }],
      email: '',
      workingHours: emptyTranslated(),
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
      name: toInputs(row.name),
      role: toInputs(row.role),
      country: toInputs(row.country),
      address: toInputs(row.address),
      phones: row.phones.map((value) => ({ value })),
      email: str(row.email),
      workingHours: toInputs(row.workingHours),
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
    deleteMessage={(row) => `دفتر «${fa(row.name)}» حذف شود؟`}
    renderForm={({ values, set, errors }) => (
      <div className="space-y-5">
        <FormGrid>
          <TransTextInput label="نام کوتاه" required name="name" hint="مثل «استانبول»" value={values.name} onChange={(v) => set('name', v)} errors={errors} />
          <TransTextInput label="نقش دفتر" required name="role" hint="مثل «دفتر مرکزی ترکیه»" value={values.role} onChange={(v) => set('role', v)} errors={errors} />
          <TransTextInput label="کشور" required name="country" value={values.country} onChange={(v) => set('country', v)} errors={errors} />
          <TextInput label="ایمیل" ltr type="email" value={values.email} onChange={(v) => set('email', v)} error={errors.email} />
        </FormGrid>
        <TransTextArea label="نشانی" required name="address" rows={2} value={values.address} onChange={(v) => set('address', v)} errors={errors} />

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
            <TransTextInput label="متن ساعت کاری" required name="workingHours" hint="همان‌طور که در سایت نوشته می‌شود." value={values.workingHours} onChange={(v) => set('workingHours', v)} errors={errors} />
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
