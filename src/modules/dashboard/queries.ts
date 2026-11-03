import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import type { NavBadges } from '../../components/admin/layout/navigation';
import { fa } from '../../i18n/translated';

/** What is waiting for the team: new requests, unread messages, reviews to approve. */
export async function getNavBadges(): Promise<NavBadges> {
  await requireAdmin();
  const [serviceRequests, consultations, messages, testimonials] = await Promise.all([
    db.serviceRequest.count({ where: { status: 'pending' } }),
    db.consultationRequest.count({ where: { status: 'pending' } }),
    db.contactMessage.count({ where: { readAt: null } }),
    db.testimonial.count({ where: { isPublished: false, source: 'visitor' } }),
  ]);
  return { serviceRequests, consultations, messages, testimonials };
}

export async function getDashboard() {
  await requireAdmin();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [badges, requestsThisWeek, totalRequests, activeServices, publishedTestimonials, latestRequests, latestConsultations, latestMessages, topServices] = await Promise.all([
    getNavBadges(),
    db.serviceRequest.count({ where: { createdAt: { gte: weekAgo } } }),
    db.serviceRequest.count(),
    db.service.count({ where: { isActive: true } }),
    db.testimonial.count({ where: { isPublished: true } }),
    db.serviceRequest.findMany({ orderBy: { id: 'desc' }, take: 6, include: { service: { select: { shortTitle: true } } } }),
    db.consultationRequest.findMany({ orderBy: { id: 'desc' }, take: 5, include: { service: { select: { shortTitle: true } } } }),
    db.contactMessage.findMany({ orderBy: { id: 'desc' }, take: 5 }),
    db.service.findMany({
      where: { requests: { some: {} } },
      select: { id: true, shortTitle: true, _count: { select: { requests: true } } },
      orderBy: { requests: { _count: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    badges,
    stats: { requestsThisWeek, totalRequests, activeServices, publishedTestimonials },
    latestRequests: latestRequests.map((r) => ({ id: Number(r.id), name: r.name, phone: r.phone, service: fa(r.service.shortTitle), status: r.status, createdAt: r.createdAt.toISOString() })),
    latestConsultations: latestConsultations.map((r) => ({ id: Number(r.id), name: r.name, service: r.service ? fa(r.service.shortTitle) : 'مشاوره عمومی', status: r.status, createdAt: r.createdAt.toISOString() })),
    latestMessages: latestMessages.map((m) => ({ id: Number(m.id), name: m.name, topic: m.topic, read: m.readAt !== null, createdAt: m.createdAt.toISOString() })),
    topServices: topServices.map((s) => ({ id: Number(s.id), title: fa(s.shortTitle), count: s._count.requests })),
  };
}
