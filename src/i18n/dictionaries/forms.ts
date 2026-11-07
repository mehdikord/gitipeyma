import { defineMessages } from './define';

// Shared by every public form: the receipt shown once a request is saved, and the illustrated
// stand-ins for services without a photo.
export const forms = defineMessages({
  fa: {
    received: {
      title: 'درخواست شما ثبت شد',
      text: 'کارشناسان رویال تراول درخواست شما را بررسی می‌کنند و به‌زودی با شماره‌ای که وارد کردید تماس می‌گیرند.',
      reset: 'ثبت درخواست دیگر',
      reference: 'شماره پیگیری',
      urgent: 'کارتان فوری است؟',
    },
    serviceImage: {
      bus: 'سرویس VIP اتوبوس تهران ⇄ استانبول',
      cargo: 'کارگو تجاری و ترخیص گمرکی',
      company: 'ثبت شرکت بین‌المللی',
      currency: 'حواله ارزی و تسویه سوئیفت',
      visa: 'ویزای بین‌المللی (کانادا و آمریکا)',
      legal: 'خدمات حقوقی، وکالتنامه و ترجمه',
      wedding: 'تشریفات ازدواج بین‌المللی در ترکیه',
      education: 'پذیرش دانشگاهی و کارت اقامت',
    },
  },
  en: {
    received: {
      title: 'Your request has been received',
      text: 'Royal Travel specialists will review your request and call you shortly on the number you entered.',
      reset: 'Send another request',
      reference: 'Reference number',
      urgent: 'Is it urgent?',
    },
    serviceImage: {
      bus: 'VIP coach Tehran ⇄ Istanbul',
      cargo: 'Commercial cargo and customs clearance',
      company: 'International company registration',
      currency: 'Currency transfers and SWIFT settlement',
      visa: 'International visas (Canada and the US)',
      legal: 'Legal services, power of attorney and translation',
      wedding: 'International wedding arrangements in Turkey',
      education: 'University admission and residence permits',
    },
  },
  tr: {
    received: {
      title: 'Talebiniz alındı',
      text: 'Royal Travel uzmanları talebinizi inceleyecek ve girdiğiniz numaradan kısa süre içinde sizi arayacak.',
      reset: 'Yeni bir talep gönder',
      reference: 'Takip numarası',
      urgent: 'Acil mi?',
    },
    serviceImage: {
      bus: 'VIP otobüs Tahran ⇄ İstanbul',
      cargo: 'Ticari kargo ve gümrük işlemleri',
      company: 'Uluslararası şirket kuruluşu',
      currency: 'Döviz transferi ve SWIFT ödemeleri',
      visa: 'Uluslararası vize (Kanada ve ABD)',
      legal: 'Hukuki hizmetler, vekâletname ve tercüme',
      wedding: "Türkiye'de uluslararası düğün organizasyonu",
      education: 'Üniversite kabulü ve ikamet izni',
    },
  },
});
