import 'server-only';
import { db } from '../../lib/db';
import { requireRoot } from '../../lib/auth/currentAdmin';
import { toInputs } from '../../i18n/translated';
import type { Locale } from '../../i18n/config';
import { SETTING_FIELDS, SETTING_KEYS, SettingKey, storedDefault } from './definitions';

// What the settings form edits: plain text, or every language of a translatable setting.
export type SettingValues = Record<SettingKey, string | Record<Locale, string>>;

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    // Text saved before the setting was translatable is Persian
    return value;
  }
};

export async function getSettingsForAdmin(): Promise<SettingValues> {
  await requireRoot();
  const rows = await db.setting.findMany({ where: { key: { in: SETTING_KEYS } } });
  const stored = new Map(rows.map((row) => [row.key, row.value]));
  const values = {} as SettingValues;
  for (const field of SETTING_FIELDS) {
    const value = stored.get(field.key) ?? storedDefault(field);
    values[field.key] = field.translatable ? toInputs(parse(value)) : value;
  }
  return values;
}
