import type { Metadata } from 'next';
import { FALLBACKS, LOCALES, Locale, localePath } from './config';
import { currentLocale, getI18n } from './server';
import { DEFAULT_SHARE_IMAGE, OG_LOCALE } from '../lib/seo';

type PageMetaOptions = {
  image?: string | null;
  type?: 'website' | 'article';
  // The languages the page really exists in (an article may not be translated); default all three.
  // A visitor on another language sees a fallback copy, whose canonical is the original.
  locales?: Locale[];
  // Extra query for the address, e.g. "?page=2"
  query?: string;
  robots?: Metadata['robots'];
  article?: { publishedTime: string; modifiedTime: string; section?: string; tags?: string[] };
  // Advertise the blog's RSS feed in this language
  feed?: boolean;
};

/**
 * A page's title, description and social preview, plus its address in every language so search
 * engines link the three versions. "x-default" is the address without a language, which sends
 * each visitor to theirs. Addresses are made absolute by metadataBase in the [lang] layout.
 */
export async function pageMetadata(path: string, title?: string, description?: string, options: PageMetaOptions = {}): Promise<Metadata> {
  const locale = await currentLocale();
  const { t } = await getI18n();
  const meta = t.common.meta;
  const fullTitle = title ? meta.titleTemplate.replace('%s', title) : meta.title;
  const text = description?.trim() || meta.description;
  const query = options.query ?? '';
  const locales = options.locales?.length ? options.locales : [...LOCALES];
  const canonicalLocale = locales.includes(locale) ? locale : (FALLBACKS[locale].find((code) => locales.includes(code)) ?? locale);
  const url = localePath(canonicalLocale, path) + query;
  const image = options.image || DEFAULT_SHARE_IMAGE;
  const xDefault = locales.length === LOCALES.length ? path + query : localePath(locales[0], path) + query;

  return {
    title,
    description: text,
    robots: options.robots,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(locales.map((code) => [code, localePath(code, path) + query])), 'x-default': xDefault },
      types: options.feed ? { 'application/rss+xml': [{ url: localePath(locale, '/blog/feed.xml'), title: t.blog.meta.feed }] } : undefined,
    },
    openGraph: {
      type: options.type ?? 'website',
      url: localePath(locale, path) + query,
      siteName: t.common.brand,
      title: fullTitle,
      description: text,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((code) => code !== locale).map((code) => OG_LOCALE[code]),
      images: [{ url: image, alt: title ?? meta.title }],
      ...(options.article
        ? {
            publishedTime: options.article.publishedTime,
            modifiedTime: options.article.modifiedTime,
            section: options.article.section,
            tags: options.article.tags,
            authors: [t.common.brand],
          }
        : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: text, images: [image] },
  };
}

export { getI18n };
