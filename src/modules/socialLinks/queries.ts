import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';

export type SocialLinkRow = { id: number; platform: string; label: string; url: string; icon: string; isActive: boolean; sortOrder: number };

export async function listSocialLinks(): Promise<SocialLinkRow[]> {
  await requireAdmin();
  const rows = await db.socialLink.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map(({ id, createdAt, updatedAt, ...row }) => ({ id: Number(id), ...row }));
}
