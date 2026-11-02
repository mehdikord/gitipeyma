'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../lib/db';
import { ActionResult, FormError, publicAction } from '../../lib/actions';
import { verifyPassword } from '../../lib/auth/password';
import { SESSION_COOKIE, SESSION_PATH, sessionCookieOptions, signSession } from '../../lib/auth/session';
import { clearAttempts, clientIp, tooManyAttempts } from '../../lib/rateLimit';
import { LoginInput, loginSchema } from './schema';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

// Only admin pages may be the target after signing in, so the link can't send anyone elsewhere.
const safeNext = (next: string | undefined) => (next && /^\/admins(\/[\w\-/]*)?$/.test(next) ? next : '/admins');

export async function login(input: LoginInput, next?: string): Promise<ActionResult> {
  const result = await publicAction(loginSchema, input, async ({ phone, password }) => {
    const key = `login:${await clientIp()}:${phone}`;
    if (tooManyAttempts(key, MAX_ATTEMPTS, LOCK_MS)) {
      throw new FormError('تعداد تلاش‌های ناموفق زیاد بوده است. ۱۵ دقیقه دیگر دوباره تلاش کنید.');
    }

    const admin = await db.admin.findUnique({ where: { phone } });
    // The same message either way, so the form does not reveal which numbers are admins
    if (!admin || !(await verifyPassword(password, admin.password))) {
      throw new FormError('شماره موبایل یا رمز عبور اشتباه است.');
    }

    clearAttempts(key);
    await db.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    const { token, expires } = await signSession(admin.id);
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  });

  if (result.ok) redirect(safeNext(next));
  return result;
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: SESSION_PATH });
  redirect('/admins/login');
}
