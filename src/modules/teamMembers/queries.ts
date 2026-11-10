import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type TeamMemberRow = { id: number; name: Translated; role: Translated; specialty: Translated; department: Translated; image: string | null; isActive: boolean; sortOrder: number };

export async function listTeamMembers(): Promise<TeamMemberRow[]> {
  await requireRoot();
  const rows = await db.teamMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map((row) => ({
    id: Number(row.id),
    name: asTranslated(row.name),
    role: asTranslated(row.role),
    specialty: asTranslated(row.specialty),
    department: asTranslated(row.department),
    image: row.image,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  }));
}
