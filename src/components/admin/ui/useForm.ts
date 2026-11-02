'use client';

import { useCallback, useState, useTransition } from 'react';
import type { ActionResult } from '../../../lib/actions';
import { useToast } from './Toast';

/**
 * Form state for the panel: the values, the server's errors per field, and a submit that calls a
 * server action and reports the outcome.
 */
export function useForm<V extends Record<string, unknown>>(initial: V) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const set = useCallback(<K extends keyof V>(key: K, value: V[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    // The field's error goes once it is edited
    setErrors((current) => {
      if (!((key as string) in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }, []);

  const reset = useCallback((next: V) => {
    setValues(next);
    setErrors({});
    setFormError(null);
  }, []);

  const submit = useCallback(
    <T>(action: () => Promise<ActionResult<T>>, options: { success?: string; onSuccess?: (result: ActionResult<T>) => void } = {}) => {
      startTransition(async () => {
        const result = await action();
        if (result.ok) {
          setErrors({});
          setFormError(null);
          toast.success(result.message ?? options.success ?? 'تغییرات ذخیره شد.');
          options.onSuccess?.(result);
        } else {
          setErrors(result.errors ?? {});
          setFormError(result.message ?? 'خطایی رخ داد.');
        }
      });
    },
    [toast],
  );

  /** Errors for the rows of a list field, e.g. errorsUnder('steps', 2) gives { title: '...' }. */
  const errorsAt = useCallback(
    (list: string, index: number) => {
      const prefix = `${list}.${index}.`;
      return Object.fromEntries(Object.entries(errors).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [key.slice(prefix.length), value]));
    },
    [errors],
  );

  return { values, set, setValues, errors, errorsAt, formError, pending, submit, reset };
}

export type FormApi<V extends Record<string, unknown>> = ReturnType<typeof useForm<V>>;

/** Text inputs work with strings; this turns nullable database values into them. */
export const str = (value: string | number | null | undefined) => (value === null || value === undefined ? '' : String(value));
