export type Tone = 'teal' | 'gold';

// Grouped by what the visitor came to do, not by the internal service categories.
export const LINES: { title: string; tone: Tone; slugs: string[] }[] = [
  { title: 'برای سفر و ارسال بار', tone: 'teal', slugs: ['bus-vip-tehran-istanbul', 'cargo-express-postal', 'cargo-customs-clearance'] },
  { title: 'برای کسب‌وکار و نقل‌وانتقال پول', tone: 'gold', slugs: ['company-registration', 'currency-exchange-swift'] },
  { title: 'برای اسناد و امور حقوقی', tone: 'teal', slugs: ['legal-power-of-attorney', 'official-translation'] },
  { title: 'برای ویزا، اقامت و ازدواج', tone: 'gold', slugs: ['international-visa', 'education-residence-permit', 'international-marriage', 'turkey-weddings'] },
];
