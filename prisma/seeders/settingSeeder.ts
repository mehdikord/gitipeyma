import type { Seeder } from '../seed';
import { SETTING_FIELDS } from '../../src/modules/settings/definitions';

// Adds any setting that is missing; existing values are left as they are.
export const settingSeeder: Seeder = async (db) => {
  for (const field of SETTING_FIELDS) {
    await db.setting.upsert({ where: { key: field.key }, update: {}, create: { key: field.key, value: field.default } });
  }
};
