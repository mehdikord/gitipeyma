/**
 * Everything the public site reads from the database, mapped into the shapes in src/types.
 * Only active content is returned. Each read opts the page into rendering per request, so
 * changes made in the admin panel show on the next visit.
 */

import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { db } from '../../lib/db';
import { DEFAULT_SETTINGS, SETTING_KEYS, Settings } from '../settings/definitions';
import type { Prisma } from '../../generated/prisma/client';
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
  const rows = await db.setting.findMany({ where: { key: { in: SETTING_KEYS } } });
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) if (row.value !== null) settings[row.key as keyof Settings] = row.value;
  return settings;
});

const toStrings = (value: Prisma.JsonValue): string[] => (Array.isArray(value) ? value.map(String) : []);
const toNumbers = (value: Prisma.JsonValue): number[] => (Array.isArray(value) ? value.map(Number).filter(Number.isInteger) : []);

export const getSiteData = cache(async (): Promise<SiteData> => {
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
        name: office.name,
        role: office.role,
        country: office.country,
        addressFa: office.address,
        phones: toStrings(office.phones),
        email: office.email,
        workingHours: office.workingHours,
        schedule: { timeZone: office.timeZone, openHour: office.openHour, closeHour: office.closeHour, closedWeekdays: toNumbers(office.closedWeekdays) },
        at: [office.longitude, office.latitude],
      }),
    ),
    socials: socials.map((social): SocialLink => ({ id: Number(social.id), platform: social.platform, label: social.label, url: social.url, iconName: social.icon })),
    serviceLinks: services,
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

const toService = (service: ServiceRow): ServiceItem => ({
  id: Number(service.id),
  slug: service.slug,
  title: service.title,
  shortTitle: service.shortTitle,
  category: service.category.slug,
  categoryLabel: service.categoryLabel || service.category.title,
  eyebrow: service.eyebrow,
  summary: service.summary,
  description: service.description,
  detailedContent: (service.content ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
  features: service.features.map((feature) => feature.title),
  steps: service.steps.map((step) => ({ title: step.title, description: step.description })),
  faqs: service.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  image: service.image,
  icon: service.icon,
  badge: service.badge,
  highlight: service.isHighlighted,
});

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  await connection();
  const services = await db.service.findMany({ where: { isActive: true }, include: serviceInclude, orderBy: ordered });
  return services.map(toService);
});

export const getServiceBySlug = cache(async (slug: string): Promise<ServiceItem | null> => {
  await connection();
  const service = await db.service.findFirst({ where: { slug, isActive: true }, include: serviceInclude });
  return service ? toService(service) : null;
});

/** Categories that have at least one active service, for the filters on /services. */
export const getServiceCategories = cache(async (): Promise<ServiceCategoryItem[]> => {
  await connection();
  const categories = await db.serviceCategory.findMany({ where: { services: { some: { isActive: true } } }, orderBy: ordered });
  return categories.map((category) => ({ id: Number(category.id), slug: category.slug, title: category.title }));
});

/** Groups with their active services, leaving out any group that has none. */
export const getServiceGroups = cache(async (): Promise<ServiceGroupItem[]> => {
  await connection();
  const groups = await db.serviceGroup.findMany({
    orderBy: ordered,
    include: { services: { where: { isActive: true }, orderBy: ordered, select: { slug: true } } },
  });
  return groups
    .filter((group) => group.services.length > 0)
    .map((group) => ({ id: Number(group.id), title: group.title, tone: group.tone, slugs: group.services.map((service) => service.slug) }));
});

// ---- Home page -----------------------------------------------------------------------

const ratingText = (rating: number) => `${rating.toLocaleString('fa-IR')}.۰ / ۵.۰`;

export const getTestimonials = cache(async (): Promise<TestimonialItem[]> => {
  await connection();
  const testimonials = await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: ordered,
    include: { category: { select: { slug: true } }, milestones: { orderBy: ordered } },
  });
  return testimonials.map((item) => ({
    id: Number(item.id),
    clientName: item.clientName,
    serviceUsed: item.serviceTitle,
    routeOrContext: item.context ?? '',
    comment: item.comment,
    year: item.year ?? '',
    rating: item.rating,
    category: item.category?.slug,
    categoryLabel: item.categoryLabel ?? undefined,
    verifiedCode: item.verifiedCode ?? undefined,
    outcomeHeadline: item.outcomeHeadline ?? undefined,
    originDestination: item.originDestination ?? undefined,
    satisfactionScore: ratingText(item.rating),
    milestones: item.milestones.map((milestone) => ({ title: milestone.title, desc: milestone.description ?? '' })),
  }));
});

export const getMetrics = cache(async (): Promise<MetricItem[]> => {
  await connection();
  const metrics = await db.metric.findMany({ where: { isActive: true }, orderBy: ordered });
  return metrics.map((metric) => ({ id: Number(metric.id), value: metric.value, label: metric.label, subtext: metric.subtext ?? '', trend: metric.trend ?? '' }));
});

export const getTrustQuotes = cache(async (): Promise<string[]> => {
  await connection();
  const quotes = await db.trustQuote.findMany({ where: { isActive: true }, orderBy: ordered, select: { text: true } });
  return quotes.map((quote) => quote.text);
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  await connection();
  const members = await db.teamMember.findMany({ where: { isActive: true }, orderBy: ordered });
  return members.map((member) => ({
    id: Number(member.id),
    name: member.name,
    role: member.role,
    specialty: member.specialty ?? '',
    department: member.department ?? '',
    image: member.image,
  }));
});

// ---- Currency calculator -------------------------------------------------------------

export const getCurrencies = cache(async (): Promise<CurrencyRate[]> => {
  await connection();
  const currencies = await db.currency.findMany({ where: { isActive: true }, orderBy: ordered });
  return currencies.map((currency) => ({
    code: currency.code,
    nameFa: currency.name,
    symbol: currency.symbol,
    rateToToman: currency.rateToToman.toNumber(),
    flag: currency.flag ?? '',
  }));
});
