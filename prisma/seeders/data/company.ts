// Offices, links and the team the site starts with; each text in every language.
export const COMPANY_CONFIG = {
  offices: [
    {
      country: { fa: 'ترکیه', en: 'Turkey', tr: 'Türkiye' },
      address: { fa: 'استانبول، منطقه فاتیح، آکسارای، پایانه بین‌المللی اتوبوسرانی، دفتر مرکزی رویال تراول', en: 'Royal Travel head office, International Bus Terminal, Aksaray, Fatih, Istanbul', tr: 'Royal Travel Merkez Ofisi, Uluslararası Otobüs Terminali, Aksaray, Fatih, İstanbul' },
      phones: ['+90 (212) 588 40 40', '+90 (536) 700 80 90'],
      email: 'istanbul@gitipuri.com',
      workingHours: { fa: 'سه‌شنبه تا یکشنبه: ۰۸:۰۰ الی ۲۲:۰۰ (خدمات شبانه‌روزی مسافری)', en: 'Tuesday to Sunday: 08:00 to 22:00 (passenger services around the clock)', tr: 'Salı – Pazar: 08:00 – 22:00 (yolcu hizmetleri 7/24)' },
      schedule: { timeZone: 'Europe/Istanbul', openHour: 8, closeHour: 22, closedWeekdays: [1] },
      isPrimary: true,
    },
    {
      country: { fa: 'ایران', en: 'Iran', tr: 'İran' },
      address: { fa: 'تهران، میدان آزادی، پایانه مسافربری غرب، غرفه نمایندگی بین‌المللی رویال تراول', en: 'Royal Travel international agency desk, West Passenger Terminal, Azadi Square, Tehran', tr: 'Royal Travel uluslararası acente bankosu, Batı Yolcu Terminali, Azadi Meydanı, Tahran' },
      phones: ['۰۲۱-۴۴۶۶۸۰۸۰', '۰۲۱-۴۴۶۶۸۰۸۱'],
      email: 'tehran@gitipuri.com',
      workingHours: { fa: 'همه‌روزه: ۰۷:۰۰ الی ۲۳:۰۰', en: 'Every day: 07:00 to 23:00', tr: 'Her gün: 07:00 – 23:00' },
      schedule: { timeZone: 'Asia/Tehran', openHour: 7, closeHour: 23, closedWeekdays: [] },
      isPrimary: false,
    },
    {
      country: { fa: 'ایران', en: 'Iran', tr: 'İran' },
      address: { fa: 'تبریز، بلوار راه‌آهن، پایانه مسافربری مرکزی و گمرک ترانزیت بازرگان', en: 'Central Passenger Terminal and Bazargan transit customs, Rah-Ahan Boulevard, Tabriz', tr: 'Merkez Yolcu Terminali ve Bazargan transit gümrüğü, Rah-Ahan Bulvarı, Tebriz' },
      phones: ['۰۴۱-۳۴۴۴۸۰۹۰'],
      email: 'tabriz@gitipuri.com',
      workingHours: { fa: 'همه‌روزه: ۰۸:۰۰ الی ۲۰:۰۰', en: 'Every day: 08:00 to 20:00', tr: 'Her gün: 08:00 – 20:00' },
      schedule: { timeZone: 'Asia/Tehran', openHour: 8, closeHour: 20, closedWeekdays: [] },
      isPrimary: false,
    },
  ],
  socials: [
    {
      platform: 'WhatsApp',
      label: { fa: 'واتس‌اپ پشتیبانی ۲۴ ساعته', en: '24-hour WhatsApp support', tr: '7/24 WhatsApp destek hattı' },
      url: 'https://wa.me/905367008090',
      iconName: 'MessageCircle',
    },
    {
      platform: 'Telegram',
      label: { fa: 'کانال رسمی اطلاع‌رسانی حرکت‌ها', en: 'Official departures channel', tr: 'Resmi sefer duyuru kanalı' },
      url: 'https://t.me/GitiPeymaOfficial',
      iconName: 'Send',
    },
    {
      platform: 'Instagram',
      label: { fa: 'صفحه رسمی اینستاگرام', en: 'Official Instagram page', tr: 'Resmi Instagram sayfası' },
      url: 'https://instagram.com/gitipeyma_official',
      iconName: 'Instagram',
    },
    {
      platform: 'LinkedIn',
      label: { fa: 'لینکدین تجارت و امور بین‌الملل', en: 'LinkedIn: trade and international affairs', tr: 'LinkedIn: ticaret ve uluslararası işler' },
      url: 'https://linkedin.com/company/giti-international',
      iconName: 'Linkedin',
    },
  ],
};

