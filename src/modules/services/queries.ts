import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { param } from '../../lib/pagination';
import type { Prisma } from '../../generated/prisma/client';
import { asTranslated, fa, Translated } from '../../i18n/translated';
import { textSearch } from '../../lib/search';

const ordered = [{ sortOrder: 'asc' as const }, { id: 'asc' as const }];

export type ServiceAdminRow = {
  id: number;
  title: Translated;
  shortTitle: Translated;
  slug: string;
  serviceCategoryId: number;
  serviceGroupId: number | null;
  categoryTitle: string;
  groupTitle: string | null;
  categoryLabel: Translated;
  eyebrow: Translated;
  badge: Translated;
  icon: string | null;
  image: string | null;
  summary: Translated;
  description: Translated;
  content: Translated;
  isActive: boolean;
  isHighlighted: boolean;
  sortOrder: number;
  features: { title: Translated }[];
  steps: { title: Translated; description: Translated }[];
  faqs: { question: Translated; answer: Translated }[];
  requestCount: number;
  pendingCount: number;
};

export async function listServicesForAdmin(params: Record<string, string | string[] | undefined>): Promise<ServiceAdminRow[]> {
  await requireAdmin();
  const q = param(params, 'q');
  const category = Number(param(params, 'category'));
  const state = param(params, 'state');
  const where: Prisma.ServiceWhereInput = {
    serviceCategoryId: category > 0 ? category : undefined,
    isActive: state === 'active' ? true : state === 'inactive' ? false : undefined,
    OR: q ? [...textSearch('title', q), ...textSearch('shortTitle', q), { slug: { contains: q } }] : undefined,
  };

  const [services, pending] = await Promise.all([
    db.service.findMany({
      where,
      orderBy: ordered,
      include: {
        category: { select: { title: true } },
        group: { select: { title: true } },
        features: { orderBy: ordered },
        steps: { orderBy: ordered },
        faqs: { orderBy: ordered },
        _count: { select: { requests: true } },
      },
    }),
    db.serviceRequest.groupBy({ by: ['serviceId'], where: { status: 'pending' }, _count: { _all: true } }),
  ]);
  const pendingBy = new Map(pending.map((row) => [Number(row.serviceId), row._count._all]));

  return services.map((service) => ({
    id: Number(service.id),
    title: asTranslated(service.title),
    shortTitle: asTranslated(service.shortTitle),
    slug: service.slug,
    serviceCategoryId: Number(service.serviceCategoryId),
    serviceGroupId: service.serviceGroupId === null ? null : Number(service.serviceGroupId),
    categoryTitle: fa(service.category.title),
    groupTitle: service.group ? fa(service.group.title) : null,
    categoryLabel: asTranslated(service.categoryLabel),
    eyebrow: asTranslated(service.eyebrow),
    badge: asTranslated(service.badge),
    icon: service.icon,
    image: service.image,
    summary: asTranslated(service.summary),
    description: asTranslated(service.description),
    content: asTranslated(service.content),
    isActive: service.isActive,
    isHighlighted: service.isHighlighted,
    sortOrder: service.sortOrder,
    features: service.features.map((feature) => ({ title: asTranslated(feature.title) })),
    steps: service.steps.map((step) => ({ title: asTranslated(step.title), description: asTranslated(step.description) })),
    faqs: service.faqs.map((faq) => ({ question: asTranslated(faq.question), answer: asTranslated(faq.answer) })),
    requestCount: service._count.requests,
    pendingCount: pendingBy.get(Number(service.id)) ?? 0,
  }));
}

export async function categoryOptions() {
  await requireAdmin();
  const categories = await db.serviceCategory.findMany({ orderBy: ordered, select: { id: true, title: true } });
  return categories.map((category) => ({ value: String(category.id), label: fa(category.title) }));
}

export async function groupOptions() {
  await requireAdmin();
  const groups = await db.serviceGroup.findMany({ orderBy: ordered, select: { id: true, title: true } });
  return groups.map((group) => ({ value: String(group.id), label: fa(group.title) }));
}
