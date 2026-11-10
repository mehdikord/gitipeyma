import type { Metadata } from 'next';
import { listAdmins } from '../../../../modules/admins/queries';
import { serviceOptions } from '../../../../modules/serviceRequests/queries';
import { AdminsManager } from './AdminsManager';

export const metadata: Metadata = { title: 'مدیران' };

// Root admins only (listAdmins sends anyone else back to their requests).
export default async function AdminsPage() {
  const [rows, services] = await Promise.all([listAdmins(), serviceOptions()]);
  return <AdminsManager rows={rows} services={services} />;
}
