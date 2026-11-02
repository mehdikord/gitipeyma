import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { SESSION_COOKIE, readSession } from './session';

export type CurrentAdmin = { id: bigint; name: string; phone: string };

/** The signed-in admin, or null. Read once per request however many places ask. */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const adminId = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!adminId) return null;
  return db.admin.findUnique({ where: { id: adminId }, select: { id: true, name: true, phone: true } });
});

/** Every admin page, and every admin action, starts here. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admins/login');
  return admin;
}
