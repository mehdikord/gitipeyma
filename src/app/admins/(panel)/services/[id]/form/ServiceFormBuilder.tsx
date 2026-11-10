'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, Lock, Save } from 'lucide-react';
import type { FormFieldAdminRow, ServiceFormAdmin } from '../../../../../../modules/serviceForms/queries';
import { saveServiceForm } from '../../../../../../modules/serviceForms/actions';
import { FORM_FIELD_TYPES, FormFieldType, formFieldType } from '../../../../../../modules/serviceForms/fields';
import { Badge } from '../../../../../../components/admin/ui/Badge';
import { Button, ButtonLink, buttonClass } from '../../../../../../components/admin/ui/Button';
import { FormAlert, FormGrid, Select, Switch, TextInput } from '../../../../../../components/admin/ui/fields';
import { ListField } from '../../../../../../components/admin/ui/ListField';
import { PageHeader } from '../../../../../../components/admin/ui/PageHeader';
import { CARD } from '../../../../../../components/admin/ui/styles';
import { useForm } from '../../../../../../components/admin/ui/useForm';
import { LanguageTabs, TranslatedInput, TranslationProvider, TransTextArea, TransTextInput } from '../../../../../../components/admin/ui/translations';
import { emptyTranslated, toInputs } from '../../../../../../i18n/translated';

type OptionValues = { value: string; label: TranslatedInput };

type FieldValues = {
  // null until the field is first saved
  id: number | null;
  type: FormFieldType;
  label: TranslatedInput;
  help: TranslatedInput;
  isRequired: boolean;
  isMultiple: boolean;
  isMultiline: boolean;
  options: OptionValues[];
};

type Values = { fields: FieldValues[] };

const TYPE_OPTIONS = FORM_FIELD_TYPES.map((type) => ({ value: type.key, label: type.label }));

const toValues = (row: FormFieldAdminRow): FieldValues => ({
  id: row.id,
  type: row.type,
  label: toInputs(row.label),
  help: toInputs(row.help),
  isRequired: row.isRequired,
  isMultiple: row.isMultiple,
  isMultiline: row.isMultiline,
  options: row.options.map((option) => ({ value: option.value, label: toInputs(option.label) })),
});

// A fresh option gets the next free number as its value, which the admin may change.
const newOption = (options: OptionValues[]): OptionValues => {
  const numbers = options.map((option) => Number(option.value)).filter((value) => Number.isInteger(value));
  return { value: String((numbers.length ? Math.max(...numbers) : 0) + 1), label: emptyTranslated() };
};

const newField = (): FieldValues => ({
  id: null,
  type: 'text',
  label: emptyTranslated(),
  help: emptyTranslated(),
  isRequired: false,
  isMultiple: false,
  isMultiline: false,
  options: [],
});

/** The errors under a prefix, with the prefix taken off: scoped({ 'options.0.value': x }, 'options.0.') gives { value: x }. */
const scoped = (errors: Record<string, string>, prefix: string) =>
  Object.fromEntries(Object.entries(errors).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [key.slice(prefix.length), value]));

