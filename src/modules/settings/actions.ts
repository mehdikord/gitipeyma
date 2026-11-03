'use server';

import { db } from '../../lib/db';
import { adminAction } from '../../lib/actions';
import { settingsSchema } from './schema';
import type { SettingValues } from './queries';

export async function saveSettings(input: SettingValues) {
  return adminAction(settingsSchema, input, async (data) => {
    await db.$transaction(
      Object.entries(data).map(([key, value]) => db.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })),
    );
    return { ok: true, message: 'تنظیمات ذخیره شد.' };
  });
}
