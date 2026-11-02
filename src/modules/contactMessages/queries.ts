import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { pageArgs, paginated, param } from '../../lib/pagination';
import { personSearch } from '../serviceRequests/queries';
import type { Prisma } from '../../generated/prisma/client';

export type ContactMessageRow = { id: number; topic: string | null; name: string; phone: string; message: string; readAt: string | null; createdAt: string };

export async function listContactMessages(params: Record<string, string | string[] | undefined>) {
  await requireAdmin();
  const page = pageArgs(params);
  const state = param(params, 'state');
  const where: Prisma.ContactMessageWhereInput = {
    readAt: state === 'unread' ? null : state === 'read' ? { not: null } : undefined,
    topic: param(params, 'topic') || undefined,
    OR: personSearch(param(params, 'q')),
  };
  const openId = Number(param(params, 'open'));
  const [rows, total, opened] = await Promise.all([
    db.contactMessage.findMany({ where, orderBy: { id: 'desc' }, skip: page.skip, take: page.take }),
    db.contactMessage.count({ where }),
    openId > 0 ? db.contactMessage.findUnique({ where: { id: openId } }) : null,
  ]);
  const toRow = (row: NonNullable<typeof opened>): ContactMessageRow => ({
    id: Number(row.id),
    topic: row.topic,
    name: row.name,
    phone: row.phone,
    message: row.message,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  });
  return { ...paginated(rows.map(toRow), total, page), opened: opened ? toRow(opened) : null };
}
