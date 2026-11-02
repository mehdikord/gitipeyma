import type { Seeder } from '../seed';
import { MARQUEE_TRUST_QUOTES, TESTIMONIALS_DATA, TESTIMONIALS_METRICS } from './data/testimonials';

export const testimonialSeeder: Seeder = async (db) => {
  if (!(await db.testimonial.count())) {
    const categories = await db.serviceCategory.findMany({ select: { id: true, slug: true } });
    const categoryId = (slug: string) => categories.find((category) => category.slug === slug)?.id ?? null;

    for (const [index, item] of TESTIMONIALS_DATA.entries()) {
      await db.testimonial.create({
        data: {
          serviceCategoryId: categoryId(item.category),
          clientName: item.clientName,
          serviceTitle: item.serviceUsed,
          context: item.routeOrContext,
          comment: item.comment,
          year: item.year,
          rating: item.rating,
          categoryLabel: item.categoryLabel,
          verifiedCode: item.verifiedCode,
          outcomeHeadline: item.outcomeHeadline,
          originDestination: item.originDestination,
          source: 'admin',
          isPublished: true,
          sortOrder: index + 1,
          milestones: { create: item.milestones.map((milestone, order) => ({ title: milestone.title, description: milestone.desc, sortOrder: order + 1 })) },
        },
      });
    }
  }

  if (!(await db.metric.count())) {
    await db.metric.createMany({
      data: TESTIMONIALS_METRICS.map((metric, index) => ({
        value: metric.value,
        label: metric.label,
        subtext: metric.subtext,
        trend: metric.trend,
        sortOrder: index + 1,
      })),
    });
  }

  if (!(await db.trustQuote.count())) {
    await db.trustQuote.createMany({ data: MARQUEE_TRUST_QUOTES.map((text, index) => ({ text, sortOrder: index + 1 })) });
  }
};
