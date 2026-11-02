import type { Seeder } from '../seed';

const CURRENCIES = [
  { code: 'TRY', name: 'لیر ترکیه', symbol: '₺', rateToToman: 2600, flag: '🇹🇷' },
  { code: 'USD', name: 'دلار آمریکا', symbol: '$', rateToToman: 92000, flag: '🇺🇸' },
  { code: 'EUR', name: 'یورو اروپا', symbol: '€', rateToToman: 99000, flag: '🇪🇺' },
  { code: 'AED', name: 'درهم امارات', symbol: 'د.إ', rateToToman: 25000, flag: '🇦🇪' },
];

export const currencySeeder: Seeder = async (db) => {
  if (await db.currency.count()) return;
  await db.currency.createMany({ data: CURRENCIES.map((currency, index) => ({ ...currency, sortOrder: index + 1 })) });
};
