'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { TeamMemberInput, teamMemberSchema } from './schema';

export async function saveTeamMember(id: number | null, input: TeamMemberInput) {
  return adminAction(teamMemberSchema, input, async (data) => {
    if (id) await db.teamMember.update({ where: { id }, data });
    else await db.teamMember.create({ data });
  });
}

export async function deleteTeamMember(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.teamMember.delete({ where: { id: data.id } });
  });
}
