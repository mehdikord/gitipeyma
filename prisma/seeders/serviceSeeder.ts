import type { Seeder } from '../seed';
import { SERVICES_DATA } from './data/services';
import { LINES } from './data/serviceGroups';
import { LOCALES } from '../../src/i18n/config';

// Category slugs with the label each one has in the /services filters.
export const CATEGORIES = [
  { slug: 'transport', title: { fa: 'حمل‌ونقل و اتوبوس VIP', en: 'Transport and VIP coaches', tr: 'Taşımacılık ve VIP otobüs' } },
  { slug: 'cargo', title: { fa: 'پست و کارگو تجاری', en: 'Post and commercial cargo', tr: 'Posta ve ticari kargo' } },
  { slug: 'business', title: { fa: 'تجارت و ثبت شرکت', en: 'Trade and company registration', tr: 'Ticaret ve şirket kuruluşu' } },
  { slug: 'immigration', title: { fa: 'اقامت، ویزا و تحصیلی', en: 'Residency, visas and study', tr: 'Oturum, vize ve eğitim' } },
  { slug: 'legal', title: { fa: 'امور حقوقی و ترجمه', en: 'Legal affairs and translation', tr: 'Hukuki işler ve tercüme' } },
  { slug: 'financial', title: { fa: 'حواله ارزی و سوئیفت', en: 'Currency transfers and SWIFT', tr: 'Döviz transferi ve SWIFT' } },
  { slug: 'events', title: { fa: 'تشریفات و ازدواج', en: 'Events and weddings', tr: 'Organizasyon ve düğün' } },
];

const ICONS: Record<string, string> = {
  'bus-vip-tehran-istanbul': 'Bus',
  'cargo-express-postal': 'Package',
  'cargo-customs-clearance': 'Boxes',
  'company-registration': 'Building2',
  'currency-exchange-swift': 'CircleDollarSign',
  'legal-power-of-attorney': 'FileSignature',
  'official-translation': 'Languages',
  'international-visa': 'Plane',
  'education-residence-permit': 'GraduationCap',
  'international-marriage': 'HeartHandshake',
  'turkey-weddings': 'PartyPopper',
};

export const serviceSeeder: Seeder = async (db) => {
  if (await db.service.count()) return;

  const categoryIds = new Map<string, bigint>();
  for (const [index, category] of CATEGORIES.entries()) {
    const row = await db.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: { ...category, sortOrder: index + 1 },
    });
    categoryIds.set(category.slug, row.id);
  }

  const groupIds = new Map<string, bigint>();
  for (const [index, line] of LINES.entries()) {
    const group = await db.serviceGroup.create({ data: { title: line.title, tone: line.tone, sortOrder: index + 1 } });
    line.slugs.forEach((slug) => groupIds.set(slug, group.id));
  }

  for (const [index, service] of SERVICES_DATA.entries()) {
    await db.service.create({
      data: {
        serviceCategoryId: categoryIds.get(service.category)!,
        serviceGroupId: groupIds.get(service.slug) ?? null,
        slug: service.slug,
        title: service.title,
        shortTitle: service.shortTitle,
        categoryLabel: service.categoryLabel,
        eyebrow: service.eyebrow,
        summary: service.summary,
        description: service.description,
        // One text per language, paragraphs separated by blank lines
        content: Object.fromEntries(LOCALES.map((locale) => [locale, service.detailedContent.map((paragraph) => paragraph[locale]).join('\n\n')])),
        image: service.image,
        icon: ICONS[service.slug] ?? null,
        badge: service.badge ?? {},
        isHighlighted: Boolean('highlight' in service && service.highlight),
        sortOrder: index + 1,
        features: { create: service.features.map((title, order) => ({ title, sortOrder: order + 1 })) },
        steps: { create: service.steps.map((step, order) => ({ title: step.title, description: step.description, sortOrder: order + 1 })) },
        faqs: { create: service.faqs.map((faq, order) => ({ question: faq.question, answer: faq.answer, sortOrder: order + 1 })) },
      },
    });
  }
};
