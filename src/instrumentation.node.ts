import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Instrumentation } from 'next';

const LOG_DIR = join(process.cwd(), 'storage', 'logs');

async function log(line: string) {
  console.error(line);
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(join(LOG_DIR, 'errors.log'), line);
  } catch (writeError) {
    console.error('could not write storage/logs/errors.log:', (writeError as Error).message);
  }
}

/**
 * Tries the database once when the server starts, with the settings this process actually sees, and logs the
 * outcome. Prisma's pool only ever reports "pool failed to retrieve a connection"; the raw driver names the
 * cause. Next reads .env with variable expansion, so a `$` in a value can give the server a different password
 * than the CLI tools (which read .env plainly): the settings are logged so that shows.
 */
export async function checkDatabase() {
  const { databaseConfig } = await import('./lib/databaseConfig');
  const { default: mariadb } = await import('mariadb');
  let config;
  try {
    config = databaseConfig();
  } catch (error) {
    await log(`[${new Date().toISOString()}] database settings: ${(error as Error).message}\n\n`);
    return;
  }
  const { host, port, database, user, password } = config;
  const settings = `${user}@${host}:${port}/${database}, password ${password.length} chars` + (password.includes('$') ? ' (contains $)' : '');
  try {
    const connection = await mariadb.createConnection({ host, port, database, user, password, allowPublicKeyRetrieval: true, connectTimeout: 10000 });
    await connection.end();
    await log(`[${new Date().toISOString()}] database check OK: ${settings}\n\n`);
  } catch (error) {
    const e = error as Error & { code?: string };
    await log(`[${new Date().toISOString()}] database check FAILED: ${settings}\n${e.code ?? ''} ${e.message}\n\n`);
  }
}

/** Appends the error, with the request it happened on, to storage/logs/errors.log and prints it to stderr. */
export const logRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const err = error instanceof Error ? error : new Error(String(error));
  const digest = typeof error === 'object' && error !== null && 'digest' in error ? String(error.digest) : '-';
  const cause = err.cause instanceof Error ? `\ncause: ${err.cause.message}` : '';
  await log(
    `[${new Date().toISOString()}] ${request.method} ${request.path} (${context.routeType} ${context.routePath}) digest=${digest} ` +
      `node=${process.version} cwd=${process.cwd()}\n${err.stack ?? err.message}${cause}\n\n`,
  );
};
