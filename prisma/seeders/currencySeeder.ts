import type { Seeder } from '../seed';

export const CURRENCIES = [
  { code: 'TRY', name: { fa: 'لیر ترکیه', en: 'Turkish lira', tr: 'Türk lirası' }, symbol: '₺', rateToToman: 2600, flag: '🇹🇷' },
  { code: 'USD', name: { fa: 'دلار آمریکا', en: 'US dollar', tr: 'ABD doları' }, symbol: '$', rateToToman: 92000, flag: '🇺🇸' },
  { code: 'EUR', name: { fa: 'یورو', en: 'Euro', tr: 'Euro' }, symbol: '€', rateToToman: 99000, flag: '💶' },
  { code: 'AED', name: { fa: 'درهم امارات', en: 'UAE dirham', tr: 'BAE dirhemi' }, symbol: 'د.إ', rateToToman: 25000, flag: '🇦🇪' },
];

export const currencySeeder: Seeder = async (db) => {
  if (await db.currency.count()) return;
  await db.currency.createMany({ data: CURRENCIES.map((currency, index) => ({ ...currency, sortOrder: index + 1 })) });
};
