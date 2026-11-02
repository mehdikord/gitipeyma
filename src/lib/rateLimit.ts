import 'server-only';
import { headers } from 'next/headers';

/**
 * A fixed-window counter kept in memory. Enough for the single Node process the site runs as;
 * a multi-server deployment would move this to a shared store.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function tooManyAttempts(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

export function clearAttempts(key: string) {
  hits.delete(key);
}

export async function clientIp(): Promise<string> {
  const list = await headers();
  return list.get('x-forwarded-for')?.split(',')[0].trim() || list.get('x-real-ip') || 'local';
}
