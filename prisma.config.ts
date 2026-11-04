import { defineConfig } from 'prisma/config';
import { databaseUrl } from './src/lib/databaseConfig';
import { loadEnv } from './src/lib/loadEnv';

loadEnv();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl(),
  },
});
