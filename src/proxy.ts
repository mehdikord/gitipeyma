import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, readSession } from './lib/auth/session';
import { isLocale, LOCALE_COOKIE, localeForCountry } from './i18n/config';
import { countryOfRequest } from './i18n/geo/country';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admins' || pathname.startsWith('/admins/')) return adminGate(request);
  return localeGate(request);
}

// A quick check before any admin page renders. It only looks at the cookie's signature; the pages
// and actions themselves confirm the admin against the database (lib/auth/currentAdmin.ts).
// The login page is left alone here: it sends a confirmed admin on to the panel itself, so a valid
// cookie for a deleted admin cannot bounce between the two.
async function adminGate(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admins/login') return NextResponse.next();

  const signedIn = (await readSession(request.cookies.get(SESSION_COOKIE)?.value)) !== null;
  if (signedIn) return NextResponse.next();

  const url = new URL('/admins/login', request.url);
  if (pathname !== '/admins') url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

// Every public page lives under its language (/fa, /en, /tr). An address without one is sent to the
// visitor's language: the one they last picked in the switcher, else Persian from Iran, Turkish from
// Turkey and English from anywhere else.
function localeGate(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isLocale(pathname.split('/')[1])) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : localeForCountry(countryOfRequest(request.headers));
  const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}${search}`, request.url);
  // Not cached: the next visitor may be in another country
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'Cookie');
  return response;
}

export const config = {
  // Everything but Next's own files, uploads, the images in public/ and other files with an extension
  matcher: ['/((?!_next/|uploads/|images/|hero/|favicon|.*\\.[a-zA-Z0-9]+$).*)'],
};
