/**
 * Connects to the database the way the running site does (src/lib/db.ts) and prints the real error if it can't.
 * `prisma migrate` connects through Prisma's own engine, so a working migrate doesn't prove the site can connect;
 * and when the site can't, Prisma only logs "pool failed to retrieve a connection", hiding the cause. This script
 * connects with the raw driver first, which names the cause (connection refused, access denied, unknown database...).
 * Run from the project folder: npx tsx scripts/check-db.ts
 */
import 'dotenv/config';
import { lookup } from 'node:dns/promises';
import mariadb from 'mariadb';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';
import { databaseConfig } from '../src/lib/databaseConfig';

const { host, port, database, user, password } = databaseConfig();
console.log(`Settings: ${user}@${host}:${port}/${database} (password ${password ? 'set' : 'EMPTY'})`);

// Node resolves "localhost" to ::1 first; MySQL usually listens only on 127.0.0.1, so the site is refused while the CLI works.
try {
  const addresses = await lookup(host, { all: true });
  console.log(`${host} resolves to: ${addresses.map((a) => a.address).join(', ')}`);
  if (addresses[0]?.family === 6) console.log(`  -> Node will try ${addresses[0].address} (IPv6) first. If this fails, set DB_HOST=127.0.0.1`);
} catch (error) {
  console.error(`FAILED: cannot resolve host "${host}":`, (error as Error).message);
  process.exit(1);
}

console.log('\n1) Raw driver connection (shows the real cause of a failure):');
let connection: Awaited<ReturnType<typeof mariadb.createConnection>> | undefined;
try {
  connection = await mariadb.createConnection({ host, port, database, user, password, allowPublicKeyRetrieval: true, connectTimeout: 10000 });
  const [row] = await connection.query('SELECT VERSION() AS version, @@max_connections AS maxConnections, @@max_user_connections AS maxUserConnections');
  console.log(`   OK: server ${row.version}, max_connections=${row.maxConnections}, max_user_connections=${row.maxUserConnections}`);
} catch (error) {
  const e = error as Error & { code?: string; errno?: number; sqlState?: string };
  console.error(`   FAILED: ${e.code ?? ''} ${e.errno ?? ''} ${e.sqlState ?? ''}\n   ${e.message}`);
  process.exit(1);
} finally {
  await connection?.end();
}

console.log('\n2) Prisma through the same adapter the site uses:');
const adapter = new PrismaMariaDb({ host, port, database, user, password, connectionLimit: 1, allowPublicKeyRetrieval: true });
const db = new PrismaClient({ adapter });
try {
  const [settings, offices, services] = await Promise.all([db.setting.count(), db.office.count(), db.service.count()]);
  console.log(`   OK: ${settings} settings, ${offices} offices, ${services} services`);
} catch (error) {
  console.error('   FAILED:', error);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
