import type { Seeder } from '../seed';
import { hashPassword } from '../../src/lib/auth/password';

export const ADMIN = { name: 'Administartor', phone: '09120000000', password: '123456' };

export const adminSeeder: Seeder = async (db) => {
  await db.admin.upsert({
    where: { phone: ADMIN.phone },
    update: {},
    create: { name: ADMIN.name, phone: ADMIN.phone, password: await hashPassword(ADMIN.password) },
  });
};
