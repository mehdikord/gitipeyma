// The call-back windows the old three-step consultation form offered. New requests no longer choose one;
// the admin panel still reads consultation_requests.call_time of older requests through here.
export const CALL_TIMES = [
  { key: 'morning', title: 'صبح تا ظهر', hours: '۰۹:۰۰ تا ۱۴:۰۰' },
  { key: 'afternoon', title: 'عصر', hours: '۱۴:۰۰ تا ۱۹:۰۰' },
  { key: 'asap', title: 'فوری', hours: 'در اولین فرصت' },
] as const;

/** "صبح تا ظهر (۰۹:۰۰ تا ۱۴:۰۰)", or the stored key itself if it is not one of them. */
export const callTimeText = (key: string) => {
  const time = CALL_TIMES.find((candidate) => candidate.key === key);
  return time ? `${time.title} (${time.hours})` : key;
};
