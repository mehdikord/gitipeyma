'use server';

import { db } from '../../lib/db';
import { adminAction, FormError, idSchema, staffAction } from '../../lib/actions';
import { hashPassword, verifyPassword } from '../../lib/auth/password';
import { AdminInput, adminSchema, ProfileInput, profileSchema } from './schema';

async function assertPhoneFree(phone: string, exceptId?: bigint | number | null) {
  const taken = await db.admin.findFirst({ where: { phone, NOT: exceptId ? { id: exceptId } : undefined }, select: { id: true } });
  if (taken) throw new FormError('این شماره برای مدیر دیگری ثبت شده است.', { phone: 'این شماره تکراری است.' });
}

const ROOT_LOCKED = 'مدیر کل از پنل ویرایش یا حذف نمی‌شود؛ تغییر آن فقط در پایگاه داده ممکن است.';

/**
 * Creates or edits an internal admin and the services they work on. Admins made here are always
 * internal (is_root stays 0); root admins cannot be changed from the panel.
 */
export async function saveAdmin(id: number | null, input: AdminInput) {
  return adminAction(adminSchema(id === null), input, async ({ name, phone, password, serviceIds }) => {
    if (id) {
      const target = await db.admin.findUnique({ where: { id }, select: { isRoot: true } });
      if (!target) throw new FormError('این مدیر پیدا نشد؛ شاید حذف شده باشد.');
      if (target.isRoot) throw new FormError(ROOT_LOCKED);
    }
    await assertPhoneFree(phone, id);
    const known = await db.service.count({ where: { id: { in: serviceIds } } });
    if (known !== serviceIds.length) throw new FormError('برخی از خدمات انتخاب‌شده دیگر وجود ندارند؛ صفحه را دوباره باز کنید.', { serviceIds: 'خدمات را دوباره انتخاب کنید.' });

    await db.$transaction(async (tx) => {
      const data = { name, phone, ...(password ? { password: await hashPassword(password) } : {}) };
      const admin = id
        ? await tx.admin.update({ where: { id }, data })
        : await tx.admin.create({ data: { ...data, password: await hashPassword(password), isRoot: false } });
      await tx.adminService.deleteMany({ where: { adminId: admin.id } });
      await tx.adminService.createMany({ data: serviceIds.map((serviceId) => ({ adminId: admin.id, serviceId })) });
    });
    return { ok: true, message: id ? 'مدیر داخلی ویرایش شد.' : 'مدیر داخلی اضافه شد.' };
  });
}

export async function deleteAdmin(id: number) {
  return adminAction(idSchema, { id }, async (data, current) => {
    if (BigInt(data.id) === current.id) throw new FormError('نمی‌توانید حساب خودتان را حذف کنید.');
    const target = await db.admin.findUnique({ where: { id: data.id }, select: { isRoot: true } });
    if (!target) throw new FormError('این مدیر پیدا نشد؛ شاید قبلاً حذف شده باشد.');
    if (target.isRoot) throw new FormError(ROOT_LOCKED);
    // Their notes stay on the requests, without an author name
    await db.admin.delete({ where: { id: data.id } });
    return { ok: true, message: 'مدیر حذف شد.' };
  });
}

/** The signed-in admin's own name, phone and password. A new password needs the current one. */
export async function updateProfile(input: ProfileInput) {
  return staffAction(profileSchema, input, async ({ name, phone, currentPassword, password }, current) => {
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
