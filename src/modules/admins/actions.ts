'use server';

import { db } from '../../lib/db';
import { adminAction, FormError, idSchema } from '../../lib/actions';
import { hashPassword, verifyPassword } from '../../lib/auth/password';
import { AdminInput, adminSchema, ProfileInput, profileSchema } from './schema';

async function assertPhoneFree(phone: string, exceptId?: bigint | number | null) {
  const taken = await db.admin.findFirst({ where: { phone, NOT: exceptId ? { id: exceptId } : undefined }, select: { id: true } });
  if (taken) throw new FormError('این شماره برای مدیر دیگری ثبت شده است.', { phone: 'این شماره تکراری است.' });
}

export async function saveAdmin(id: number | null, input: AdminInput) {
  return adminAction(adminSchema(id === null), input, async ({ name, phone, password }) => {
    await assertPhoneFree(phone, id);
    const data = { name, phone, ...(password ? { password: await hashPassword(password) } : {}) };
    if (id) await db.admin.update({ where: { id }, data });
    else await db.admin.create({ data: { ...data, password: await hashPassword(password) } });
  });
}

export async function deleteAdmin(id: number) {
  return adminAction(idSchema, { id }, async (data, current) => {
    if (BigInt(data.id) === current.id) throw new FormError('نمی‌توانید حساب خودتان را حذف کنید.');
    if ((await db.admin.count()) <= 1) throw new FormError('دست‌کم یک مدیر باید باقی بماند.');
    await db.admin.delete({ where: { id: data.id } });
    return { ok: true, message: 'مدیر حذف شد.' };
  });
}

/** The signed-in admin's own name, phone and password. A new password needs the current one. */
export async function updateProfile(input: ProfileInput) {
  return adminAction(profileSchema, input, async ({ name, phone, currentPassword, password }, current) => {
    await assertPhoneFree(phone, current.id);
    let hashed: string | undefined;
    if (password) {
      const admin = await db.admin.findUniqueOrThrow({ where: { id: current.id }, select: { password: true } });
      if (!(await verifyPassword(currentPassword, admin.password))) {
        throw new FormError('رمز عبور فعلی درست نیست.', { currentPassword: 'رمز عبور فعلی درست نیست.' });
      }
      hashed = await hashPassword(password);
    }
    await db.admin.update({ where: { id: current.id }, data: { name, phone, ...(hashed ? { password: hashed } : {}) } });
    return { ok: true, message: password ? 'مشخصات و رمز عبور شما به‌روزرسانی شد.' : 'مشخصات شما به‌روزرسانی شد.' };
  });
}
