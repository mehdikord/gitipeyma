export type ServiceCategory = 'all' | 'transport' | 'cargo' | 'business' | 'immigration' | 'legal' | 'financial' | 'events';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: ServiceCategory;
  categoryLabel: string;
  eyebrow: string;
  summary: string;
  description: string;
  detailedContent: string[];
  features: string[];
  steps: {
    stepNumber: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  image: string;
  badge?: string;
  highlight?: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  serviceUsed: string;
  routeOrContext: string;
  comment: string;
  year: string;
  avatarSeed: string;
  rating: number;
  category?: 'transport' | 'cargo' | 'business' | 'immigration' | 'legal' | 'financial';
  categoryLabel?: string;
  verifiedCode?: string;
  outcomeHeadline?: string;
  originDestination?: string;
  satisfactionScore?: string;
  milestones?: { title: string; desc: string }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  department: string;
  image: string;
}

export interface ContactConfig {
  companyNameFa: string;
  companyNameEn: string;
  brandTaglineFa: string;
  brandTaglineEn: string;
  offices: {
    city: string;
    country: string;
    addressFa: string;
    phones: string[];
    email: string;
    workingHours: string;
    // The same hours as workingHours in a form the live status can compute with.
    schedule: { timeZone: string; openHour: number; closeHour: number; closedWeekdays: number[] };
    isPrimary?: boolean;
  }[];
  socials: {
    platform: string;
    label: string;
    url: string;
    iconName: string;
  }[];
  emergencySupportPhone: string;
  emergencySupportAvailability: string;
}
