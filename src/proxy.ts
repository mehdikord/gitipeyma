import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, readSession } from './lib/auth/session';

// A quick check before any admin page renders. It only looks at the cookie's signature; the pages
// and actions themselves confirm the admin against the database (lib/auth/currentAdmin.ts).
// The login page is left alone here: it sends a confirmed admin on to the panel itself, so a valid
// cookie for a deleted admin cannot bounce between the two.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admins/login') return NextResponse.next();

  const signedIn = (await readSession(request.cookies.get(SESSION_COOKIE)?.value)) !== null;
  if (signedIn) return NextResponse.next();

  const url = new URL('/admins/login', request.url);
  if (pathname !== '/admins') url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admins', '/admins/:path*'],
};
