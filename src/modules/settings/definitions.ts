/**
 * Every setting the site reads, with its label and default. The settings page in the admin panel
 * is built from this list, so a new setting only needs an entry here.
 *
 * A translatable setting is written once per language and stored as JSON ({"fa": ..., "en": ..., "tr": ...});
 * the site reads it in the page's language.
 */

import type { Translated } from '../../i18n/translated';

export const SETTING_GROUPS = [
  {
    title: 'اطلاعات شرکت',
    fields: [
      {
        key: 'company_name',
        label: 'نام شرکت',
        type: 'text',
        translatable: true,
        default: { fa: 'نمایندگی رسمی رویال تراول', en: 'Royal Travel International Services', tr: 'Royal Travel Uluslararası Hizmetler' },
      },
      {
        key: 'brand_tagline',
        label: 'شعار برند',
        hint: 'در فوتر سایت نمایش داده می‌شود.',
        type: 'text',
        translatable: true,
        default: {
          fa: 'مرزها، پایان مسیر نیستند؛ آغاز فرصت‌های تازه‌اند.',
          en: 'Borders are not boundaries; they are the start of new horizons.',
          tr: 'Sınırlar bir son değil; yeni ufukların başlangıcıdır.',
        },
      },
    ],
  },
  {
    title: 'پشتیبانی و تماس',
    fields: [
      { key: 'support_phone', label: 'شماره پشتیبانی ۲۴ ساعته', hint: 'در سربرگ، فوتر و دکمه‌های تماس سایت نمایش داده می‌شود.', type: 'text', ltr: true, default: '+90 (212) 588 40 40' },
      {
        key: 'support_availability',
        label: 'متن ساعات پاسخگویی',
        type: 'text',
        translatable: true,
        default: { fa: 'پاسخگویی و پشتیبانی ۲۴ ساعته در ۷ روز هفته', en: 'Support around the clock, 7 days a week', tr: 'Haftanın 7 günü, 24 saat destek' },
      },
      { key: 'support_hotline', label: 'خط همراه پشتیبانی (در مسیر)', hint: 'برای مسافرانی که در مسیر به کمک فوری نیاز دارند.', type: 'text', ltr: true, default: '+90 (536) 700 80 90' },
      { key: 'whatsapp_number', label: 'شماره واتس‌اپ', hint: 'فقط ارقام با کد کشور، بدون + و صفر. مثال: 905367008090', type: 'text', ltr: true, default: '905367008090' },
    ],
  },
  {
    title: 'محاسبه‌گر ارز',
    fields: [{ key: 'currency_fee_percent', label: 'کارمزد حواله (درصد)', type: 'number', ltr: true, default: '1' }],
  },
] as const satisfies readonly {
  title: string;
  fields: readonly { key: string; label: string; hint?: string; type: 'text' | 'number'; ltr?: boolean; translatable?: boolean; default: string | Required<Translated> }[];
}[];

export type SettingKey = (typeof SETTING_GROUPS)[number]['fields'][number]['key'];

// What the site reads: every setting as text, translatable ones already in the page's language.
export type Settings = Record<SettingKey, string>;

export type SettingField = { key: SettingKey; label: string; hint?: string; type: 'text' | 'number'; ltr?: boolean; translatable?: boolean; default: string | Required<Translated> };

export const SETTING_FIELDS: SettingField[] = SETTING_GROUPS.flatMap((group): readonly SettingField[] => group.fields);
export const SETTING_KEYS = SETTING_FIELDS.map((field) => field.key) as SettingKey[];

/** A setting's stored text: JSON for a translatable one. */
export const storedDefault = (field: SettingField) => (typeof field.default === 'string' ? field.default : JSON.stringify(field.default));
