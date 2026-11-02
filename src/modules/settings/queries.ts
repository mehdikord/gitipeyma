import 'server-only';
import { db } from '../../lib/db';
import { requireAdmin } from '../../lib/auth/currentAdmin';
import { DEFAULT_SETTINGS, SETTING_KEYS, Settings } from './definitions';

export async function getSettingsForAdmin(): Promise<Settings> {
  await requireAdmin();
  const rows = await db.setting.findMany({ where: { key: { in: SETTING_KEYS } } });
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) settings[row.key as keyof Settings] = row.value ?? '';
  return settings;
}
