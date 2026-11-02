import 'server-only';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { databaseConfig } from './databaseConfig';

function createClient() {
  const { host, port, database, user, password } = databaseConfig();
  const adapter = new PrismaMariaDb({ host, port, database, user, password, connectionLimit: 10, allowPublicKeyRetrieval: true });
  return new PrismaClient({ adapter });
}

// One client per process: hot reload in development would otherwise open a new pool on every edit.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
