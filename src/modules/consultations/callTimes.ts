import type { Locale } from '../../i18n/config';

// When a visitor asks to be called back. The key is what consultation_requests.call_time stores.
export const CALL_TIMES = [
  { key: 'morning', title: 'صبح تا ظهر', hours: '۰۹:۰۰ تا ۱۴:۰۰' },
  { key: 'afternoon', title: 'عصر', hours: '۱۴:۰۰ تا ۱۹:۰۰' },
  { key: 'asap', title: 'فوری', hours: 'در اولین فرصت' },
] as const;

export type CallTimeKey = (typeof CALL_TIMES)[number]['key'];

export const CALL_TIME_KEYS = CALL_TIMES.map((time) => time.key) as [CallTimeKey, ...CallTimeKey[]];

// The same times as the site shows them in each language; Persian is CALL_TIMES itself.
const LABELS: Record<Exclude<Locale, 'fa'>, Record<CallTimeKey, { title: string; hours: string }>> = {
  en: {
    morning: { title: 'Morning', hours: '09:00 to 14:00' },
    afternoon: { title: 'Afternoon', hours: '14:00 to 19:00' },
    asap: { title: 'Urgent', hours: 'As soon as possible' },
  },
  tr: {
    morning: { title: 'Sabah', hours: '09:00 – 14:00' },
    afternoon: { title: 'Öğleden sonra', hours: '14:00 – 19:00' },
    asap: { title: 'Acil', hours: 'En kısa sürede' },
  },
};

export const callTimeLabel = (key: CallTimeKey, locale: Locale = 'fa') =>
  locale === 'fa' ? CALL_TIMES.find((time) => time.key === key)! : LABELS[locale][key];

/** "Morning (09:00 to 14:00)"; Persian by default, as the admin panel shows it. */
export const callTimeText = (key: string, locale: Locale = 'fa') => {
  if (!CALL_TIME_KEYS.includes(key as CallTimeKey)) return key;
  const time = callTimeLabel(key as CallTimeKey, locale);
  return `${time.title} (${time.hours})`;
};
