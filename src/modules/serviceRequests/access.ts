import 'server-only';
import type { Prisma } from '../../generated/prisma/client';
import type { CurrentAdmin } from '../../lib/auth/currentAdmin';
import { db } from '../../lib/db';
import { noAccess } from '../../lib/actions';

/** The service requests an admin may see: all for a root admin, those of their services otherwise. */
export const requestScope = (admin: CurrentAdmin): Prisma.ServiceRequestWhereInput => (admin.isRoot ? {} : { serviceId: { in: admin.serviceIds } });

/** The services an admin works on, as a filter on services. */
export const serviceScope = (admin: CurrentAdmin): Prisma.ServiceWhereInput => (admin.isRoot ? {} : { id: { in: admin.serviceIds } });

/** Throws (as a form message) unless the admin may work on this request. */
export async function assertRequestAccess(admin: CurrentAdmin, requestId: number | bigint) {
  const request = await db.serviceRequest.findFirst({ where: { id: requestId, ...requestScope(admin) }, select: { id: true } });
  if (!request) throw noAccess();
  return request;
}
