import type { RequestStatus } from '../../generated/prisma/enums';

// Shared by service and consultation requests.
export const REQUEST_STATUSES: { key: RequestStatus; label: string; tone: 'amber' | 'blue' | 'green' | 'gray' }[] = [
  { key: 'pending', label: 'جدید', tone: 'amber' },
  { key: 'in_progress', label: 'در حال پیگیری', tone: 'blue' },
  { key: 'completed', label: 'انجام‌شده', tone: 'green' },
  { key: 'cancelled', label: 'لغوشده', tone: 'gray' },
];

export const REQUEST_STATUS_KEYS = REQUEST_STATUSES.map((status) => status.key) as [RequestStatus, ...RequestStatus[]];

export const requestStatus = (key: string) => REQUEST_STATUSES.find((status) => status.key === key) ?? REQUEST_STATUSES[0];
