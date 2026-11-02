// When a visitor asks to be called back. The key is what consultation_requests.call_time stores.
export const CALL_TIMES = [
  { key: 'morning', title: 'صبح تا ظهر', hours: '۰۹:۰۰ تا ۱۴:۰۰' },
  { key: 'afternoon', title: 'عصر', hours: '۱۴:۰۰ تا ۱۹:۰۰' },
  { key: 'asap', title: 'فوری', hours: 'در اولین فرصت' },
] as const;

export type CallTimeKey = (typeof CALL_TIMES)[number]['key'];

export const CALL_TIME_KEYS = CALL_TIMES.map((time) => time.key) as [CallTimeKey, ...CallTimeKey[]];

export const callTimeText = (key: string) => {
  const time = CALL_TIMES.find((item) => item.key === key);
  return time ? `${time.title} (${time.hours})` : key;
};
