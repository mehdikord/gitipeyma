import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { pageArgs, paginated, param } from '../../lib/pagination';
import { normalizeDigits } from '../../utils/validation';
import { REQUEST_STATUS_KEYS } from './statuses';
import { fa } from '../../i18n/translated';
import { answerText, asAnswers } from '../serviceForms/fields';
import { requestScope, serviceScope } from './access';
import type { Prisma, RequestStatus } from '../../generated/prisma/client';

export type ServiceRequestNoteRow = {
  id: number;
  body: string;
  // null when the note came from the old single-note field, or its admin was deleted
  author: string | null;
  editor: string | null;
  createdAt: string;
  editedAt: string | null;
};

export type ServiceRequestRow = {
  id: number;
  name: string;
  phone: string;
  // The service's questions as they were when the request was sent, with the visitor's answers.
  answers: { label: string; value: string }[];
  status: RequestStatus;
  // The team's notes, oldest first.
  notes: ServiceRequestNoteRow[];
  service: { id: number; title: string; slug: string };
  createdAt: string;
  updatedAt: string;
};

/** Search matches the name or the phone number, typed in any digits. */
export const personSearch = (q: string) => {
  const term = q.trim();
  if (!term) return undefined;
  const digits = normalizeDigits(term).replace(/[\s-]/g, '');
  return [{ name: { contains: term } }, ...(/^\+?\d+$/.test(digits) ? [{ phone: { contains: digits } }] : [])];
};

export const statusFilter = (value: string) => (REQUEST_STATUS_KEYS as string[]).includes(value) ? (value as RequestStatus) : undefined;

/** The requests list; an internal admin only gets the requests of their services. */
export async function listServiceRequests(params: Record<string, string | string[] | undefined>) {
  const admin = await requireAdmin();
  const page = pageArgs(params);
  const serviceId = Number(param(params, 'service'));
  const scope = requestScope(admin);
  const where: Prisma.ServiceRequestWhereInput = {
    AND: [
      scope,
      {
        status: statusFilter(param(params, 'status')),
        serviceId: Number.isInteger(serviceId) && serviceId > 0 ? serviceId : undefined,
        OR: personSearch(param(params, 'q')),
      },
    ],
  };

  const include = {
    service: { select: { id: true, shortTitle: true, slug: true } },
    notes: { orderBy: { id: 'asc' }, include: { admin: { select: { name: true } }, editor: { select: { name: true } } } },
  } as const;
  const openId = Number(param(params, 'open'));
  const [rows, total, opened] = await Promise.all([
    db.serviceRequest.findMany({ where, orderBy: { id: 'desc' }, skip: page.skip, take: page.take, include }),
    db.serviceRequest.count({ where }),
    // A request linked to directly (?open=12), whichever page it is on
    openId > 0 ? db.serviceRequest.findFirst({ where: { id: openId, ...scope }, include }) : null,
  ]);

  const toRow = (row: NonNullable<typeof opened>): ServiceRequestRow => ({
    id: Number(row.id),
    name: row.name,
    phone: row.phone,
    answers: asAnswers(row.answers).map((answer) => ({ label: fa(answer.label) || 'بدون عنوان', value: answerText(answer) })),
    status: row.status,
    notes: row.notes.map((note) => ({
      id: Number(note.id),
      body: note.body,
      author: note.admin?.name ?? null,
      editor: note.editor?.name ?? null,
      createdAt: note.createdAt.toISOString(),
      editedAt: note.editedAt?.toISOString() ?? null,
    })),
    service: { id: Number(row.service.id), title: fa(row.service.shortTitle), slug: row.service.slug },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });

  return { ...paginated(rows.map(toRow), total, page), opened: opened ? toRow(opened) : null };
}

/** Every service, active or not, for filters and pickers in the panel; an internal admin's own services only. */
export async function serviceOptions() {
  const admin = await requireAdmin();
  const services = await db.service.findMany({ where: serviceScope(admin), orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], select: { id: true, shortTitle: true, isActive: true } });
  return services.map((service) => ({ value: String(service.id), label: service.isActive ? fa(service.shortTitle) : `${fa(service.shortTitle)} (غیرفعال)` }));
}
