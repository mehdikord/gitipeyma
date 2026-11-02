import type { Metadata } from 'next';
import { listAdmins } from '../../../../modules/admins/queries';
import { AdminsManager } from './AdminsManager';

export const metadata: Metadata = { title: 'مدیران' };

export default async function AdminsPage() {
  return <AdminsManager rows={await listAdmins()} />;
}
