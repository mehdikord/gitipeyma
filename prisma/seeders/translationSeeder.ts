import type { Seeder } from '../seed';
import { LOCALES, SOURCE_LOCALE } from '../../src/i18n/config';
import { asTranslated, Translated } from '../../src/i18n/translated';
import { SETTING_FIELDS } from '../../src/modules/settings/definitions';
import { SERVICES_DATA } from './data/services';
import { LINES } from './data/serviceGroups';
import { COMPANY_CONFIG, TEAM_MEMBERS } from './data/company';
import { MARQUEE_TRUST_QUOTES, TESTIMONIALS_DATA, TESTIMONIALS_METRICS } from './data/testimonials';
import { CATEGORIES } from './serviceSeeder';
import { OFFICE_DETAILS } from './companySeeder';
import { CURRENCIES } from './currencySeeder';

/**
 * Adds English and Turkish to content that is still the starting content: wherever a translated
 * column's Persian text is exactly a Persian text from the seed data, the languages it is missing
 * are taken from there. A language that already has text is never touched, and a row whose Persian
 * was edited in the panel is left for the admin to translate. Safe to run again.
 */

// Every translated column, by Prisma model.
const COLUMNS = {
  serviceCategory: ['title'],
  serviceGroup: ['title'],
  service: ['title', 'shortTitle', 'categoryLabel', 'eyebrow', 'summary', 'description', 'content', 'badge'],
  serviceFeature: ['title'],
  serviceStep: ['title', 'description'],
  serviceFaq: ['question', 'answer'],
  testimonial: ['clientName', 'serviceTitle', 'context', 'comment', 'year', 'categoryLabel', 'verifiedCode', 'outcomeHeadline', 'originDestination'],
  testimonialMilestone: ['title', 'description'],
  metric: ['value', 'label', 'subtext', 'trend'],
  trustQuote: ['text'],
  teamMember: ['name', 'role', 'specialty', 'department'],
  office: ['name', 'role', 'country', 'address', 'workingHours'],
  socialLink: ['label'],
  currency: ['name'],
} as const;

const isTranslated = (value: unknown): value is Translated =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) && typeof (value as Translated)[SOURCE_LOCALE] === 'string';

// Persian text → its translations, from every { fa, en, tr } anywhere in the seed data.
function dictionary() {
  const found = new Map<string, Translated>();
  const walk = (value: unknown) => {
    if (isTranslated(value)) {
      const key = value[SOURCE_LOCALE]!.trim();
      if (key && !found.has(key)) found.set(key, value);
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk([CATEGORIES, LINES, TESTIMONIALS_METRICS, TESTIMONIALS_DATA, MARQUEE_TRUST_QUOTES, COMPANY_CONFIG, TEAM_MEMBERS, OFFICE_DETAILS, CURRENCIES]);
  walk(SETTING_FIELDS.map((field) => field.default));
  for (const service of SERVICES_DATA) {
    walk(service);
    // services.content holds the paragraphs joined, as serviceSeeder writes it
    walk(Object.fromEntries(LOCALES.map((locale) => [locale, service.detailedContent.map((paragraph) => paragraph[locale]).join('\n\n')])));
  }
  return found;
}

/** The value with the seed's translations added for missing languages, or null when nothing changes. */
function complete(value: unknown, known: Map<string, Translated>): Translated | null {
  const texts = asTranslated(value);
  const source = known.get(texts[SOURCE_LOCALE]?.trim() ?? '');
  if (!source) return null;
  const missing = LOCALES.filter((locale) => !texts[locale] && source[locale]);
  if (!missing.length) return null;
  return { ...texts, ...Object.fromEntries(missing.map((locale) => [locale, source[locale]])) };
}

export const translationSeeder: Seeder = async (db) => {
  const known = dictionary();
  let updated = 0;

  for (const [model, columns] of Object.entries(COLUMNS)) {
    // Each model's delegate has the same findMany/update shape; the column list varies
    const table = (db as unknown as Record<string, { findMany: Function; update: Function }>)[model];
    const rows: Record<string, unknown>[] = await table.findMany({ select: { id: true, ...Object.fromEntries(columns.map((column) => [column, true])) } });
    for (const row of rows) {
      const data: Record<string, Translated> = {};
      for (const column of columns) {
        const next = complete(row[column], known);
        if (next) data[column] = next;
      }
      if (Object.keys(data).length) {
        await table.update({ where: { id: row.id }, data });
        updated += 1;
      }
    }
  }

  // Translatable settings are JSON text in settings.value
  for (const field of SETTING_FIELDS.filter((setting) => setting.translatable)) {
    const row = await db.setting.findUnique({ where: { key: field.key } });
    if (!row?.value) continue;
    let stored: unknown = row.value;
    try {
      stored = JSON.parse(row.value);
    } catch {
      // An old plain Persian value
    }
    const next = complete(stored, known);
    if (next) {
      await db.setting.update({ where: { key: field.key }, data: { value: JSON.stringify(next) } });
      updated += 1;
    }
  }

  process.stdout.write(`  ${updated} rows given missing translations\n`);
};
