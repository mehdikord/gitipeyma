import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { pageArgs, paginated, param } from '../../lib/pagination';
import { personSearch, statusFilter } from '../serviceRequests/queries';
import { fa } from '../../i18n/translated';
import type { Prisma, RequestStatus } from '../../generated/prisma/client';

export type ConsultationRow = {
  id: number;
  name: string;
  phone: string;
  description: string | null;
  callTime: string;
  status: RequestStatus;
  adminNote: string | null;
  service: { id: number; title: string } | null;
  createdAt: string;
  updatedAt: string;
};

export async function listConsultations(params: Record<string, string | string[] | undefined>) {
  await requireAdmin();
  const page = pageArgs(params);
  const service = param(params, 'service');
  const where: Prisma.ConsultationRequestWhereInput = {
    status: statusFilter(param(params, 'status')),
    // "general" is the requests that are not about any one service
    serviceId: service === 'general' ? null : Number(service) > 0 ? Number(service) : undefined,
    OR: personSearch(param(params, 'q')),
  };

  const include = { service: { select: { id: true, shortTitle: true } } } as const;
  const openId = Number(param(params, 'open'));
  const [rows, total, opened] = await Promise.all([
    db.consultationRequest.findMany({ where, orderBy: { id: 'desc' }, skip: page.skip, take: page.take, include }),
    db.consultationRequest.count({ where }),
    openId > 0 ? db.consultationRequest.findUnique({ where: { id: openId }, include }) : null,
  ]);

  const toRow = (row: NonNullable<typeof opened>): ConsultationRow => ({
    id: Number(row.id),
    name: row.name,
    phone: row.phone,
    description: row.description,
    callTime: row.callTime,
    status: row.status,
    adminNote: row.adminNote,
    service: row.service ? { id: Number(row.service.id), title: fa(row.service.shortTitle) } : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });

  return { ...paginated(rows.map(toRow), total, page), opened: opened ? toRow(opened) : null };
}
