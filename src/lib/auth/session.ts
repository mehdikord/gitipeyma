/**
 * The admin session: a signed token (JWT) in an httpOnly cookie that only travels to /admins.
 * It holds the admin id and nothing else; who that admin is, and whether they still exist, is read
 * from the database on each request (see currentAdmin.ts).
 */

import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'giti_admin_session';
export const SESSION_PATH = '/admins';
const SESSION_DAYS = 7;

const secretKey = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set. Add it to .env (openssl rand -base64 32).');
  return new TextEncoder().encode(secret);
};

export async function signSession(adminId: bigint): Promise<{ token: string; expires: Date }> {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const token = await new SignJWT({ sub: adminId.toString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secretKey());
  return { token, expires };
}

/** The admin id in a valid session token, or null for a missing, forged or expired one. */
export async function readSession(token: string | undefined): Promise<bigint | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    return payload.sub && /^\d+$/.test(payload.sub) ? BigInt(payload.sub) : null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = (expires: Date) => ({
  httpOnly: true,
  // Plain-http deployments (no TLS yet) can set SESSION_SECURE_COOKIE=false.
  secure: process.env.NODE_ENV === 'production' && process.env.SESSION_SECURE_COOKIE !== 'false',
  sameSite: 'lax' as const,
  path: SESSION_PATH,
  expires,
});
