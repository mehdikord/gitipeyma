import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type OfficeRow = {
  id: number;
  name: Translated;
  role: Translated;
  country: Translated;
  address: Translated;
  phones: string[];
  email: string | null;
  workingHours: Translated;
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
  return rows.map(({ id, createdAt, updatedAt, phones, closedWeekdays, name, role, country, address, workingHours, ...row }) => ({
    id: Number(id),
    ...row,
    name: asTranslated(name),
    role: asTranslated(role),
    country: asTranslated(country),
    address: asTranslated(address),
    workingHours: asTranslated(workingHours),
    phones: Array.isArray(phones) ? phones.map(String) : [],
    closedWeekdays: Array.isArray(closedWeekdays) ? closedWeekdays.map(Number) : [],
  }));
}
