import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { db } from '../lib/db';
import { LOCALES, Locale, localePath } from '../i18n/config';
import { asTranslated } from '../i18n/translated';
import { absoluteUrl, siteUrl } from '../lib/seo';

/**
 * Every public page in all three languages, read from the database on each request so a service
 * or article added or edited in the admin panel shows up right away. Each entry lists its other-language
 * versions (hreflang) and its photo. An article is listed only in the languages it is written in.
 * Served at /sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = await siteUrl();

  const now = new Date();
  const [services, latestService, latestSetting, latestOffice, latestContent, articles] = await Promise.all([
    db.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: { slug: true, image: true, updatedAt: true },
    }),
    db.service.aggregate({ where: { isActive: true }, _max: { updatedAt: true } }),
    db.setting.aggregate({ _max: { updatedAt: true } }),
    db.office.aggregate({ _max: { updatedAt: true } }),
    db.testimonial.aggregate({ _max: { updatedAt: true } }),
    db.article.findMany({
      where: { status: 'published', publishedAt: { lte: now } },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      select: { slug: true, image: true, title: true, content: true, updatedAt: true },
    }),
  ]);
  const latestArticle = articles.reduce<Date | undefined>((latest, article) => (!latest || article.updatedAt > latest ? article.updatedAt : latest), undefined);

  const latest = (...dates: (Date | null | undefined)[]) => {
    const times = dates.filter((date): date is Date => !!date).map((date) => date.getTime());
    return times.length ? new Date(Math.max(...times)) : undefined;
  };
  const siteWide = latest(latestSetting._max.updatedAt, latestOffice._max.updatedAt);

  // One entry per language for a path, each pointing at the other two
  const entries = (
    path: string,
    options: { lastModified?: Date; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; images?: string[]; locales?: Locale[] },
  ): MetadataRoute.Sitemap => {
    const locales = options.locales ?? [...LOCALES];
    const languages = {
      ...Object.fromEntries(locales.map((code) => [code, absoluteUrl(base, localePath(code, path))])),
      'x-default': absoluteUrl(base, locales.length === LOCALES.length ? path : localePath(locales[0], path)),
    };
    return locales.map((locale) => ({
      url: absoluteUrl(base, localePath(locale, path)),
      lastModified: options.lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: { languages },
      images: options.images,
    }));
  };

  return [
    ...entries('/', { lastModified: latest(latestService._max.updatedAt, latestContent._max.updatedAt, latestArticle, siteWide), changeFrequency: 'daily', priority: 1 }),
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
    ...entries('/blog', {
      lastModified: latestArticle,
      changeFrequency: 'daily',
      priority: 0.8,
      images: articles.slice(0, 20).flatMap((article) => (article.image ? [absoluteUrl(base, article.image)] : [])),
    }),
    ...articles.flatMap((article) => {
      // Written in a language means it has a title and a body there
      const titles = asTranslated(article.title);
      const bodies = asTranslated(article.content);
      const locales = LOCALES.filter((code) => titles[code] && bodies[code]);
      if (!locales.length) return [];
      return entries(`/blog/${encodeURIComponent(article.slug)}`, {
        lastModified: article.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
        images: article.image ? [absoluteUrl(base, article.image)] : undefined,
        locales,
      });
    }),
    ...entries('/consultation', { lastModified: siteWide, changeFrequency: 'monthly', priority: 0.7 }),
    ...entries('/about', { lastModified: siteWide, changeFrequency: 'monthly', priority: 0.6 }),
    ...entries('/contact', { lastModified: siteWide, changeFrequency: 'monthly', priority: 0.6 }),
  ];
}

