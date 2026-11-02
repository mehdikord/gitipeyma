import React from 'react';
import { AdminShell } from '../../../components/admin/layout/AdminShell';
import { requireAdmin } from '../../../lib/auth/currentAdmin';
import { getNavBadges } from '../../../modules/dashboard/queries';

// Every page under here also checks the admin itself (through its queries); this check draws the frame.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const badges = await getNavBadges();
  return (
    <AdminShell admin={{ name: admin.name, phone: admin.phone }} badges={badges}>
      {children}
    </AdminShell>
  );
}
