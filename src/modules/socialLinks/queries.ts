import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { asTranslated, Translated } from '../../i18n/translated';

export type SocialLinkRow = { id: number; platform: string; label: Translated; url: string; icon: string; isActive: boolean; sortOrder: number };

export async function listSocialLinks(): Promise<SocialLinkRow[]> {
  await requireRoot();
  const rows = await db.socialLink.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return rows.map(({ id, createdAt, updatedAt, label, ...row }) => ({ id: Number(id), ...row, label: asTranslated(label) }));
}
