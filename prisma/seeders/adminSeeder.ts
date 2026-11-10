import type { Seeder } from '../seed';
import { hashPassword } from '../../src/lib/auth/password';

// The first admin is a root admin; the panel can only add internal ones.
export const ADMIN = { name: 'Administartor', phone: '09120000000', password: '123456' };

export const adminSeeder: Seeder = async (db) => {
  await db.admin.upsert({
    where: { phone: ADMIN.phone },
    update: {},
    create: { name: ADMIN.name, phone: ADMIN.phone, password: await hashPassword(ADMIN.password), isRoot: true },
  });
};
