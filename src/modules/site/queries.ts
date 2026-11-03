/**
 * Everything the public site reads from the database, mapped into the shapes in src/types.
 * Translated columns come out as plain text in the language of the page being rendered (the [lang]
 * segment, read with currentLocale()), so components never see the JSON. Only active content is returned. Each read opts the page into rendering per request, so
 * changes made in the admin panel show on the next visit.
 */

import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { db } from '../../lib/db';
import { SETTING_FIELDS, SETTING_KEYS, Settings } from '../settings/definitions';
import { currentLocale } from '../../i18n/server';
import { formatNumber } from '../../i18n/format';
import { pick, pickOrNull } from '../../i18n/translated';
import type { Prisma } from '../../generated/prisma/client';
import type { Locale } from '../../i18n/config';
import type {
  CurrencyRate,
  MetricItem,
  Office,
  ServiceCategoryItem,
  ServiceGroupItem,
  ServiceItem,
  SiteData,
  SocialLink,
  TeamMember,
  TestimonialItem,
} from '../../types';

const ordered = [{ sortOrder: 'asc' as const }, { id: 'asc' as const }];

// ---- Settings, offices and links: the frame around every page --------------------------

export const getSettings = cache(async (): Promise<Settings> => {
  await connection();
  const locale = await currentLocale();
  const rows = await db.setting.findMany({ where: { key: { in: SETTING_KEYS } } });
  const stored = new Map(rows.map((row) => [row.key, row.value]));
  const settings = {} as Settings;
  for (const field of SETTING_FIELDS) {
    const value = stored.get(field.key) ?? null;
    if (!field.translatable) settings[field.key] = value ?? (field.default as string);
    else settings[field.key] = pick(parseJson(value), locale) || pick(field.default, locale);
  }
  return settings;
});

const parseJson = (value: string | null): unknown => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};

const toStrings = (value: Prisma.JsonValue): string[] => (Array.isArray(value) ? value.map(String) : []);
const toNumbers = (value: Prisma.JsonValue): number[] => (Array.isArray(value) ? value.map(Number).filter(Number.isInteger) : []);

export const getSiteData = cache(async (): Promise<SiteData> => {
  const locale = await currentLocale();
  const [settings, offices, socials, services] = await Promise.all([
    getSettings(),
    db.office.findMany({ where: { isActive: true }, orderBy: ordered }),
    db.socialLink.findMany({ where: { isActive: true }, orderBy: ordered }),
    db.service.findMany({ where: { isActive: true }, orderBy: ordered, select: { slug: true, shortTitle: true } }),
  ]);

  return {
    settings,
    offices: offices.map(
      (office): Office => ({
        id: Number(office.id),
        name: pick(office.name, locale),
        role: pick(office.role, locale),
        country: pick(office.country, locale),
        address: pick(office.address, locale),
        phones: toStrings(office.phones),
        email: office.email,
        workingHours: pick(office.workingHours, locale),
        schedule: { timeZone: office.timeZone, openHour: office.openHour, closeHour: office.closeHour, closedWeekdays: toNumbers(office.closedWeekdays) },
        at: [office.longitude, office.latitude],
      }),
    ),
    socials: socials.map((social): SocialLink => ({ id: Number(social.id), platform: social.platform, label: pick(social.label, locale), url: social.url, iconName: social.icon })),
    serviceLinks: services.map((service) => ({ slug: service.slug, shortTitle: pick(service.shortTitle, locale) })),
  };
});

// ---- Services ------------------------------------------------------------------------

const serviceInclude = {
  category: true,
  features: { orderBy: ordered },
  steps: { orderBy: ordered },
  faqs: { orderBy: ordered },
} satisfies Prisma.ServiceInclude;

type ServiceRow = Prisma.ServiceGetPayload<{ include: typeof serviceInclude }>;

const toService = (service: ServiceRow, locale: Locale): ServiceItem => ({
  id: Number(service.id),
  slug: service.slug,
  title: pick(service.title, locale),
  shortTitle: pick(service.shortTitle, locale),
  category: service.category.slug,
  categoryLabel: pick(service.categoryLabel, locale) || pick(service.category.title, locale),
  eyebrow: pickOrNull(service.eyebrow, locale),
  summary: pick(service.summary, locale),
  description: pick(service.description, locale),
  detailedContent: pick(service.content, locale)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
  features: service.features.map((feature) => pick(feature.title, locale)),
  steps: service.steps.map((step) => ({ title: pick(step.title, locale), description: pick(step.description, locale) })),
  faqs: service.faqs.map((faq) => ({ question: pick(faq.question, locale), answer: pick(faq.answer, locale) })),
  image: service.image,
  icon: service.icon,
  badge: pickOrNull(service.badge, locale),
  highlight: service.isHighlighted,
});

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  await connection();
  const locale = await currentLocale();
  const services = await db.service.findMany({ where: { isActive: true }, include: serviceInclude, orderBy: ordered });
  return services.map((service) => toService(service, locale));
});

