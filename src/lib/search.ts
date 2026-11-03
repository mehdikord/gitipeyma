import { LOCALES } from '../i18n/config';

/**
 * Conditions for the panel's search boxes on a translated JSON column: the text in any language.
 * Spread them into an OR: { OR: [...textSearch('title', q), { slug: { contains: q } }] }
 */
export const textSearch = (field: string, q: string) => LOCALES.map((locale) => ({ [field]: { path: `$.${locale}`, string_contains: q } }));
