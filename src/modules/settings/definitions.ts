/**
 * Every setting the site reads, with its label and default. The settings page in the admin panel
 * is built from this list, so a new setting only needs an entry here.
 */

export const SETTING_GROUPS = [
  {
    title: 'اطلاعات شرکت',
    fields: [
      { key: 'company_name_fa', label: 'نام شرکت (فارسی)', type: 'text', default: 'نمایندگی رسمی گیتی پیما' },
      { key: 'company_name_en', label: 'نام شرکت (انگلیسی)', type: 'text', ltr: true, default: 'GITI International Services' },
      { key: 'brand_tagline_fa', label: 'شعار برند (فارسی)', type: 'text', default: 'مرزها، پایان مسیر نیستند؛ آغاز فرصت‌های تازه‌اند.' },
      { key: 'brand_tagline_en', label: 'شعار برند (انگلیسی)', type: 'text', ltr: true, default: 'Borders are not boundaries; they are the start of new horizons.' },
    ],
  },
  {
    title: 'پشتیبانی و تماس',
    fields: [
      { key: 'support_phone', label: 'شماره پشتیبانی ۲۴ ساعته', hint: 'در سربرگ، فوتر و دکمه‌های تماس سایت نمایش داده می‌شود.', type: 'text', ltr: true, default: '+90 (212) 588 40 40' },
      { key: 'support_availability', label: 'متن ساعات پاسخگویی', type: 'text', default: 'پاسخگویی و پشتیبانی ۲۴ ساعته در ۷ روز هفته' },
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
  fields: readonly { key: string; label: string; hint?: string; type: 'text' | 'number'; ltr?: boolean; default: string }[];
}[];

export type SettingKey = (typeof SETTING_GROUPS)[number]['fields'][number]['key'];
export type Settings = Record<SettingKey, string>;

export type SettingField = { key: SettingKey; label: string; hint?: string; type: 'text' | 'number'; ltr?: boolean; default: string };

export const SETTING_FIELDS: SettingField[] = SETTING_GROUPS.flatMap((group): readonly SettingField[] => group.fields);
export const SETTING_KEYS = SETTING_FIELDS.map((field) => field.key) as SettingKey[];

export const DEFAULT_SETTINGS = Object.fromEntries(SETTING_FIELDS.map((field) => [field.key, field.default])) as Settings;
