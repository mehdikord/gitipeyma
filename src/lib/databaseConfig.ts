/**
 * The MySQL connection, read from the DB_* variables in .env.
 * Shared by the Prisma CLI (prisma.config.ts) and the app (src/lib/db.ts), so both always point at the same database.
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export function databaseConfig(env: Record<string, string | undefined> = process.env): DatabaseConfig {
  const database = env.DB_DATABASE;
  if (!database) throw new Error('DB_DATABASE is not set. Copy .env.example to .env and fill in the database settings.');
  return {
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || 3306),
    database,
    user: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD ?? '',
  };
}

export function databaseUrl(config: DatabaseConfig = databaseConfig()): string {
  const auth = `${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}`;
  return `mysql://${auth}@${config.host}:${config.port}/${config.database}`;
}
