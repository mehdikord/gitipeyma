import { defineMessages } from './define';

// Shared by every page: the brand, the page titles and the language switcher.
export const common = defineMessages({
  fa: {
    brand: 'گیتی پیما',
    meta: {
      title: 'گیتی پیما | GITI International',
      titleTemplate: '%s | گیتی پیما',
      description:
        'سامانه رسمی گیتی پیما؛ خدمات بین‌المللی مسافری VIP، کارگو، خدمات ارزی، حقوقی، ثبت شرکت و اقامت فرامرزی بین ایران، ترکیه و اروپا.',
      services: 'فهرست خدمات',
      about: 'درباره ما',
      contact: 'ارتباط با ما',
      consultation: 'درخواست مشاوره',
      notFound: 'صفحه پیدا نشد',
    },
    language: { label: 'زبان', choose: 'انتخاب زبان' },
  },
  en: {
    brand: 'GITI Peyma',
    meta: {
      title: 'GITI Peyma | GITI International',
      titleTemplate: '%s | GITI Peyma',
      description:
        'The official GITI Peyma platform: VIP passenger travel, cargo, currency transfers, legal services, company registration and residency across Iran, Turkey and Europe.',
      services: 'Services',
      about: 'About us',
      contact: 'Contact us',
      consultation: 'Request a consultation',
      notFound: 'Page not found',
    },
    language: { label: 'Language', choose: 'Choose language' },
  },
  tr: {
    brand: 'GITI Peyma',
    meta: {
      title: 'GITI Peyma | GITI International',
      titleTemplate: '%s | GITI Peyma',
      description:
        'GITI Peyma resmi platformu: İran, Türkiye ve Avrupa arasında VIP yolcu taşımacılığı, kargo, döviz transferi, hukuki hizmetler, şirket kuruluşu ve oturum işlemleri.',
      services: 'Hizmetler',
      about: 'Hakkımızda',
      contact: 'İletişim',
      consultation: 'Danışmanlık talebi',
      notFound: 'Sayfa bulunamadı',
    },
    language: { label: 'Dil', choose: 'Dil seçin' },
  },
});
