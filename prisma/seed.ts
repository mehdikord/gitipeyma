/**
 * DatabaseSeeder: runs every seeder in order. `npm run db:seed`
 *
 * The admin seeder only creates the admin when that phone number is missing, and each content seeder
 * only fills its tables while they are still empty, so running this again never overwrites what was
 * edited in the admin panel.
 */

import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';
import { databaseConfig } from '../src/lib/databaseConfig';
import { adminSeeder } from './seeders/adminSeeder';
import { settingSeeder } from './seeders/settingSeeder';
import { serviceSeeder } from './seeders/serviceSeeder';
import { testimonialSeeder } from './seeders/testimonialSeeder';
import { companySeeder } from './seeders/companySeeder';
import { currencySeeder } from './seeders/currencySeeder';

export type Seeder = (db: PrismaClient) => Promise<void>;

const SEEDERS: [string, Seeder][] = [
  ['AdminSeeder', adminSeeder],
  ['SettingSeeder', settingSeeder],
  ['ServiceSeeder', serviceSeeder],
  ['TestimonialSeeder', testimonialSeeder],
  ['CompanySeeder', companySeeder],
  ['CurrencySeeder', currencySeeder],
];

async function main() {
  const db = new PrismaClient({ adapter: new PrismaMariaDb({ ...databaseConfig(), allowPublicKeyRetrieval: true }) });
  try {
    for (const [name, seeder] of SEEDERS) {
      process.stdout.write(`Seeding: ${name}\n`);
      await seeder(db);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
