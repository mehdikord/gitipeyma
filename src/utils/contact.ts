/**
 * Helpers for showing and dialing the company's offices.
 */

import type { Office } from '../types';

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

export const clockText = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('fa-IR', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);

export const hourText = (hour: number) => `${String(hour).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}:۰۰`;

export const officeStatus = (office: Office, now: Date): { isOpen: boolean; text: string } => {
  const { timeZone, openHour, closeHour, closedWeekdays } = office.schedule;
  const { minutes, weekday } = localParts(now, timeZone);
  const tomorrowClosed = closedWeekdays.includes((weekday + 1) % 7);
  const nextOpen = tomorrowClosed ? 'در روز کاری بعدی باز می‌شود' : `فردا ساعت ${hourText(openHour)} باز می‌شود`;
  if (closedWeekdays.includes(weekday)) return { isOpen: false, text: `امروز تعطیل است؛ ${nextOpen}` };
  if (minutes < openHour * 60) return { isOpen: false, text: `ساعت ${hourText(openHour)} باز می‌شود` };
  if (minutes >= closeHour * 60) return { isOpen: false, text: nextOpen };
  return { isOpen: true, text: `باز است تا ${hourText(closeHour)}` };
};
