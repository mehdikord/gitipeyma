import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/seo';

// Crawlers may read the whole public site; the admin panel and the form endpoints stay out.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await siteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admins', '/admins/'] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
