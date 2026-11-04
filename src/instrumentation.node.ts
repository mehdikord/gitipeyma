import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Instrumentation } from 'next';

const LOG_DIR = join(process.cwd(), 'storage', 'logs');

/** Appends the error, with the request it happened on, to storage/logs/errors.log and prints it to stderr. */
export const logRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const err = error instanceof Error ? error : new Error(String(error));
  const digest = typeof error === 'object' && error !== null && 'digest' in error ? String(error.digest) : '-';
  const cause = err.cause instanceof Error ? `\ncause: ${err.cause.message}` : '';
  const line =
    `[${new Date().toISOString()}] ${request.method} ${request.path} (${context.routeType} ${context.routePath}) digest=${digest} ` +
    `node=${process.version} cwd=${process.cwd()}\n${err.stack ?? err.message}${cause}\n\n`;

  console.error(line);
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(join(LOG_DIR, 'errors.log'), line);
  } catch (writeError) {
    console.error('could not write storage/logs/errors.log:', (writeError as Error).message);
  }
};
