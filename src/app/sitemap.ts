import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { db } from '../lib/db';
import { LOCALES, localePath } from '../i18n/config';
import { absoluteUrl, siteUrl } from '../lib/seo';

/**
 * Every public page in all three languages, read from the database on each request so a service
 * added or edited in the admin panel shows up right away. Each entry lists its other-language
 * versions (hreflang) and, for services, its photo. Served at /sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = await siteUrl();

  const [services, latestService, latestSetting, latestOffice, latestContent] = await Promise.all([
    db.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: { slug: true, image: true, updatedAt: true },
    }),
    db.service.aggregate({ where: { isActive: true }, _max: { updatedAt: true } }),
    db.setting.aggregate({ _max: { updatedAt: true } }),
    db.office.aggregate({ _max: { updatedAt: true } }),
    db.testimonial.aggregate({ _max: { updatedAt: true } }),
  ]);

  const latest = (...dates: (Date | null | undefined)[]) => {
    const times = dates.filter((date): date is Date => !!date).map((date) => date.getTime());
    return times.length ? new Date(Math.max(...times)) : undefined;
  };
  const siteWide = latest(latestSetting._max.updatedAt, latestOffice._max.updatedAt);

  // One entry per language for a path, each pointing at the other two
  const entries = (
    path: string,
    options: { lastModified?: Date; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; images?: string[] },
  ): MetadataRoute.Sitemap => {
    const languages = {
      ...Object.fromEntries(LOCALES.map((code) => [code, absoluteUrl(base, localePath(code, path))])),
      'x-default': absoluteUrl(base, path),
    };
    return LOCALES.map((locale) => ({
      url: absoluteUrl(base, localePath(locale, path)),
      lastModified: options.lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: { languages },
      images: options.images,
    }));
  };

  return [
    ...entries('/', { lastModified: latest(latestService._max.updatedAt, latestContent._max.updatedAt, siteWide), changeFrequency: 'daily', priority: 1 }),
    ...entries('/services', {
      lastModified: latestService._max.updatedAt ?? undefined,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: services.flatMap((service) => (service.image ? [absoluteUrl(base, service.image)] : [])),
    }),
    ...services.flatMap((service) =>
      entries(`/services/${encodeURIComponent(service.slug)}`, {
        lastModified: service.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
        images: service.image ? [absoluteUrl(base, service.image)] : undefined,
      }),
    ),
    ...entries('/consultation', { lastModified: siteWide, changeFrequency: 'monthly', priority: 0.7 }),
    ...entries('/about', { lastModified: siteWide, changeFrequency: 'monthly', priority: 0.6 }),
    ...entries('/contact', { lastModified: siteWide, changeFrequency: 'monthly', priority: 0.6 }),
  ];
}

