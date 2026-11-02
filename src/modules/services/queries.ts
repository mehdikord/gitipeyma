import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { param } from '../../lib/pagination';
import type { Prisma } from '../../generated/prisma/client';

const ordered = [{ sortOrder: 'asc' as const }, { id: 'asc' as const }];

export type ServiceAdminRow = {
  id: number;
  title: string;
  shortTitle: string;
  slug: string;
  serviceCategoryId: number;
  serviceGroupId: number | null;
  categoryTitle: string;
  groupTitle: string | null;
  categoryLabel: string | null;
  eyebrow: string | null;
  badge: string | null;
  icon: string | null;
  image: string | null;
  summary: string;
  description: string;
  content: string | null;
  isActive: boolean;
  isHighlighted: boolean;
  sortOrder: number;
  features: { title: string }[];
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
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
    OR: q ? [{ title: { contains: q } }, { shortTitle: { contains: q } }, { slug: { contains: q } }] : undefined,
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
    title: service.title,
    shortTitle: service.shortTitle,
    slug: service.slug,
    serviceCategoryId: Number(service.serviceCategoryId),
    serviceGroupId: service.serviceGroupId === null ? null : Number(service.serviceGroupId),
    categoryTitle: service.category.title,
    groupTitle: service.group?.title ?? null,
    categoryLabel: service.categoryLabel,
    eyebrow: service.eyebrow,
    badge: service.badge,
    icon: service.icon,
    image: service.image,
    summary: service.summary,
    description: service.description,
    content: service.content,
    isActive: service.isActive,
    isHighlighted: service.isHighlighted,
    sortOrder: service.sortOrder,
    features: service.features.map((feature) => ({ title: feature.title })),
    steps: service.steps.map((step) => ({ title: step.title, description: step.description })),
    faqs: service.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    requestCount: service._count.requests,
    pendingCount: pendingBy.get(Number(service.id)) ?? 0,
  }));
}

export async function categoryOptions() {
  await requireAdmin();
  const categories = await db.serviceCategory.findMany({ orderBy: ordered, select: { id: true, title: true } });
  return categories.map((category) => ({ value: String(category.id), label: category.title }));
}

export async function groupOptions() {
  await requireAdmin();
  const groups = await db.serviceGroup.findMany({ orderBy: ordered, select: { id: true, title: true } });
  return groups.map((group) => ({ value: String(group.id), label: group.title }));
}
