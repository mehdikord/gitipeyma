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

/** An action anyone can call (the public forms). */
export async function publicAction<S extends z.ZodType, T = null>(
  schema: S,
  input: unknown,
  handler: (data: z.output<S>) => Promise<ActionResult<T> | void>,
): Promise<ActionResult<T>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: INVALID, errors: fieldErrors(parsed.error) };
  try {
    return ((await handler(parsed.data)) as ActionResult<T> | undefined) ?? { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/**
 * An action from the admin panel: the admin is confirmed first, and once the handler succeeds
 * the panel is re-rendered so lists, counters and the sidebar badges show the change.
 */
export async function adminAction<S extends z.ZodType, T = null>(
  schema: S,
  input: unknown,
  handler: (data: z.output<S>, admin: CurrentAdmin) => Promise<ActionResult<T> | void>,
): Promise<ActionResult<T>> {
  const admin = await requireAdmin();
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

export const idSchema = z.object({ id: z.coerce.number().int().positive() });
