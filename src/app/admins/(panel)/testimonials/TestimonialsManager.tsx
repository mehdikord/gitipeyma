'use client';

import React from 'react';
import { Check, EyeOff, Star } from 'lucide-react';
import type { TestimonialRow } from '../../../../modules/testimonials/queries';
import type { Paginated } from '../../../../lib/pagination';
import { deleteTestimonial, saveTestimonial, setTestimonialPublished } from '../../../../modules/testimonials/actions';
import { formatDate } from '../../../../lib/format';
import { CrudManager } from '../../../../components/admin/CrudManager';
import { Badge } from '../../../../components/admin/ui/Badge';
import { IconButton } from '../../../../components/admin/ui/Button';
import { FilterBar } from '../../../../components/admin/ui/FilterBar';
import { FormGrid, NumberInput, Option, SectionTitle, Select, Switch, TextArea, TextInput } from '../../../../components/admin/ui/fields';
import { ListField } from '../../../../components/admin/ui/ListField';
import { useToast } from '../../../../components/admin/ui/Toast';
import { str } from '../../../../components/admin/ui/useForm';
import { TranslatedInput, TransTextArea, TransTextInput } from '../../../../components/admin/ui/translations';
import { emptyTranslated, fa, toInputs } from '../../../../i18n/translated';

// This year as each language's site writes it: the Persian calendar on the Persian site
const thisYear = (): TranslatedInput => {
  const gregorian = String(new Date().getFullYear());
  return { fa: new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date()), en: gregorian, tr: gregorian };
};

type Values = {
  serviceCategoryId: string;
  clientName: TranslatedInput;
  serviceTitle: TranslatedInput;
  context: TranslatedInput;
  comment: TranslatedInput;
  year: TranslatedInput;
  rating: string;
  categoryLabel: TranslatedInput;
  verifiedCode: TranslatedInput;
  outcomeHeadline: TranslatedInput;
  originDestination: TranslatedInput;
  trackingCode: string;
  isPublished: boolean;
  sortOrder: string;
  milestones: { title: TranslatedInput; description: TranslatedInput }[];
};

const RATINGS = [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n.toLocaleString('fa-IR')} ستاره` }));

const Stars = ({ rating }: { rating: number }) => (
  <span className="inline-flex" aria-label={`${rating} از ۵`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'fill-[#E2A93B] text-[#E2A93B]' : 'text-[#CBD5D8]'}`} />
    ))}
  </span>
);

