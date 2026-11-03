import type { Locale } from '../../i18n/config';

// The topics a visitor can pick on the /contact message form. contact_messages.topic stores the
// Persian label, whatever language the visitor wrote in, so the panel reads and filters them as one list.
export const CONTACT_TOPICS = [
  'سرویس اتوبوس تهران - استانبول',
  'نرخ و پیگیری بار و کارگو',
  'ثبت شرکت و حساب بانکی',
  'خدمات ارزی و سوئیفت',
  'امور حقوقی و وکالتنامه',
  'سایر موارد و پیشنهادات',
];

// The same topics, in the same order, as the form shows them.
export const CONTACT_TOPIC_LABELS: Record<Locale, string[]> = {
  fa: CONTACT_TOPICS,
  en: [
    'Tehran – Istanbul bus service',
    'Cargo rates and tracking',
    'Company registration and bank account',
    'Currency and SWIFT transfers',
    'Legal matters and power of attorney',
    'Other questions and suggestions',
  ],
  tr: [
    'Tahran – İstanbul otobüs seferleri',
    'Kargo ücretleri ve takip',
    'Şirket kuruluşu ve banka hesabı',
    'Döviz ve SWIFT transferleri',
    'Hukuki işlemler ve vekâletname',
    'Diğer konular ve öneriler',
  ],
};
