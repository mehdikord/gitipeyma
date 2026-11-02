'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { SocialLinkInput, socialLinkSchema } from './schema';

export async function saveSocialLink(id: number | null, input: SocialLinkInput) {
  return adminAction(socialLinkSchema, input, async (data) => {
    if (id) await db.socialLink.update({ where: { id }, data });
    else await db.socialLink.create({ data });
  });
}

export async function deleteSocialLink(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.socialLink.delete({ where: { id: data.id } });
  });
}
