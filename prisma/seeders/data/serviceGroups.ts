import type { Translated } from '../../../src/i18n/translated';

export type Tone = 'teal' | 'gold';

// Grouped by what the visitor came to do, not by the internal service categories.
export const LINES: { title: Required<Translated>; tone: Tone; slugs: string[] }[] = [
  { title: { fa: 'برای سفر و ارسال بار', en: 'For travel and shipping', tr: 'Seyahat ve gönderiler için' }, tone: 'teal', slugs: ['bus-vip-tehran-istanbul', 'cargo-express-postal', 'cargo-customs-clearance'] },
  { title: { fa: 'برای کسب‌وکار و نقل‌وانتقال پول', en: 'For business and money transfers', tr: 'İş dünyası ve para transferleri için' }, tone: 'gold', slugs: ['company-registration', 'currency-exchange-swift'] },
  { title: { fa: 'برای اسناد و امور حقوقی', en: 'For documents and legal matters', tr: 'Belgeler ve hukuki işler için' }, tone: 'teal', slugs: ['legal-power-of-attorney', 'official-translation'] },
  { title: { fa: 'برای ویزا، اقامت و ازدواج', en: 'For visas, residency and marriage', tr: 'Vize, oturum ve evlilik için' }, tone: 'gold', slugs: ['international-visa', 'education-residence-permit', 'international-marriage', 'turkey-weddings'] },
];
