import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type TeamMemberRow = { id: number; name: string; role: string; specialty: string | null; department: string | null; image: string | null; isActive: boolean; sortOrder: number };

export async function listTeamMembers(): Promise<TeamMemberRow[]> {
  await requireAdmin();
  const rows = await db.teamMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map(({ id, createdAt, updatedAt, ...row }) => ({ id: Number(id), ...row }));
}