const FieldEditor: React.FC<{ field: FieldValues; update: (patch: Partial<FieldValues>) => void; errors: Record<string, string> }> = ({ field, update, errors }) => {
  const changeType = (type: FormFieldType) => update({ type, ...(type === 'select' && field.options.length === 0 ? { options: [newOption([])] } : {}) });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="blue">{formFieldType(field.type).label}</Badge>
        {field.isRequired && <Badge tone="amber">الزامی</Badge>}
        {field.type === 'select' && <Badge tone="gray">{field.isMultiple ? 'انتخاب چندتایی' : 'انتخاب تکی'}</Badge>}
        {field.type === 'text' && field.isMultiline && <Badge tone="gray">چندخطی</Badge>}
        {field.id === null && <Badge tone="green">جدید</Badge>}
      </div>

      <FormGrid>
        <Select label="نوع فیلد" required value={field.type} onChange={(value) => changeType(value as FormFieldType)} options={TYPE_OPTIONS} hint={formFieldType(field.type).hint} error={errors.type} />
        <div className="flex items-center rounded-lg bg-white px-3 py-2 sm:mt-6 sm:self-start">
          <Switch
            label="الزامی"
            hint={field.type === 'checkbox' ? 'بازدیدکننده باید تیک بزند؛ مثل پذیرش قوانین.' : 'بدون پر کردن آن، درخواست ثبت نمی‌شود.'}
            checked={field.isRequired}
            onChange={(isRequired) => update({ isRequired })}
          />
        </div>
      </FormGrid>

      <TransTextInput
        label={field.type === 'checkbox' ? 'متن کنار چک‌باکس' : 'عنوان فیلد (لیبل)'}
        required
        name="label"
        value={field.label}
        onChange={(label) => update({ label })}
        errors={errors}
      />
      <TransTextArea
        label="توضیحات / راهنما (اختیاری)"
        name="help"
        rows={2}
        hint="اگر نوشته شود، در سایت زیر عنوان فیلد به عنوان راهنما نمایش داده می‌شود."
        value={field.help}
        onChange={(help) => update({ help })}
        errors={errors}
      />

      {field.type === 'text' && (
        <div className="rounded-lg bg-white px-3 py-2.5">
          <Switch label="چندخطی" hint="برای متن‌های بلند مثل توضیحات؛ تا ۲٬۰۰۰ کاراکتر. خاموش: یک خط، تا ۲۵۵ کاراکتر." checked={field.isMultiline} onChange={(isMultiline) => update({ isMultiline })} />
        </div>
      )}

      {field.type === 'select' && (
        <div className="space-y-3 rounded-lg border border-[#E3E8EA] bg-white p-3">
          <Switch
            label="انتخاب چندتایی"
            hint={field.isMultiple ? 'بازدیدکننده می‌تواند چند گزینه را با هم انتخاب کند.' : 'بازدیدکننده فقط یک گزینه را از لیست کشویی انتخاب می‌کند.'}
            checked={field.isMultiple}
            onChange={(isMultiple) => update({ isMultiple })}
          />
          <ListField
            label="گزینه‌ها"
            addLabel="افزودن گزینه"
            emptyText="هنوز گزینه‌ای تعریف نشده است."
            items={field.options}
            onChange={(options) => update({ options })}
            newItem={() => newOption(field.options)}
            max={50}
            error={errors.options}
            renderItem={(option, updateOption, index) => {
              const optionErrors = scoped(errors, `options.${index}.`);
              return (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
                  <TextInput
                    label="مقدار (value)"
                    required
                    ltr
                    hint="در همه زبان‌ها ثابت است."
                    value={option.value}
                    onChange={(value) => updateOption({ value })}
                    error={optionErrors.value}
                  />
                  <TransTextInput label="عنوان نمایشی" required name="label" value={option.label} onChange={(label) => updateOption({ label })} errors={optionErrors} />
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

/** A fixed field every form starts with, shown so the admin sees the whole form in order. */
const FixedField: React.FC<{ label: string; note: string }> = ({ label, note }) => (
  <li className="flex items-center gap-3 rounded-lg border border-dashed border-[#D5DDE0] bg-[#FAFBFB] px-3 py-2.5">
    <Lock className="h-4 w-4 shrink-0 text-[#94A3A8]" />
    <span className="text-sm font-bold text-[#14282D]">{label}</span>
    <span className="text-xs text-[#5F7177]">{note}</span>
  </li>
);

export const ServiceFormBuilder: React.FC<{ form: ServiceFormAdmin }> = ({ form: { service, fields } }) => {
  const initial: Values = { fields: fields.map(toValues) };
  const form = useForm<Values>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(form.values) !== saved;

  // Leaving the page with unsaved changes asks first
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submitted = form.values;
    form.submit(() => saveServiceForm({ serviceId: service.id, fields: submitted.fields }), {
      onSuccess: (result) => {
        const ids = (result.data as { ids: number[] } | undefined)?.ids ?? [];
        const next = { fields: submitted.fields.map((field, index) => ({ ...field, id: ids[index] ?? field.id })) };
        form.setValues(next);
        setSaved(JSON.stringify(next));
      },
    });
  };

  return (
    <TranslationProvider>
      <form onSubmit={handleSubmit} noValidate>
        <PageHeader
          title={`فرم درخواست «${service.title}»`}
          description="فیلدهایی که بازدیدکننده در صفحه این خدمت پر می‌کند. عنوان، راهنما و گزینه‌ها را به هر زبان سایت وارد کنید؛ زبان خالی با متن زبان دیگر نمایش داده می‌شود."
          actions={
            <>
              <ButtonLink href="/admins/services" icon={ArrowRight}>
                بازگشت به خدمات
              </ButtonLink>
              <a href={`/fa/services/${service.slug}#request`} target="_blank" rel="noreferrer" className={buttonClass('secondary')}>
                <ExternalLink className="h-4 w-4" />
                مشاهده در سایت
              </a>
              <Button type="submit" icon={Save} loading={form.pending}>
                ذخیره فرم
              </Button>
            </>
          }
        />

        <FormAlert message={form.formError} />

        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#5F7177]">
          {!service.isActive && <Badge tone="gray">خدمت غیرفعال است</Badge>}
          {dirty ? <Badge tone="amber">تغییرات ذخیره نشده</Badge> : <Badge tone="green">ذخیره‌شده</Badge>}
          {service.requestCount > 0 && <span>تغییر فرم روی {service.requestCount.toLocaleString('fa-IR')} درخواست قبلی اثری ندارد؛ هر درخواست پرسش‌ها و پاسخ‌هایش را همان‌طور که ثبت شده نگه می‌دارد.</span>}
        </div>

        <div className={`${CARD} overflow-hidden`}>
          <LanguageTabs values={form.values} errors={form.errors} />
          <div className="space-y-4 p-5">
            <div>
              <p className="mb-2 text-[13px] font-bold text-[#14282D]">فیلدهای ثابت</p>
              <ul className="space-y-2">
                <FixedField label="نام و نام خانوادگی" note="همیشه در ابتدای فرم؛ الزامی" />
                <FixedField label="شماره موبایل یا واتس‌اپ" note="همیشه در ابتدای فرم؛ الزامی" />
              </ul>
            </div>

            <ListField
              label="فیلدهای این خدمت"
              addLabel="افزودن فیلد"
              emptyText="هنوز فیلدی تعریف نشده است؛ فرم فقط نام و شماره تماس را می‌گیرد."
              items={form.values.fields}
              onChange={(items) => form.set('fields', items)}
              newItem={newField}
              max={40}
              error={form.errors.fields}
              renderItem={(field, update, index) => <FieldEditor field={field} update={update} errors={form.errorsAt('fields', index)} />}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" icon={Save} loading={form.pending}>
            ذخیره فرم
          </Button>
        </div>
      </form>
    </TranslationProvider>
  );
};
