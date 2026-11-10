/**
 * The contract between server actions and the forms that call them, and the wrappers that
 * give every action the same auth check, validation and error handling.
 */

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Prisma } from '../generated/prisma/client';
import { CurrentAdmin, requireAdmin } from './auth/currentAdmin';
import { FieldErrors, fieldErrors } from './validation';

// One flat shape rather than a union: the project compiles without strict mode, where
// narrowing on `ok` is unreliable.
export type ActionResult<T = null> = {
  ok: boolean;
  message?: string;
  data?: T;
  // Messages per field ("steps.0.title"), when the input was rejected.
  errors?: FieldErrors;
};

/** Thrown by a handler to reject the input with messages on specific fields. */
export class FormError extends Error {
  constructor(
    message: string,
    public errors: FieldErrors = {},
  ) {
    super(message);
  }
}

const INVALID = 'لطفاً خطاهای فرم را برطرف کنید.';

function failure(error: unknown): ActionResult<never> {
  if (error instanceof FormError) {
    return { ok: false, message: error.message, errors: Object.keys(error.errors).length ? error.errors : undefined };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2003') return { ok: false, message: 'این مورد به اطلاعات دیگری وابسته است و حذف یا تغییر آن ممکن نیست.' };
    if (error.code === 'P2002') return { ok: false, message: 'این مقدار قبلاً ثبت شده است.' };
    if (error.code === 'P2025') return { ok: false, message: 'این مورد پیدا نشد؛ شاید قبلاً حذف شده باشد.' };
  }
  console.error(error);
  return { ok: false, message: 'خطایی رخ داد. دوباره تلاش کنید.' };
}

/**
 * An action anyone can call (the public forms). `messages` are the visitor's language versions of
 * the two general replies; a FormError carries its own, already in their language.
 */
export async function publicAction<S extends z.ZodType, T = null>(
  schema: S,
  input: unknown,
  handler: (data: z.output<S>) => Promise<ActionResult<T> | void>,
  messages: { invalid: string; failed: string } = { invalid: INVALID, failed: 'خطایی رخ داد. دوباره تلاش کنید.' },
): Promise<ActionResult<T>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: messages.invalid, errors: fieldErrors(parsed.error) };
  try {
    return ((await handler(parsed.data)) as ActionResult<T> | undefined) ?? { ok: true };
  } catch (error) {
    if (error instanceof FormError) return failure(error);
    console.error(error);
    return { ok: false, message: messages.failed };
  }
}

const NO_ACCESS = 'شما به این بخش دسترسی ندارید.';

async function runAdminAction<S extends z.ZodType, T>(
  admin: CurrentAdmin,
  schema: S,
  input: unknown,
  handler: (data: z.output<S>, admin: CurrentAdmin) => Promise<ActionResult<T> | void>,
): Promise<ActionResult<T>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    const result = ((await handler(parsed.data, admin)) as ActionResult<T> | undefined) ?? { ok: true };
    if (result.ok) revalidatePath('/admins', 'layout');
    return result;
  } catch (error) {
    return failure(error);
  }
}

/**
 * An action from the admin panel, for root admins only (the default: anything new is closed to
 * internal admins until it is deliberately opened with staffAction). Once the handler succeeds the
 * panel is re-rendered so lists, counters and the sidebar badges show the change.
 */
export async function adminAction<S extends z.ZodType, T = null>(
  schema: S,
  input: unknown,
  handler: (data: z.output<S>, admin: CurrentAdmin) => Promise<ActionResult<T> | void>,
): Promise<ActionResult<T>> {
  const admin = await requireAdmin();
  if (!admin.isRoot) return { ok: false, message: NO_ACCESS };
  return runAdminAction(admin, schema, input, handler);
}

/**
 * An action any signed-in admin may call: work on service requests and their own profile. The
 * handler must still limit an internal admin to their own services (see serviceRequests/access.ts).
 */
export async function staffAction<S extends z.ZodType, T = null>(
  schema: S,
  input: unknown,
  handler: (data: z.output<S>, admin: CurrentAdmin) => Promise<ActionResult<T> | void>,
): Promise<ActionResult<T>> {
  return runAdminAction(await requireAdmin(), schema, input, handler);
}

/** Thrown inside a staffAction when the admin may not touch that record. */
export const noAccess = () => new FormError(NO_ACCESS);

export const idSchema = z.object({ id: z.coerce.number().int().positive() });
