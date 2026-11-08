import type { Metadata } from 'next';
import { LOCALES, localePath } from './config';
import { currentLocale, getI18n } from './server';
import { DEFAULT_SHARE_IMAGE, OG_LOCALE } from '../lib/seo';

type PageMetaOptions = { image?: string | null; type?: 'website' | 'article' };

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
  const url = localePath(locale, path);
  const image = options.image || DEFAULT_SHARE_IMAGE;

  return {
    title,
    description: text,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(LOCALES.map((code) => [code, localePath(code, path)])), 'x-default': path },
    },
    openGraph: {
      type: options.type ?? 'website',
      url,
      siteName: t.common.brand,
      title: fullTitle,
      description: text,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((code) => code !== locale).map((code) => OG_LOCALE[code]),
      images: [{ url: image, alt: title ?? meta.title }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: text, images: [image] },
  };
}

export { getI18n };
