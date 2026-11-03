/**
 * Connects to the database exactly as the running site does (src/lib/db.ts) and prints the real error if it can't.
 * `prisma migrate` uses its own engine, so a working migrate doesn't prove the site can connect.
 * Run from the project folder: npx tsx scripts/check-db.ts
 */
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';
import { databaseConfig } from '../src/lib/databaseConfig';

const { host, port, database, user, password } = databaseConfig();
console.log(`Connecting to ${user}@${host}:${port}/${database} (password ${password ? 'set' : 'EMPTY'})`);

const adapter = new PrismaMariaDb({ host, port, database, user, password, connectionLimit: 1, allowPublicKeyRetrieval: true });
const db = new PrismaClient({ adapter });

try {
  const [settings, offices, services] = await Promise.all([db.setting.count(), db.office.count(), db.service.count()]);
  console.log(`OK: ${settings} settings, ${offices} offices, ${services} services`);
} catch (error) {
  console.error('FAILED:', error);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
