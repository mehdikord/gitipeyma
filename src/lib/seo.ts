import 'server-only';
import { headers } from 'next/headers';
import type { Locale } from '../i18n/config';

/**
 * The site's public origin ("https://royaltravel.example"), for canonical links, hreflang, the
 * sitemap and structured data, which all need full addresses. SITE_URL in .env wins; without it
 * the address the request came in on is used (behind nginx that needs X-Forwarded-Proto/Host).
 */
export async function siteUrl(): Promise<string> {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto')?.split(',')[0].trim() ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/** A path or an already full address, as a full address. */
export const absoluteUrl = (base: string, pathOrUrl: string) => (/^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${base}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`);

/** Open Graph's spelling of each language. */
export const OG_LOCALE: Record<Locale, string> = { fa: 'fa_IR', en: 'en_US', tr: 'tr_TR' };

/** The picture shown when a page without its own image is shared. */
export const DEFAULT_SHARE_IMAGE = '/images/about/istanbul-galata.webp';

/** JSON-LD for a <script> tag; "<" is escaped so content can never close the tag. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
