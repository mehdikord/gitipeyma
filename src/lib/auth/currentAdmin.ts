import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { SESSION_COOKIE, readSession } from './session';

/**
 * Two kinds of admin. A root admin (is_root = 1) can do everything. An internal admin only sees the
 * service requests of the services linked to them (admin_service), and their own profile.
 */
export type CurrentAdmin = {
  id: bigint;
  name: string;
  phone: string;
  isRoot: boolean;
  // The services an internal admin works on; empty for a root admin, who has them all.
  serviceIds: bigint[];
};

/** Where an internal admin lands, and is sent back to from anywhere they cannot go. */
export const STAFF_HOME = '/admins/service-requests';

/** The signed-in admin, or null. Read once per request however many places ask. */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const adminId = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!adminId) return null;
  const admin = await db.admin.findUnique({
    where: { id: adminId },
    select: { id: true, name: true, phone: true, isRoot: true, services: { select: { serviceId: true } } },
  });
  if (!admin) return null;
  const { services, ...rest } = admin;
  return { ...rest, serviceIds: admin.isRoot ? [] : services.map((link) => link.serviceId) };
});

/** Any signed-in admin, root or internal: the service requests and the admin's own profile. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admins/login');
  return admin;
}

/** Everything else in the panel. An internal admin who reaches it is sent to their requests. */
export async function requireRoot(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (!admin.isRoot) redirect(STAFF_HOME);
  return admin;
}
