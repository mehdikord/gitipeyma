// The shapes the public site renders. They are built from the database in src/modules/site/queries.ts
// and are plain, serializable objects, so they pass from server pages into client components as-is.

import type { Settings } from '../modules/settings/definitions';

export interface ServiceItem {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  // The category's slug, e.g. "cargo".
  category: string;
  categoryLabel: string;
  eyebrow: string | null;
  summary: string;
  description: string;
  detailedContent: string[];
  features: string[];
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  image: string | null;
  icon: string | null;
  badge: string | null;
  highlight: boolean;
}

export interface ServiceCategoryItem {
  id: number;
  slug: string;
  title: string;
}

export type Tone = 'teal' | 'gold';

// What the visitor came to do, with the services under it in order.
export interface ServiceGroupItem {
  id: number;
  title: string;
  tone: Tone;
  slugs: string[];
}

export interface TestimonialItem {
  id: number;
  clientName: string;
  serviceUsed: string;
  routeOrContext: string;
  comment: string;
  year: string;
  rating: number;
  category?: string;
  categoryLabel?: string;
  verifiedCode?: string;
  outcomeHeadline?: string;
  originDestination?: string;
  satisfactionScore: string;
  milestones: { title: string; desc: string }[];
}

export interface MetricItem {
  id: number;
  value: string;
  label: string;
  subtext: string;
  trend: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialty: string;
  department: string;
  image: string | null;
}

export interface Office {
  id: number;
  // Short name ("استانبول") and what the office does ("دفتر مرکزی ترکیه").
  name: string;
  role: string;
  country: string;
  addressFa: string;
  phones: string[];
  email: string | null;
  workingHours: string;
  // The same hours as workingHours in a form the live status can compute with.
  schedule: { timeZone: string; openHour: number; closeHour: number; closedWeekdays: number[] };
  // [longitude, latitude], for the maps.
  at: readonly [number, number];
}

export interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
  iconName: string;
}

export interface CurrencyRate {
  code: string;
  nameFa: string;
  symbol: string;
  rateToToman: number;
  flag: string;
}

// What every public page needs: the header, the footer and the contact details.
export interface SiteData {
  settings: Settings;
  offices: Office[];
  socials: SocialLink[];
  serviceLinks: { slug: string; shortTitle: string }[];
}
