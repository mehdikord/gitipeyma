/**
 * The MySQL connection, read from .env: DATABASE_URL when set, else the DB_* variables.
 * Shared by the Prisma CLI (prisma.config.ts) and the app (src/lib/db.ts), so both always point at the same database.
 *
 * DATABASE_URL is mysql://user:password@host:port/database with the user and password percent-encoded
 * (`$` as %24, `@` as %40, `#` as %23, ...). That keeps every character safe: .env values are read with
 * variable expansion, so a plain `$` would swallow the rest of the password.
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export function databaseConfig(env: Record<string, string | undefined> = process.env): DatabaseConfig {
  if (env.DATABASE_URL) return parseDatabaseUrl(env.DATABASE_URL);

  const database = env.DB_DATABASE;
  if (!database) throw new Error('DATABASE_URL (or DB_DATABASE) is not set. Copy .env.example to .env and fill in the database settings.');
  return {
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || 3306),
    database,
    user: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD ?? '',
  };
}

export function parseDatabaseUrl(value: string): DatabaseConfig {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('DATABASE_URL is not a valid URL. Expected mysql://user:password@host:port/database');
  }
  if (url.protocol !== 'mysql:' && url.protocol !== 'mariadb:') throw new Error(`DATABASE_URL must start with mysql://, got ${url.protocol}//`);
  const database = decodeURIComponent(url.pathname.replace(/^\//, ''));
  if (!database) throw new Error('DATABASE_URL has no database name: mysql://user:password@host:port/database');
  return {
    host: url.hostname || '127.0.0.1',
    port: Number(url.port || 3306),
    database,
    user: decodeURIComponent(url.username) || 'root',
    password: decodeURIComponent(url.password),
  };
}

export function databaseUrl(config: DatabaseConfig = databaseConfig()): string {
  const auth = `${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}`;
  return `mysql://${auth}@${config.host}:${config.port}/${encodeURIComponent(config.database)}`;
}
