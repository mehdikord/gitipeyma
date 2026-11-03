import type { Metadata } from 'next';
import { LOCALES, localePath } from './config';
import { currentLocale, getI18n } from './server';

/**
 * A page's title and its address in every language, so search engines link the three versions.
 * "x-default" is the address without a language, which sends each visitor to theirs.
 */
export async function pageMetadata(path: string, title?: string, description?: string): Promise<Metadata> {
  const locale = await currentLocale();
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...Object.fromEntries(LOCALES.map((code) => [code, localePath(code, path)])), 'x-default': path },
    },
  };
}

export { getI18n };
