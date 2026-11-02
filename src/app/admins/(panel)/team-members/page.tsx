import type { Metadata } from 'next';
import { listTeamMembers } from '../../../../modules/teamMembers/queries';
import { TeamMembersManager } from './TeamMembersManager';

export const metadata: Metadata = { title: 'اعضای تیم' };

export default async function TeamMembersPage() {
  return <TeamMembersManager rows={await listTeamMembers()} />;
}