export const TestimonialsManager: React.FC<{ list: Paginated<TestimonialRow>; categories: Option[] }> = ({ list, categories }) => {
  const toast = useToast();

  const togglePublished = async (row: TestimonialRow) => {
    const result = await setTestimonialPublished(row.id, !row.isPublished);
    if (result.ok) toast.success(result.message ?? 'انجام شد.');
    else toast.error(result.message ?? 'انجام نشد.');
  };

  return (
    <CrudManager<TestimonialRow, Values>
      title="نظرات مشتریان"
      description="نظرهایی که بازدیدکنندگان از صفحه اصلی می‌فرستند، تا تأیید نکنید در سایت نمایش داده نمی‌شوند."
      noun="نظر"
      rows={list.rows}
      pagination={list}
      modalSize="lg"
      highlight={(row) => !row.isPublished && row.source === 'visitor'}
      toolbar={
        <FilterBar
          searchPlaceholder="جستجوی نام، خدمت یا متن"
          filters={[
            {
              name: 'state',
              label: 'وضعیت',
              options: [
                { value: 'pending', label: 'در انتظار تأیید' },
                { value: 'published', label: 'منتشرشده' },
              ],
            },
          ]}
        />
      }
      columns={[
        {
          key: 'client',
          header: 'مشتری',
          cell: (row) => (
            <>
              <span className="block">{fa(row.clientName)}</span>
              <span className="block text-xs font-normal text-[#5F7177]">{fa(row.serviceTitle)}</span>
            </>
          ),
        },
        { key: 'comment', header: 'متن نظر', hideOnMobile: true, cell: (row) => <span className="line-clamp-2 max-w-md text-[13px] font-normal text-[#3F5257]">{fa(row.comment)}</span> },
        { key: 'rating', header: 'امتیاز', cell: (row) => <Stars rating={row.rating} /> },
        {
          key: 'state',
          header: 'وضعیت',
          cell: (row) => (row.isPublished ? <Badge tone="green">منتشرشده</Badge> : row.source === 'visitor' ? <Badge tone="amber">در انتظار تأیید</Badge> : <Badge>پیش‌نویس</Badge>),
        },
        { key: 'date', header: 'تاریخ ثبت', hideOnMobile: true, className: 'whitespace-nowrap text-xs font-normal text-[#5F7177]', cell: (row) => formatDate(row.createdAt) },
      ]}
      rowActions={(row) => <IconButton label={row.isPublished ? 'برداشتن از سایت' : 'تأیید و انتشار'} icon={row.isPublished ? EyeOff : Check} onClick={() => togglePublished(row)} />}
      emptyValues={() => ({
        serviceCategoryId: '',
        clientName: emptyTranslated(),
        serviceTitle: emptyTranslated(),
        context: emptyTranslated(),
        comment: emptyTranslated(),
        year: thisYear(),
        rating: '5',
        categoryLabel: emptyTranslated(),
        verifiedCode: emptyTranslated(),
        outcomeHeadline: emptyTranslated(),
        originDestination: emptyTranslated(),
        trackingCode: '',
        isPublished: true,
        sortOrder: '0',
        milestones: [],
      })}
      toValues={(row) => ({
        serviceCategoryId: str(row.serviceCategoryId),
        clientName: toInputs(row.clientName),
        serviceTitle: toInputs(row.serviceTitle),
        context: toInputs(row.context),
        comment: toInputs(row.comment),
        year: toInputs(row.year),
        rating: String(row.rating),
        categoryLabel: toInputs(row.categoryLabel),
        verifiedCode: toInputs(row.verifiedCode),
        outcomeHeadline: toInputs(row.outcomeHeadline),
        originDestination: toInputs(row.originDestination),
        trackingCode: str(row.trackingCode),
        isPublished: row.isPublished,
        sortOrder: String(row.sortOrder),
        milestones: row.milestones.map((milestone) => ({ title: toInputs(milestone.title), description: toInputs(milestone.description) })),
      })}
      save={saveTestimonial}
      remove={deleteTestimonial}
      deleteMessage={(row) => `نظر «${fa(row.clientName)}» حذف شود؟`}
      renderForm={({ values, set, errors, errorsAt }, editing) => (
        <div className="space-y-5">
          {editing?.source === 'visitor' && (
            <p className="rounded-lg bg-[#FEF3C7] px-4 py-3 text-[13px] leading-6 text-[#92400E]">
              این نظر را یک بازدیدکننده از سایت فرستاده است{editing.trackingCode ? ` (کد پرونده: ${editing.trackingCode})` : ''}. پس از بررسی، «نمایش در سایت» را روشن کنید.
            </p>
          )}
          <FormGrid>
            <TransTextInput label="نام مشتری" required name="clientName" value={values.clientName} onChange={(v) => set('clientName', v)} errors={errors} />
            <TransTextInput label="خدمت دریافت‌شده" required name="serviceTitle" value={values.serviceTitle} onChange={(v) => set('serviceTitle', v)} errors={errors} />
            <Select label="دسته (برای تب‌های صفحه اصلی)" placeholder="بدون دسته" value={values.serviceCategoryId} onChange={(v) => set('serviceCategoryId', v)} options={categories} error={errors.serviceCategoryId} />
            <Select label="امتیاز" value={values.rating} onChange={(v) => set('rating', v)} options={RATINGS} error={errors.rating} />
          </FormGrid>
          <TransTextArea label="متن نظر" required name="comment" rows={4} value={values.comment} onChange={(v) => set('comment', v)} errors={errors} />

          <div>
            <SectionTitle>جزئیات نمایش</SectionTitle>
            <FormGrid>
              <TransTextInput label="تیتر نتیجه" name="outcomeHeadline" value={values.outcomeHeadline} onChange={(v) => set('outcomeHeadline', v)} errors={errors} />
              <TransTextInput label="برچسب دسته" name="categoryLabel" value={values.categoryLabel} onChange={(v) => set('categoryLabel', v)} errors={errors} />
              <TransTextInput label="مبدأ و مقصد" name="originDestination" value={values.originDestination} onChange={(v) => set('originDestination', v)} errors={errors} />
              <TransTextInput label="کد تأیید" hint="مثل «بارنامه CMR: TR-IR-8841»" name="verifiedCode" value={values.verifiedCode} onChange={(v) => set('verifiedCode', v)} errors={errors} />
              <TransTextInput label="شرح پرونده" name="context" value={values.context} onChange={(v) => set('context', v)} errors={errors} />
              <TransTextInput label="سال" name="year" hint="روی سایت فارسی سال شمسی، روی بقیه میلادی." value={values.year} onChange={(v) => set('year', v)} errors={errors} />
              <NumberInput label="ترتیب نمایش" min={0} value={values.sortOrder} onChange={(v) => set('sortOrder', v)} error={errors.sortOrder} />
            </FormGrid>
          </div>

          <ListField
            label="مراحل پرونده"
            addLabel="افزودن مرحله"
            max={10}
            items={values.milestones}
            onChange={(items) => set('milestones', items)}
            newItem={() => ({ title: emptyTranslated(), description: emptyTranslated() })}
            error={errors.milestones}
            renderItem={(item, update, index) => (
              <FormGrid>
                <TransTextInput label="عنوان" name="title" value={item.title} onChange={(title) => update({ title })} errors={errorsAt('milestones', index)} />
                <TransTextInput label="توضیح" name="description" value={item.description} onChange={(description) => update({ description })} errors={errorsAt('milestones', index)} />
              </FormGrid>
            )}
          />

          <Switch label="نمایش در سایت" checked={values.isPublished} onChange={(v) => set('isPublished', v)} />
        </div>
      )}
    />
  );
};