export const getServiceBySlug = cache(async (slug: string): Promise<ServiceItem | null> => {
  await connection();
  const locale = await currentLocale();
  const service = await db.service.findFirst({ where: { slug, isActive: true }, include: serviceInclude });
  return service ? toService(service, locale) : null;
});

/** Categories that have at least one active service, for the filters on /services. */
export const getServiceCategories = cache(async (): Promise<ServiceCategoryItem[]> => {
  await connection();
  const locale = await currentLocale();
  const categories = await db.serviceCategory.findMany({ where: { services: { some: { isActive: true } } }, orderBy: ordered });
  return categories.map((category) => ({ id: Number(category.id), slug: category.slug, title: pick(category.title, locale) }));
});

/** Groups with their active services, leaving out any group that has none. */
export const getServiceGroups = cache(async (): Promise<ServiceGroupItem[]> => {
  await connection();
  const locale = await currentLocale();
  const groups = await db.serviceGroup.findMany({
    orderBy: ordered,
    include: { services: { where: { isActive: true }, orderBy: ordered, select: { slug: true } } },
  });
  return groups
    .filter((group) => group.services.length > 0)
    .map((group) => ({ id: Number(group.id), title: pick(group.title, locale), tone: group.tone, slugs: group.services.map((service) => service.slug) }));
});

// ---- Home page -----------------------------------------------------------------------

const ratingText = (rating: number, locale: Locale) => {
  const score = (value: number) => formatNumber(value, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${score(rating)} / ${score(5)}`;
};

export const getTestimonials = cache(async (): Promise<TestimonialItem[]> => {
  await connection();
  const locale = await currentLocale();
  const testimonials = await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: ordered,
    include: { category: { select: { slug: true } }, milestones: { orderBy: ordered } },
  });
  return testimonials.map((item) => ({
    id: Number(item.id),
    clientName: pick(item.clientName, locale),
    serviceUsed: pick(item.serviceTitle, locale),
    routeOrContext: pick(item.context, locale),
    comment: pick(item.comment, locale),
    year: pick(item.year, locale),
    rating: item.rating,
    category: item.category?.slug,
    categoryLabel: pickOrNull(item.categoryLabel, locale) ?? undefined,
    verifiedCode: pickOrNull(item.verifiedCode, locale) ?? undefined,
    outcomeHeadline: pickOrNull(item.outcomeHeadline, locale) ?? undefined,
    originDestination: pickOrNull(item.originDestination, locale) ?? undefined,
    satisfactionScore: ratingText(item.rating, locale),
    milestones: item.milestones.map((milestone) => ({ title: pick(milestone.title, locale), desc: pick(milestone.description, locale) })),
  }));
});

export const getMetrics = cache(async (): Promise<MetricItem[]> => {
  await connection();
  const locale = await currentLocale();
  const metrics = await db.metric.findMany({ where: { isActive: true }, orderBy: ordered });
  return metrics.map((metric) => ({
    id: Number(metric.id),
    value: pick(metric.value, locale),
    label: pick(metric.label, locale),
    subtext: pick(metric.subtext, locale),
    trend: pick(metric.trend, locale),
  }));
});

export const getTrustQuotes = cache(async (): Promise<string[]> => {
  await connection();
  const locale = await currentLocale();
  const quotes = await db.trustQuote.findMany({ where: { isActive: true }, orderBy: ordered, select: { text: true } });
  return quotes.map((quote) => pick(quote.text, locale)).filter(Boolean);
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  await connection();
  const locale = await currentLocale();
  const members = await db.teamMember.findMany({ where: { isActive: true }, orderBy: ordered });
  return members.map((member) => ({
    id: Number(member.id),
    name: pick(member.name, locale),
    role: pick(member.role, locale),
    specialty: pick(member.specialty, locale),
    department: pick(member.department, locale),
    image: member.image,
  }));
});

// ---- Currency calculator -------------------------------------------------------------

export const getCurrencies = cache(async (): Promise<CurrencyRate[]> => {
  await connection();
  const locale = await currentLocale();
  const currencies = await db.currency.findMany({ where: { isActive: true }, orderBy: ordered });
  return currencies.map((currency) => ({
    code: currency.code,
    name: pick(currency.name, locale),
    symbol: currency.symbol,
    rateToToman: currency.rateToToman.toNumber(),
    flag: currency.flag ?? '',
  }));
});
