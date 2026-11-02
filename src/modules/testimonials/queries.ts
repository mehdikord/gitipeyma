import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { pageArgs, paginated, param } from '../../lib/pagination';
import type { Prisma, TestimonialSource } from '../../generated/prisma/client';

export type TestimonialRow = {
  id: number;
  serviceCategoryId: number | null;
  categoryTitle: string | null;
  clientName: string;
  serviceTitle: string;
  context: string | null;
  comment: string;
  year: string | null;
  rating: number;
  categoryLabel: string | null;
  verifiedCode: string | null;
  outcomeHeadline: string | null;
  originDestination: string | null;
  trackingCode: string | null;
  source: TestimonialSource;
  isPublished: boolean;
  sortOrder: number;
  milestones: { title: string; description: string | null }[];
  createdAt: string;
};

export async function listTestimonials(params: Record<string, string | string[] | undefined>) {
  await requireAdmin();
  const page = pageArgs(params);
  const state = param(params, 'state');
  const q = param(params, 'q');
  const where: Prisma.TestimonialWhereInput = {
    isPublished: state === 'published' ? true : state === 'pending' ? false : undefined,
    source: state === 'pending' ? 'visitor' : undefined,
    OR: q ? [{ clientName: { contains: q } }, { comment: { contains: q } }, { serviceTitle: { contains: q } }] : undefined,
  };
  const [rows, total] = await Promise.all([
    db.testimonial.findMany({
      where,
      // Reviews waiting for approval first, then the order they show in on the site
      orderBy: [{ isPublished: 'asc' }, { sortOrder: 'asc' }, { id: 'desc' }],
      skip: page.skip,
      take: page.take,
      include: { category: { select: { title: true } }, milestones: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
    }),
    db.testimonial.count({ where }),
  ]);

  return paginated(
    rows.map(
      (row): TestimonialRow => ({
        id: Number(row.id),
        serviceCategoryId: row.serviceCategoryId === null ? null : Number(row.serviceCategoryId),
        categoryTitle: row.category?.title ?? null,
        clientName: row.clientName,
        serviceTitle: row.serviceTitle,
        context: row.context,
        comment: row.comment,
        year: row.year,
        rating: row.rating,
        categoryLabel: row.categoryLabel,
        verifiedCode: row.verifiedCode,
        outcomeHeadline: row.outcomeHeadline,
        originDestination: row.originDestination,
        trackingCode: row.trackingCode,
        source: row.source,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
        milestones: row.milestones.map((milestone) => ({ title: milestone.title, description: milestone.description })),
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    total,
    page,
  );
}