export const TEAM_MEMBERS = [
  {
    id: 'team-1',
    name: { fa: 'مهندس آرش جهانبخش', en: 'Eng. Arash Jahanbakhsh', tr: 'Müh. Arash Jahanbakhsh' },
    role: { fa: 'مدیر ارشد عملیات و ناوگان بین‌المللی', en: 'Chief Operations and International Fleet Officer', tr: 'Operasyon ve Uluslararası Filo Direktörü' },
    specialty: { fa: 'مدیریت ترانزیت جاده‌ای و هماهنگی خط تهران - استانبول', en: 'Road transit management and Tehran – Istanbul line coordination', tr: 'Kara transiti yönetimi ve Tahran – İstanbul hattı koordinasyonu' },
    department: { fa: 'لجستیک و حمل‌ونقل', en: 'Logistics and transport', tr: 'Lojistik ve taşımacılık' },
    image: '/images/team/team-1.webp',
  },
  {
    id: 'team-2',
    name: { fa: 'سحر اردلان', en: 'Sahar Ardalan', tr: 'Sahar Ardalan' },
    role: { fa: 'سرپرست دپارتمان امور کنسولی و ثبت شرکت', en: 'Head of Consular Affairs and Company Registration', tr: 'Konsolosluk İşleri ve Şirket Kuruluşu Bölüm Sorumlusu' },
    specialty: { fa: 'حقوق تجارت بین‌الملل و ثبت شرکت در ترکیه', en: 'International trade law and company registration in Turkey', tr: 'Uluslararası ticaret hukuku ile Türkiye\'de şirket kuruluşu' },
    department: { fa: 'حقوقی و ثبت شرکت', en: 'Legal and company registration', tr: 'Hukuk ve şirket kuruluşu' },
    image: '/images/team/team-2.webp',
  },
  {
    id: 'team-3',
    name: { fa: 'کامران داوودی', en: 'Kamran Davoudi', tr: 'Kamran Davoudi' },
    role: { fa: 'کارشناس ارشد ترخیص کالا و کارگو', en: 'Senior Customs Clearance and Cargo Specialist', tr: 'Kıdemli Gümrükleme ve Kargo Uzmanı' },
    specialty: { fa: 'تشریفات گمرکات رسمی ایران و ترکیه (CMR و کارنه تیر)', en: 'Official customs procedures in Iran and Turkey (CMR and TIR Carnet)', tr: 'İran ve Türkiye resmi gümrük işlemleri (CMR ve TIR karnesi)' },
    department: { fa: 'کارگو و تجارت', en: 'Cargo and trade', tr: 'Kargo ve ticaret' },
    image: '/images/team/team-3.webp',
  },
  {
    id: 'team-4',
    name: { fa: 'مریم نیک‌بین', en: 'Maryam Nikbin', tr: 'Maryam Nikbin' },
    role: { fa: 'مدیر ارتباطات مشتریان و پذیرش اقامتی', en: 'Head of Client Relations and Residency Admissions', tr: 'Müşteri İlişkileri ve Oturum Kabul Müdürü' },
    specialty: { fa: 'پذیرش دانشگاهی، اقامت و تشریفات ازدواج بین‌المللی', en: 'University admissions, residency and international marriage formalities', tr: 'Üniversite kabulü, oturum ve uluslararası evlilik işlemleri' },
    department: { fa: 'روابط بین‌الملل و امور متقاضیان', en: 'International relations and applicant services', tr: 'Uluslararası ilişkiler ve başvuru sahibi hizmetleri' },
    image: '/images/team/team-4.webp',
  },
];
