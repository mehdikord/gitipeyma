import { ContactConfig, TeamMember } from '../types';

export const COMPANY_CONFIG: ContactConfig = {
  companyNameFa: 'نمایندگی رسمی گیتی پیما',
  companyNameEn: 'GITI International Services',
  brandTaglineFa: 'مرزها، پایان مسیر نیستند؛ آغاز فرصت‌های تازه‌اند.',
  brandTaglineEn: 'Borders are not boundaries; they are the start of new horizons.',
  emergencySupportPhone: '+90 (212) 588 40 40',
  emergencySupportAvailability: 'پاسخگویی و پشتیبانی ۲۴ ساعته در ۷ روز هفته',
  offices: [
    {
      city: 'استانبول (دفتر مرکزی ترکیه)',
      country: 'ترکیه',
      addressFa: 'استانبول، منطقه فاتیح، آکسارای، پایانه بین‌المللی اتوبوسرانی، دفتر مرکزی گیتی پیما',
      phones: ['+90 (212) 588 40 40', '+90 (536) 700 80 90'],
      email: 'istanbul@gitipuri.com',
      workingHours: 'سه‌شنبه تا یکشنبه: ۰۸:۰۰ الی ۲۲:۰۰ (خدمات شبانه‌روزی مسافری)',
      schedule: { timeZone: 'Europe/Istanbul', openHour: 8, closeHour: 22, closedWeekdays: [1] },
      isPrimary: true,
    },
    {
      city: 'تهران (دفتر ترانزیت و کارگو)',
      country: 'ایران',
      addressFa: 'تهران، میدان آزادی، پایانه مسافربری غرب، غرفه نمایندگی بین‌المللی گیتی پیما',
      phones: ['۰۲۱-۴۴۶۶۸۰۸۰', '۰۲۱-۴۴۶۶۸۰۸۱'],
      email: 'tehran@gitipuri.com',
      workingHours: 'همه‌روزه: ۰۷:۰۰ الی ۲۳:۰۰',
      schedule: { timeZone: 'Asia/Tehran', openHour: 7, closeHour: 23, closedWeekdays: [] },
      isPrimary: false,
    },
    {
      city: 'تبریز (دفتر هماهنگی مرزی و گمرک)',
      country: 'ایران',
      addressFa: 'تبریز، بلوار راه‌آهن، پایانه مسافربری مرکزی و گمرک ترانزیت بازرگان',
      phones: ['۰۴۱-۳۴۴۴۸۰۹۰'],
      email: 'tabriz@gitipuri.com',
      workingHours: 'همه‌روزه: ۰۸:۰۰ الی ۲۰:۰۰',
      schedule: { timeZone: 'Asia/Tehran', openHour: 8, closeHour: 20, closedWeekdays: [] },
      isPrimary: false,
    },
  ],
  socials: [
    {
      platform: 'WhatsApp',
      label: 'واتس‌اپ پشتیبانی ۲۴ ساعته',
      url: 'https://wa.me/905367008090',
      iconName: 'MessageCircle',
    },
    {
      platform: 'Telegram',
      label: 'کانال رسمی اطلاع‌رسانی حرکت‌ها',
      url: 'https://t.me/GitiPeymaOfficial',
      iconName: 'Send',
    },
    {
      platform: 'Instagram',
      label: 'صفحه رسمی اینستاگرام',
      url: 'https://instagram.com/gitipeyma_official',
      iconName: 'Instagram',
    },
    {
      platform: 'LinkedIn',
      label: 'لینکدین تجارت و امور بین‌الملل',
      url: 'https://linkedin.com/company/giti-international',
      iconName: 'Linkedin',
    },
  ],
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'مهندس آرش جهانبخش',
    role: 'مدیر ارشد عملیات و ناوگان بین‌المللی',
    specialty: 'مدیریت ترانزیت جاده‌ای و هماهنگی خط تهران - استانبول',
    department: 'لجستیک و حمل‌ونقل',
    image: '/images/team/team-1.webp',
  },
  {
    id: 'team-2',
    name: 'سحر اردلان',
    role: 'سرپرست دپارتمان امور کنسولی و ثبت شرکت',
    specialty: 'حقوق تجارت بین‌الملل و ثبت شرکت در ترکیه و اروپا',
    department: 'حقوقی و ثبت شرکت',
    image: '/images/team/team-2.webp',
  },
  {
    id: 'team-3',
    name: 'کامران داوودی',
    role: 'کارشناس ارشد ترخیص کالا و کارگو',
    specialty: 'تشریفات گمرکات رسمی ایران و ترکیه (CMR و کارنه تیر)',
    department: 'کارگو و تجارت',
    image: '/images/team/team-3.webp',
  },
  {
    id: 'team-4',
    name: 'مریم نیک‌بین',
    role: 'مدیر ارتباطات مشتریان و پذیرش اقامتی',
    specialty: 'پذیرش دانشگاهی، اقامت و تشریفات ازدواج بین‌المللی',
    department: 'روابط بین‌الملل و امور متقاضیان',
    image: '/images/team/team-4.webp',
  },
];
