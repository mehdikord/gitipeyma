import { lang } from 'next/root-params';
import { notFound } from 'next/navigation';
import { isLocale, Locale } from './config';
import { getDictionary } from './dictionaries';
import { makeI18n } from './make';

/** The language of the page being rendered, from the [lang] segment. Server Components only. */
export async function currentLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** The same helpers useI18n() gives client components, for Server Components and generateMetadata. */
export async function getI18n() {
  const locale = await currentLocale();
  return makeI18n(locale, getDictionary(locale));
}
