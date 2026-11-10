import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { pageArgs, paginated, param } from '../../lib/pagination';
import type { Prisma, TestimonialSource } from '../../generated/prisma/client';
import { asTranslated, fa, Translated } from '../../i18n/translated';
import { textSearch } from '../../lib/search';

export type TestimonialRow = {
  id: number;
  serviceCategoryId: number | null;
  categoryTitle: string | null;
  clientName: Translated;
  serviceTitle: Translated;
  context: Translated;
  comment: Translated;
  year: Translated;
  rating: number;
  categoryLabel: Translated;
  verifiedCode: Translated;
  outcomeHeadline: Translated;
  originDestination: Translated;
  trackingCode: string | null;
  source: TestimonialSource;
  isPublished: boolean;
  sortOrder: number;
  milestones: { title: Translated; description: Translated }[];
  createdAt: string;
};

export async function listTestimonials(params: Record<string, string | string[] | undefined>) {
  await requireRoot();
  const page = pageArgs(params);
  const state = param(params, 'state');
  const q = param(params, 'q');
  const where: Prisma.TestimonialWhereInput = {
    isPublished: state === 'published' ? true : state === 'pending' ? false : undefined,
    source: state === 'pending' ? 'visitor' : undefined,
    OR: q ? [...textSearch('clientName', q), ...textSearch('comment', q), ...textSearch('serviceTitle', q)] : undefined,
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
        categoryTitle: row.category ? fa(row.category.title) : null,
        clientName: asTranslated(row.clientName),
        serviceTitle: asTranslated(row.serviceTitle),
        context: asTranslated(row.context),
        comment: asTranslated(row.comment),
        year: asTranslated(row.year),
        rating: row.rating,
        categoryLabel: asTranslated(row.categoryLabel),
        verifiedCode: asTranslated(row.verifiedCode),
        outcomeHeadline: asTranslated(row.outcomeHeadline),
        originDestination: asTranslated(row.originDestination),
        trackingCode: row.trackingCode,
        source: row.source,
        isPublished: row.isPublished,
        sortOrder: row.sortOrder,
        milestones: row.milestones.map((milestone) => ({ title: asTranslated(milestone.title), description: asTranslated(milestone.description) })),
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    total,
    page,
  );
}
