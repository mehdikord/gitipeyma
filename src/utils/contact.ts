/**
 * Helpers for showing and dialing the company's offices.
 */

import type { Office } from '../types';
import { LOCALE_INFO, Locale } from '../i18n/config';
import { fill, localizeDigits } from '../i18n/format';

export type { Office };

// Numbers in the data are for reading and may use Persian digits; dialing needs Latin ones.
export const telHref = (phone: string) =>
  `tel:${phone.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[^\d+]/g, '')}`;

export const localParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    minutes: Number(read('hour')) * 60 + Number(read('minute')),
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(read('weekday')),
  };
};

export const clockText = (date: Date, timeZone: string, locale: Locale = 'fa') =>
  new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);

export const hourText = (hour: number, locale: Locale = 'fa') => localizeDigits(`${String(hour).padStart(2, '0')}:00`, locale);

// The live open/closed line under each office, in each language.
const STATUS: Record<Locale, { nextDay: string; tomorrow: string; closedToday: string; opensAt: string; openUntil: string }> = {
  fa: {
    nextDay: 'در روز کاری بعدی باز می‌شود',
    tomorrow: 'فردا ساعت {hour} باز می‌شود',
    closedToday: 'امروز تعطیل است؛ {next}',
    opensAt: 'ساعت {hour} باز می‌شود',
    openUntil: 'باز است تا {hour}',
  },
  en: {
    nextDay: 'Opens on the next working day',
    tomorrow: 'Opens tomorrow at {hour}',
    closedToday: 'Closed today; {next}',
    opensAt: 'Opens at {hour}',
    openUntil: 'Open until {hour}',
  },
  tr: {
    nextDay: 'Bir sonraki iş günü açılır',
    tomorrow: 'Yarın {hour} itibarıyla açık',
    closedToday: 'Bugün kapalı; {next}',
    opensAt: '{hour} itibarıyla açık',
    openUntil: '{hour} saatine kadar açık',
  },
};

export const officeStatus = (office: Office, now: Date, locale: Locale = 'fa'): { isOpen: boolean; text: string } => {
  const { timeZone, openHour, closeHour, closedWeekdays } = office.schedule;
  const { minutes, weekday } = localParts(now, timeZone);
  const t = STATUS[locale];
  const tomorrowClosed = closedWeekdays.includes((weekday + 1) % 7);
  const nextOpen = tomorrowClosed ? t.nextDay : fill(t.tomorrow, { hour: hourText(openHour, locale) });
  // After the semicolon of "closed today" the next sentence goes on in lower case
  const clause = locale === 'fa' ? nextOpen : nextOpen.charAt(0).toLocaleLowerCase(LOCALE_INFO[locale].intl) + nextOpen.slice(1);
  if (closedWeekdays.includes(weekday)) return { isOpen: false, text: fill(t.closedToday, { next: clause }) };
  if (minutes < openHour * 60) return { isOpen: false, text: fill(t.opensAt, { hour: hourText(openHour, locale) }) };
  if (minutes >= closeHour * 60) return { isOpen: false, text: nextOpen };
  return { isOpen: true, text: fill(t.openUntil, { hour: hourText(closeHour, locale) }) };
};
