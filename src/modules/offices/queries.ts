import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type OfficeRow = {
  id: number;
  name: string;
  role: string;
  country: string;
  address: string;
  phones: string[];
  email: string | null;
  workingHours: string;
  timeZone: string;
  openHour: number;
  closeHour: number;
  closedWeekdays: number[];
  latitude: number;
  longitude: number;
  isActive: boolean;
  sortOrder: number;
};

export async function listOffices(): Promise<OfficeRow[]> {
  await requireAdmin();
  const rows = await db.office.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map(({ id, createdAt, updatedAt, phones, closedWeekdays, ...row }) => ({
    id: Number(id),
    ...row,
    phones: Array.isArray(phones) ? phones.map(String) : [],
    closedWeekdays: Array.isArray(closedWeekdays) ? closedWeekdays.map(Number) : [],
  }));
}
