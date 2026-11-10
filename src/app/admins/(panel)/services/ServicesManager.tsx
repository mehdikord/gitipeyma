'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Eye, EyeOff, ExternalLink, ListChecks } from 'lucide-react';
import type { ServiceAdminRow } from '../../../../modules/services/queries';
import { deleteService, saveService, setServiceActive } from '../../../../modules/services/actions';
import { SERVICE_ICONS, serviceIcon } from '../../../../modules/services/icons';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { ActiveBadge, Badge } from '../../../../components/admin/ui/Badge';
import { IconButton } from '../../../../components/admin/ui/Button';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import { FormGrid, NumberInput, Option, Select, Switch, TextArea, TextInput } from '../../../../components/admin/ui/fields';
import { ImageField } from '../../../../components/admin/ui/ImageField';
import { ListField } from '../../../../components/admin/ui/ListField';
import { useToast } from '../../../../components/admin/ui/Toast';
import { FormApi, str } from '../../../../components/admin/ui/useForm';
import { TranslatedInput, TransTextArea, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

type Values = {
  title: TranslatedInput;
  shortTitle: TranslatedInput;
  slug: string;
  serviceCategoryId: string;
  serviceGroupId: string;
  categoryLabel: TranslatedInput;
  eyebrow: TranslatedInput;
  badge: TranslatedInput;
  icon: string;
  image: string;
  summary: TranslatedInput;
  description: TranslatedInput;
  content: TranslatedInput;
  isActive: boolean;
  isHighlighted: boolean;
  sortOrder: string;
  features: { title: TranslatedInput }[];
  steps: { title: TranslatedInput; description: TranslatedInput }[];
  faqs: { question: TranslatedInput; answer: TranslatedInput }[];
};

const TABS = [
  { id: 'main', label: 'اطلاعات اصلی', fields: ['title', 'shortTitle', 'slug', 'serviceCategoryId', 'serviceGroupId', 'categoryLabel', 'eyebrow', 'badge', 'icon', 'image', 'sortOrder'] },
  { id: 'content', label: 'متن صفحه', fields: ['summary', 'description', 'content'] },
  { id: 'features', label: 'مزایا', fields: ['features'] },
  { id: 'steps', label: 'مراحل', fields: ['steps'] },
  { id: 'faqs', label: 'پرسش‌ها', fields: ['faqs'] },
] as const;

const ICON_OPTIONS: Option[] = Object.entries(SERVICE_ICONS).map(([value, { label }]) => ({ value, label }));

const ServiceForm: React.FC<{ form: FormApi<Values>; categories: Option[]; groups: Option[] }> = ({ form, categories, groups }) => {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('main');
  const { values, set, errors, errorsAt } = form;
  const tabHasError = (fields: readonly string[]) => Object.keys(errors).some((key) => fields.includes(key.split('.')[0]));

  return (
    <>
      {/* Stays at the top of the modal while a long list scrolls */}
      <div role="tablist" className="sticky -top-5 z-10 -mx-1 -mt-5 mb-5 flex gap-1 overflow-x-auto border-b border-[#E3E8EA] bg-white pt-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`relative shrink-0 px-3 py-2.5 text-[13px] font-bold transition-colors ${tab === item.id ? 'text-[#0B7A75]' : 'text-[#5F7177] hover:text-[#14282D]'}`}
          >
            {item.label}
            {item.id === 'features' && ` (${values.features.length.toLocaleString('fa-IR')})`}
            {item.id === 'steps' && ` (${values.steps.length.toLocaleString('fa-IR')})`}
            {item.id === 'faqs' && ` (${values.faqs.length.toLocaleString('fa-IR')})`}
            {tabHasError(item.fields) && <span aria-label="دارای خطا" className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#DC2626]" />}
            {tab === item.id && <span aria-hidden="true" className="absolute inset-x-2 -bottom-px h-0.5 bg-[#0B7A75]" />}
          </button>
        ))}
      </div>

      {tab === 'main' && (
        <div className="space-y-4">
          <FormGrid>
            <TransTextInput label="عنوان کامل" required name="title" value={values.title} onChange={(v) => set('title', v)} errors={errors} />
            <TransTextInput label="عنوان کوتاه" required name="shortTitle" hint="در منوها، فوتر و فرم‌ها." value={values.shortTitle} onChange={(v) => set('shortTitle', v)} errors={errors} />
            <TextInput label="نامک (آدرس صفحه)" required ltr hint={`/fa/services/${values.slug || '...'} — برای همه زبان‌ها یکی است.`} value={values.slug} onChange={(v) => set('slug', v)} error={errors.slug} />
            <Select label="دسته‌بندی" required placeholder="انتخاب کنید" value={values.serviceCategoryId} onChange={(v) => set('serviceCategoryId', v)} options={categories} error={errors.serviceCategoryId} />
            <Select
              label="گروه در صفحه اصلی"
              placeholder="بدون گروه (در نقشه خدمات صفحه اصلی نمایش داده نمی‌شود)"
              value={values.serviceGroupId}
              onChange={(v) => set('serviceGroupId', v)}
              options={groups}
              error={errors.serviceGroupId}
            />
            <TransTextInput label="برچسب دسته (اختیاری)" name="categoryLabel" hint="خالی بماند، عنوان دسته نمایش داده می‌شود." value={values.categoryLabel} onChange={(v) => set('categoryLabel', v)} errors={errors} />
            <TransTextInput label="نشان" name="badge" hint="مثل «سرویس ویژه روزانه»" value={values.badge} onChange={(v) => set('badge', v)} errors={errors} />
            <TransTextInput label="متن بالای عنوان" name="eyebrow" value={values.eyebrow} onChange={(v) => set('eyebrow', v)} errors={errors} />
            <Select label="آیکن" placeholder="پیش‌فرض" value={values.icon} onChange={(v) => set('icon', v)} options={ICON_OPTIONS} error={errors.icon} />
            <NumberInput label="ترتیب نمایش" min={0} hint="عدد کمتر، جلوتر." value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
          </FormGrid>
          <ImageField label="تصویر خدمت" folder="services" value={values.image} onChange={(v) => set('image', v)} error={errors.image} />
          <div className="flex flex-col gap-3 rounded-lg bg-[#F4F6F7] p-4 sm:flex-row sm:gap-8">
            <Switch label="فعال" hint="غیرفعال‌ها در سایت دیده نمی‌شوند." checked={values.isActive} onChange={(v) => set('isActive', v)} />
            <Switch label="خدمت ویژه" checked={values.isHighlighted} onChange={(v) => set('isHighlighted', v)} />
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="space-y-4">
          <TransTextArea label="خلاصه" required name="summary" rows={3} hint="زیر عنوان صفحه خدمت و در فهرست خدمات." value={values.summary} onChange={(v) => set('summary', v)} errors={errors} />
          <TransTextArea label="معرفی" required name="description" rows={4} value={values.description} onChange={(v) => set('description', v)} errors={errors} />
          <TransTextArea label="متن تکمیلی" name="content" rows={8} hint="هر پاراگراف را با یک خط خالی از بعدی جدا کنید." value={values.content} onChange={(v) => set('content', v)} errors={errors} />
        </div>
      )}

      {tab === 'features' && (
        <ListField
          label="مزایای این خدمت"
          addLabel="افزودن مزیت"
          items={values.features}
          onChange={(items) => set('features', items)}
          newItem={() => ({ title: emptyTranslated() })}
          error={errors.features}
          renderItem={(item, update, index) => (
            <TransTextInput label="متن مزیت" name="title" value={item.title} onChange={(title) => update({ title })} errors={errorsAt('features', index)} />
          )}
        />
      )}

      {tab === 'steps' && (
        <ListField
          label="مراحل انجام کار"
          addLabel="افزودن مرحله"
          items={values.steps}
          onChange={(items) => set('steps', items)}
          newItem={() => ({ title: emptyTranslated(), description: emptyTranslated() })}
          error={errors.steps}
          renderItem={(item, update, index) => (
            <div className="space-y-3">
              <TransTextInput label="عنوان مرحله" name="title" value={item.title} onChange={(title) => update({ title })} errors={errorsAt('steps', index)} />
              <TransTextArea label="توضیح" name="description" rows={2} value={item.description} onChange={(description) => update({ description })} errors={errorsAt('steps', index)} />
            </div>
          )}
        />
      )}

      {tab === 'faqs' && (
        <ListField
          label="پرسش‌های متداول"
          addLabel="افزودن پرسش"
          items={values.faqs}
          onChange={(items) => set('faqs', items)}
          newItem={() => ({ question: emptyTranslated(), answer: emptyTranslated() })}
          error={errors.faqs}
          renderItem={(item, update, index) => (
            <div className="space-y-3">
              <TransTextInput label="پرسش" name="question" value={item.question} onChange={(question) => update({ question })} errors={errorsAt('faqs', index)} />
              <TransTextArea label="پاسخ" name="answer" rows={3} value={item.answer} onChange={(answer) => update({ answer })} errors={errorsAt('faqs', index)} />
            </div>
          )}
        />
      )}
    </>
  );
};

