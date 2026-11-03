import 'server-only';
import type { Locale } from '../config';
import { common } from './common';
import { layout } from './layout';
import { forms } from './forms';
import { home } from './home';
import { stories } from './stories';
import { about } from './about';
import { contact } from './contact';
import { consultation } from './consultation';
import { services } from './services';

// Each namespace is one file with fa, en and tr side by side.
const NAMESPACES = { common, layout, forms, home, stories, about, contact, consultation, services };

type Namespaces = typeof NAMESPACES;
export type Dictionary = { [K in keyof Namespaces]: Namespaces[K]['fa'] };

const cache = new Map<Locale, Dictionary>();

export function getDictionary(locale: Locale): Dictionary {
  let dictionary = cache.get(locale);
  if (!dictionary) {
    dictionary = Object.fromEntries(Object.entries(NAMESPACES).map(([name, messages]) => [name, messages[locale]])) as Dictionary;
    cache.set(locale, dictionary);
  }
  return dictionary;
}
