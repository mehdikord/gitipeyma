import { defineMessages } from './define';

// Shared by every page: the brand, the page titles and the language switcher.
export const common = defineMessages({
  fa: {
    brand: 'رویال تراول',
    meta: {
      title: 'رویال تراول | Royal Travel',
      titleTemplate: '%s | رویال تراول',
      description:
        'سامانه رسمی رویال تراول؛ خدمات بین‌المللی مسافری VIP، کارگو، خدمات ارزی، حقوقی، ثبت شرکت و اقامت فرامرزی بین ایران و ترکیه.',
      services: 'فهرست خدمات',
      about: 'درباره ما',
      contact: 'ارتباط با ما',
      consultation: 'درخواست مشاوره',
      notFound: 'صفحه پیدا نشد',
    },
    language: { label: 'زبان', choose: 'انتخاب زبان' },
  },
  en: {
    brand: 'Royal Travel',
    meta: {
      title: 'Royal Travel',
      titleTemplate: '%s | Royal Travel',
      description:
        'The official Royal Travel platform: VIP passenger travel, cargo, currency transfers, legal services, company registration and residency between Iran and Turkey.',
      services: 'Services',
      about: 'About us',
      contact: 'Contact us',
      consultation: 'Request a consultation',
      notFound: 'Page not found',
    },
    language: { label: 'Language', choose: 'Choose language' },
  },
  tr: {
    brand: 'Royal Travel',
    meta: {
      title: 'Royal Travel',
      titleTemplate: '%s | Royal Travel',
      description:
        'Royal Travel resmi platformu: İran ve Türkiye arasında VIP yolcu taşımacılığı, kargo, döviz transferi, hukuki hizmetler, şirket kuruluşu ve oturum işlemleri.',
      services: 'Hizmetler',
      about: 'Hakkımızda',
      contact: 'İletişim',
      consultation: 'Danışmanlık talebi',
      notFound: 'Sayfa bulunamadı',
    },
    language: { label: 'Dil', choose: 'Dil seçin' },
  },
});