export const ServicesManager: React.FC<{ services: ServiceAdminRow[]; categories: Option[]; groups: Option[] }> = ({ services, categories, groups }) => {
  const toast = useToast();

  const toggleActive = async (row: ServiceAdminRow) => {
    const result = await setServiceActive(row.id, !row.isActive);
    if (result.ok) toast.success(result.message ?? 'انجام شد.');
    else toast.error(result.message ?? 'انجام نشد.');
  };

  return (
    <CrudManager<ServiceAdminRow, Values>
      title="خدمات"
      description="هر خدمت یک صفحه در سایت و فرم درخواست مخصوص خودش را دارد. فرم هر خدمت را از دکمه «مدیریت فرم خدمت» طراحی کنید."
      noun="خدمت"
      rows={services}
      modalSize="xl"
      toolbar={
        <FilterBar
          searchPlaceholder="جستجوی عنوان یا نامک"
          filters={[
            { name: 'category', label: 'دسته', options: categories },
            { name: 'state', label: 'وضعیت', options: [{ value: 'active', label: 'فعال' }, { value: 'inactive', label: 'غیرفعال' }] },
          ]}
        />
      }
      columns={[
        {
          key: 'title',
          header: 'خدمت',
          cell: (row) => {
            const Icon = serviceIcon(row.icon);
            return (
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6F4F3] text-[#0B5F5B]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{fa(row.shortTitle)}</span>
                  <span dir="ltr" className="block text-right text-xs text-[#5F7177]">
                    /{row.slug}
                  </span>
                </span>
              </span>
            );
          },
        },
        { key: 'category', header: 'دسته', hideOnMobile: true, cell: (row) => row.categoryTitle },
        { key: 'group', header: 'گروه صفحه اصلی', hideOnMobile: true, cell: (row) => row.groupTitle ?? <span className="text-[#94A3A8]">—</span> },
        {
          key: 'requests',
          header: 'درخواست‌ها',
          cell: (row) => (
            <Link href={`/admins/service-requests?service=${row.id}`} onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1.5 hover:text-[#0B7A75]">
              {row.requestCount.toLocaleString('fa-IR')}
              {row.pendingCount > 0 && <Badge tone="amber">{row.pendingCount.toLocaleString('fa-IR')} جدید</Badge>}
            </Link>
          ),
        },
        {
          key: 'form',
          header: 'فرم درخواست',
          hideOnMobile: true,
          cell: (row) => (
            <Link href={`/admins/services/${row.id}/form`} onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1.5 text-[#3F5257] hover:text-[#0B7A75]">
              <ListChecks className="h-4 w-4" />
              {row.formFieldCount > 0 ? `${row.formFieldCount.toLocaleString('fa-IR')} فیلد` : <span className="text-[#94A3A8]">فقط نام و تماس</span>}
            </Link>
          ),
        },
        { key: 'state', header: 'وضعیت', cell: (row) => <ActiveBadge active={row.isActive} /> },
        { key: 'sortOrder', header: 'ترتیب', hideOnMobile: true, className: 'text-[#5F7177]', cell: (row) => row.sortOrder.toLocaleString('fa-IR') },
      ]}
      rowActions={(row) => (
        <>
          <a
            href={`/fa/services/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            title="مشاهده در سایت"
            aria-label="مشاهده در سایت"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#3F5257] hover:bg-[#EEF2F3]"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            href={`/admins/services/${row.id}/form`}
            title="مدیریت فرم خدمت"
            aria-label="مدیریت فرم خدمت"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#3F5257] hover:bg-[#EEF2F3]"
          >
            <ListChecks className="h-4 w-4" />
          </Link>
          <Link href={`/admins/service-requests?service=${row.id}`} title="درخواست‌های این خدمت" aria-label="درخواست‌های این خدمت" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#3F5257] hover:bg-[#EEF2F3]">
            <ClipboardList className="h-4 w-4" />
          </Link>
          <IconButton label={row.isActive ? 'غیرفعال کردن' : 'فعال کردن'} icon={row.isActive ? EyeOff : Eye} onClick={() => toggleActive(row)} />
        </>
      )}
      emptyValues={() => ({
        title: emptyTranslated(),
        shortTitle: emptyTranslated(),
        slug: '',
        serviceCategoryId: categories[0]?.value ?? '',
        serviceGroupId: '',
        categoryLabel: emptyTranslated(),
        eyebrow: emptyTranslated(),
        badge: emptyTranslated(),
        icon: '',
        image: '',
        summary: emptyTranslated(),
        description: emptyTranslated(),
        content: emptyTranslated(),
        isActive: true,
        isHighlighted: false,
        sortOrder: String(services.length + 1),
        features: [],
        steps: [],
        faqs: [],
      })}
      toValues={(row) => ({
        title: toInputs(row.title),
        shortTitle: toInputs(row.shortTitle),
        slug: row.slug,
        serviceCategoryId: String(row.serviceCategoryId),
        serviceGroupId: str(row.serviceGroupId),
        categoryLabel: toInputs(row.categoryLabel),
        eyebrow: toInputs(row.eyebrow),
        badge: toInputs(row.badge),
        icon: str(row.icon),
        image: str(row.image),
        summary: toInputs(row.summary),
        description: toInputs(row.description),
        content: toInputs(row.content),
        isActive: row.isActive,
        isHighlighted: row.isHighlighted,
        sortOrder: String(row.sortOrder),
        features: row.features.map((feature) => ({ title: toInputs(feature.title) })),
        steps: row.steps.map((step) => ({ title: toInputs(step.title), description: toInputs(step.description) })),
        faqs: row.faqs.map((faq) => ({ question: toInputs(faq.question), answer: toInputs(faq.answer) })),
      })}
      save={saveService}
      remove={deleteService}
      deleteMessage={(row) =>
        row.requestCount > 0
          ? `«${fa(row.shortTitle)}» ${row.requestCount.toLocaleString('fa-IR')} درخواست ثبت‌شده دارد و حذف نمی‌شود. برای پنهان کردن آن از سایت، غیرفعالش کنید.`
          : `خدمت «${fa(row.shortTitle)}» با همه مزایا، مراحل و پرسش‌هایش حذف شود؟`
      }
      renderForm={(form) => <ServiceForm form={form} categories={categories} groups={groups} />}
    />
  );
};
