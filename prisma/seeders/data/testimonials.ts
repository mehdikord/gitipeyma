// The home page's starting numbers, testimonials and quotes, in every language.

export const TESTIMONIALS_METRICS = [
  {
    id: 'kpi-satisfaction',
    value: {
      fa: '۹۹.۶٪',
      en: '99.6%',
      tr: '%99,6',
    },
    label: {
      fa: 'شاخص رضایت مسافران و بازرگانان',
      en: 'Passenger and trader satisfaction',
      tr: 'Yolcu ve tüccar memnuniyet endeksi',
    },
    subtext: {
      fa: 'بر اساس ۲,۸۴۰ نظرسنجی ثبت‌شده در CRM',
      en: 'Based on 2,840 surveys recorded in our CRM',
      tr: 'CRM\'e kayıtlı 2.840 ankete göre',
    },
    trend: {
      fa: '+۲.۴٪ در سال ۱۴۰۳',
      en: '+2.4% in 2024',
      tr: '2024\'te +%2,4',
    },
  },
  {
    id: 'kpi-passengers',
    value: {
      fa: '+۲۸,۵۰۰',
      en: '28,500+',
      tr: '28.500+',
    },
    label: {
      fa: 'مسافر بین‌المللی جابه‌جاشده',
      en: 'International passengers carried',
      tr: 'Taşınan uluslararası yolcu',
    },
    subtext: {
      fa: 'خط مستقیم ۲۵ صندلی VIP تهران ⇄ استانبول',
      en: 'Direct 25-seat VIP line Tehran ⇄ Istanbul',
      tr: '25 koltuklu doğrudan VIP hat Tahran ⇄ İstanbul',
    },
    trend: {
      fa: 'حرکت منظم روزانه بدون تاخیر',
      en: 'Regular daily departures, on time',
      tr: 'Rötarsız, düzenli günlük seferler',
    },
  },
  {
    id: 'kpi-clearance',
    value: {
      fa: '+۱,۶۲۰',
      en: '1,620+',
      tr: '1.620+',
    },
    label: {
      fa: 'پرونده کارگو، گمرک و ثبت شرکت',
      en: 'Cargo, customs and company registration files',
      tr: 'Kargo, gümrük ve şirket kuruluşu dosyası',
    },
    subtext: {
      fa: 'با ضمانت بارنامه رسمی بین‌المللی CMR',
      en: 'Backed by an official international CMR waybill',
      tr: 'Resmi uluslararası CMR taşıma senedi güvencesiyle',
    },
    trend: {
      fa: '۱۰۰٪ پوشش بیمه‌ای رسمی',
      en: '100% official insurance cover',
      tr: '%100 resmi sigorta teminatı',
    },
  },
  {
    id: 'kpi-speed',
    value: {
      fa: '۳۰ دقیقه',
      en: '30 minutes',
      tr: '30 dakika',
    },
    label: {
      fa: 'میانگین زمان تسویه حوالجات ارزی',
      en: 'Average settlement time for currency transfers',
      tr: 'Döviz transferlerinde ortalama ödeme süresi',
    },
    subtext: {
      fa: 'انتقال امن به حساب‌های ترکیه و دبی',
      en: 'Secure transfers to accounts in Turkey and Dubai',
      tr: 'Türkiye ve Dubai\'deki hesaplara güvenli transfer',
    },
    trend: {
      fa: 'بدون ریسک بلوکه شدن',
      en: 'No risk of frozen accounts',
      tr: 'Hesap bloke riski yok',
    },
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: 'testi-1',
    clientName: {
      fa: 'مهندس آرش شریفی (بازرگان پوشاک و منسوجات)',
      en: 'Eng. Arash Sharifi (clothing and textile trader)',
      tr: 'Müh. Arash Sharifi (giyim ve tekstil tüccarı)',
    },
    serviceUsed: {
      fa: 'سرویس VIP اتوبوس تهران - استانبول',
      en: 'VIP coach Tehran – Istanbul',
      tr: 'Tahran – İstanbul VIP otobüs',
    },
    routeOrContext: {
      fa: 'سفرهای هفتگی تجاری از پایانه غرب آزادی به پایانه بویوک استانبول و آکسارای',
      en: 'Weekly business trips from Azadi West Terminal to Istanbul’s Büyük and Aksaray terminals',
      tr: 'Azadi Batı Terminali\'nden İstanbul Büyük ve Aksaray terminallerine haftalık iş seyahatleri',
    },
    comment: {
      fa: 'بیش از ۲ سال است برای سفرهای کاری هفتگی به استانبول از خط VIP رویال تراول استفاده می‌کنم. صندلی‌های تک‌نفره تخت‌شو ۲۵ نفره همراه با اینترنت وای‌فای و پریز اختصاصی امکان کار طول سفر را فراهم می‌کند. تشریفات مرزی در گیت بازرگان بسیار منظم و بدون معطلی مسافران انجام می‌شود.',
      en: 'For more than two years I have taken Royal Travel’s VIP line on my weekly business trips to Istanbul. The 25 single reclining seats, with Wi-Fi and a socket of my own, let me work throughout the journey. Border formalities at the Bazargan gate are very well organised and passengers are never kept waiting.',
      tr: 'İki yılı aşkın süredir İstanbul\'a haftalık iş seyahatlerimde Royal Travel\'ın VIP hattını kullanıyorum. Wi-Fi ve kişisel prizli 25 tekli yataklı koltuk, yolculuk boyunca çalışmamı sağlıyor. Bazargan kapısındaki sınır işlemleri çok düzenli ve yolcular hiç bekletilmiyor.',
    },
    year: { fa: '۱۴۰۳', en: '2024', tr: '2024' },
    avatarSeed: 'bus-vip',
    rating: 5,
    category: 'transport',
    categoryLabel: {
      fa: 'حمل‌ونقل VIP',
      en: 'VIP transport',
      tr: 'VIP taşımacılık',
    },
    verifiedCode: { fa: 'بلیت رسمی VIP: GT-98214', en: 'Official VIP ticket: GT-98214', tr: 'Resmi VIP bilet: GT-98214' },
    outcomeHeadline: {
      fa: 'سفر بدون خستگی با صندلی تخت‌خواب‌شو و پذیرایی کامل',
      en: 'A restful journey with a sleeper seat and full catering',
      tr: 'Yataklı koltuk ve tam ikramla yorgunluksuz yolculuk',
    },
    originDestination: {
      fa: 'تهران (آزادی) ⇄ استانبول (آکسارای)',
      en: 'Tehran (Azadi) ⇄ Istanbul (Aksaray)',
      tr: 'Tahran (Azadi) ⇄ İstanbul (Aksaray)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'رزرو آنلاین و صدور آنی بلیت',
          en: 'Online booking and instant ticket',
          tr: 'Online rezervasyon ve anında bilet',
        },
        desc: {
          fa: 'صدور صندلی تک‌نفره با تأییدیه آنی پیامکی',
          en: 'A single seat issued with instant text-message confirmation',
          tr: 'Anında SMS onaylı tekli koltuk',
        },
      },
      {
        title: {
          fa: 'همراهی در مرز بازرگان',
          en: 'Support at the Bazargan border',
          tr: 'Bazargan sınırında eşlik',
        },
        desc: {
          fa: 'پشتیبانی اختصاصی مهمانداران در سالن تشریفات گمرکی',
          en: 'Dedicated help from the hosts in the customs hall',
          tr: 'Gümrük salonunda hosteslerden özel destek',
        },
      },
      {
        title: {
          fa: 'ورود سروقت به پایانه مقصد',
          en: 'On-time arrival at the terminal',
          tr: 'Terminale zamanında varış',
        },
        desc: {
          fa: 'رسیدن به موقع به پایانه اختصاصی آکسارای استانبول',
          en: 'Arriving on schedule at the dedicated Aksaray terminal in Istanbul',
          tr: 'İstanbul\'daki Aksaray terminaline tam vaktinde ulaşım',
        },
      },
    ],
  },
  {
    id: 'testi-2',
    clientName: {
      fa: 'دکتر علیرضا کاظمی (مدیر بازرگانی گروه نساجی آریا)',
      en: 'Dr. Alireza Kazemi (Commercial Director, Aria Textile Group)',
      tr: 'Dr. Alireza Kazemi (Aria Tekstil Grubu Ticaret Müdürü)',
    },
    serviceUsed: {
      fa: 'کارگو بین‌المللی تجاری و ترخیص گمرکی',
      en: 'International commercial cargo and customs clearance',
      tr: 'Uluslararası ticari kargo ve gümrükleme',
    },
    routeOrContext: {
      fa: 'ترخیص ۴.۵ تن مواد اولیه نساجی و قطعات صنعتی از گمرک شهریار',
      en: 'Clearance of 4.5 tonnes of textile raw materials and industrial parts at Shahriar customs',
      tr: 'Şehriyar gümrüğünde 4,5 ton tekstil hammaddesi ve endüstriyel parçanın gümrüklenmesi',
    },
    comment: {
      fa: 'انجام رویه‌های گمرکی و صدور بارنامه رسمی بین‌المللی CMR با شفافیت مثال‌زدنی انجام شد. بزرگ‌ترین دغدغه ما محاسبه درست تعرفه‌ها و پیشگیری از توقف کالا بود که تیم ترخیص رویال تراول بار را ظرف ۴ روز در انبار کارخانه در تهران تحویل دادند.',
      en: 'Customs procedures and the official international CMR waybill were handled with exemplary transparency. Our biggest worries were getting the tariffs right and keeping the goods from being held up, and Royal Travel’s clearance team delivered the shipment to our factory warehouse in Tehran within 4 days.',
      tr: 'Gümrük işlemleri ve resmi uluslararası CMR taşıma senedi örnek bir şeffaflıkla yürütüldü. En büyük kaygımız tarifelerin doğru hesaplanması ve malın beklememesiydi; Royal Travel gümrükleme ekibi yükü 4 gün içinde Tahran\'daki fabrika depomuza teslim etti.',
    },
    year: { fa: '۱۴۰۳', en: '2024', tr: '2024' },
    avatarSeed: 'cargo-pro',
    rating: 5,
    category: 'cargo',
    categoryLabel: {
      fa: 'کارگو و گمرک',
      en: 'Cargo and customs',
      tr: 'Kargo ve gümrük',
    },
    verifiedCode: { fa: 'بارنامه رسمی بین‌المللی CMR: TR-IR-8841', en: 'Official international CMR waybill: TR-IR-8841', tr: 'Resmi uluslararası CMR konşimentosu: TR-IR-8841' },
    outcomeHeadline: {
      fa: 'ترخیص قطعی ۴.۵ تن بار بدون دیرکرد و جریمه انبارداری',
      en: 'Final clearance of 4.5 tonnes with no delay or storage penalties',
      tr: '4,5 ton yükün gecikmesiz ve ardiye cezasız kesin gümrüklemesi',
    },
    originDestination: {
      fa: 'بورسا (ترکیه) ⇄ گمرک شهریار (تهران)',
      en: 'Bursa (Turkey) ⇄ Shahriar customs (Tehran)',
      tr: 'Bursa (Türkiye) ⇄ Şehriyar gümrüğü (Tahran)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'پکینگ و بارگیری در مبدا ترکیه',
          en: 'Packing and loading in Turkey',
          tr: 'Türkiye\'de paketleme ve yükleme',
        },
        desc: {
          fa: 'بسته‌بندی پالت‌بندی استاندارد و صدور پیش‌فاکتور گمرکی',
          en: 'Standard palletised packing and a customs proforma invoice',
          tr: 'Standart paletli ambalaj ve gümrük proforma faturası',
        },
      },
      {
        title: {
          fa: 'حمل ترانزیت با بیمه بین‌المللی',
          en: 'Insured international transit',
          tr: 'Sigortalı uluslararası transit',
        },
        desc: {
          fa: 'صدور کارنه تیر و بیمه تمام‌خطر محموله',
          en: 'TIR Carnet and all-risk cargo insurance',
          tr: 'TIR karnesi ve tam kapsamlı yük sigortası',
        },
      },
      {
        title: {
          fa: 'ترخیص و تحویل درب انبار',
          en: 'Clearance and delivery to the warehouse',
          tr: 'Gümrükleme ve depoya teslim',
        },
        desc: {
          fa: 'انجام تشریفات گمرک غرب در کمترین زمان ممکن',
          en: 'West customs formalities completed as fast as possible',
          tr: 'Batı gümrüğü işlemlerinin en kısa sürede tamamlanması',
        },
      },
    ],
  },
  {
    id: 'testi-3',
    clientName: {
      fa: 'سهراب فرهمند (بنیان‌گذار استارتاپ فناوری فین‌تک)',
      en: 'Sohrab Farahmand (founder of a fintech start-up)',
      tr: 'Sohrab Farahmand (fintek girişimi kurucusu)',
    },
    serviceUsed: {
      fa: 'ثبت شرکت در ترکیه و افتتاح حساب بانکی شرکتی',
      en: 'Company registration in Turkey and a corporate bank account',
      tr: 'Türkiye\'de şirket kuruluşu ve kurumsal banka hesabı',
    },
    routeOrContext: {
      fa: 'ثبت شرکت لیمیتد (Anonim/Limited) در شیشلی استانبول و حساب زراعت بانک',
      en: 'Registering a limited company (Anonim/Limited) in Şişli, Istanbul, with a Ziraat Bankası account',
      tr: 'İstanbul Şişli\'de limited şirket kuruluşu ve Ziraat Bankası hesabı',
    },
    comment: {
      fa: 'برای افتتاح حساب شرکتی و ثبت علامت تجاری در ترکیه چالش‌های فراوانی داشتیم. کارشناسان حقوقی رویال تراول در کمتر از ۸ روز کاری کد مالیاتی، عقد اجاره دفتر مجازی و حساب شرکتی مولتی‌کارنسی در زراعت بانک را با کارت مسترکارت فیزیکی تحویل ما دادند.',
      en: 'Opening a corporate account and registering a trademark in Turkey had been full of obstacles for us. In under 8 working days, Royal Travel’s legal team delivered our tax number, a virtual office lease and a multi-currency corporate account at Ziraat Bankası with a physical Mastercard.',
      tr: 'Türkiye\'de kurumsal hesap açmak ve marka tescili yaptırmak konusunda pek çok zorlukla karşılaşmıştık. Royal Travel\'ın hukuk ekibi 8 iş gününden kısa sürede vergi numaramızı, sanal ofis kira sözleşmesini ve fiziksel Mastercard\'lı çok dövizli Ziraat Bankası kurumsal hesabımızı teslim etti.',
    },
    year: { fa: '۱۴۰۳', en: '2024', tr: '2024' },
    avatarSeed: 'business-reg',
    rating: 5,
    category: 'business',
    categoryLabel: {
      fa: 'ثبت شرکت و بانک',
      en: 'Company and banking',
      tr: 'Şirket kuruluşu ve banka',
    },
    verifiedCode: { fa: 'کد ثبتی اتاق بازرگانی استانبول: İTO-81920', en: 'Istanbul Chamber of Commerce registration: İTO-81920', tr: 'İstanbul Ticaret Odası sicil no: İTO-81920' },
    outcomeHeadline: {
      fa: 'اخذ شماره مالیاتی و افتتاح حساب شرکتی ظرف ۸ روز کاری',
      en: 'Tax number and corporate account within 8 working days',
      tr: '8 iş günü içinde vergi numarası ve kurumsal hesap',
    },
    originDestination: {
      fa: 'تهران ⇄ استانبول (شیشلی)',
      en: 'Tehran ⇄ Istanbul (Şişli)',
      tr: 'Tahran ⇄ İstanbul (Şişli)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'تنظیم اساسنامه و ترجمه رسمی',
          en: 'Articles of association and certified translation',
          tr: 'Ana sözleşme ve resmi tercüme',
        },
        desc: {
          fa: 'ترجمه رسمی پاسپورت‌ها و ثبت در سامانه MERSİS',
          en: 'Certified passport translations and registration in MERSİS',
          tr: 'Pasaportların yeminli tercümesi ve MERSİS\'e kayıt',
        },
      },
      {
        title: {
          fa: 'حضور و امضا در اداره نوتر',
          en: 'Signing at the notary',
          tr: 'Noterde imza',
        },
        desc: {
          fa: 'همراهی مترجم رسمی قسم‌خورده در نوتر مرکزی',
          en: 'A sworn translator at the central notary',
          tr: 'Merkez noterde yeminli tercüman eşliği',
        },
      },
      {
        title: {
          fa: 'دریافت مسترکارت شرکتی',
          en: 'Corporate Mastercard received',
          tr: 'Kurumsal Mastercard\'ın teslimi',
        },
        desc: {
          fa: 'فعال‌سازی اینترنت بانک و تحویل توکن امنیتی',
          en: 'Online banking activated and security token delivered',
          tr: 'İnternet bankacılığının açılması ve güvenlik anahtarının teslimi',
        },
      },
    ],
  },
  {
    id: 'testi-4',
    clientName: {
      fa: 'پویان ناصری و سارا مقدم (زوج مقیم کانادا)',
      en: 'Pouyan Naseri and Sara Moghaddam (a couple living in Canada)',
      tr: 'Pouyan Naseri ve Sara Moghaddam (Kanada\'da yaşayan çift)',
    },
    serviceUsed: {
      fa: 'ثبت رسمی ازدواج بین‌المللی در استانبول',
      en: 'Official international marriage registration in Istanbul',
      tr: 'İstanbul\'da resmi uluslararası evlilik kaydı',
    },
    routeOrContext: {
      fa: 'ثبت شهرداری کادیکوی استانبول با شناسنامه بین‌المللی قرمز (Ailê Cüzdanı)',
      en: 'Registration at Kadıköy municipality, Istanbul, with the red international family booklet (Aile Cüzdanı)',
      tr: 'Kırmızı uluslararası aile cüzdanıyla (Aile Cüzdanı) İstanbul Kadıköy Belediyesi kaydı',
    },
    comment: {
      fa: 'سند ازدواج بین‌المللی صادره از شهرداری استانبول به زبان چندگانه و با مهر آپوستیل وزارت امور خارجه در کمتر از ۳ روز آماده شد و مستقیماً برای پیوست به پرونده اقامت کانادا تایید شد. سرعت، دقت و همراهی صمیمانه تیم رویال تراول فوق‌العاده بود.',
      en: 'Our multilingual international marriage certificate from the Istanbul municipality, with the foreign ministry’s Apostille, was ready in under 3 days and was accepted straight away for our Canadian residence file. The speed, precision and warm support of the Royal Travel team were outstanding.',
      tr: 'İstanbul belediyesinin düzenlediği, Dışişleri Bakanlığı apostilli çok dilli uluslararası evlilik belgemiz 3 günden kısa sürede hazırlandı ve Kanada oturum dosyamız için doğrudan kabul edildi. Royal Travel ekibinin hızı, titizliği ve samimi desteği olağanüstüydü.',
    },
    year: { fa: '۱۴۰۲', en: '2023', tr: '2023' },
    avatarSeed: 'marriage-couple',
    rating: 5,
    category: 'legal',
    categoryLabel: {
      fa: 'حقوقی و ثبت رسمی',
      en: 'Legal and official registration',
      tr: 'Hukuki ve resmi kayıt',
    },
    verifiedCode: { fa: 'سند ازدواج رسمی شهرداری: EVL-TR-9941', en: 'Official municipal marriage certificate: EVL-TR-9941', tr: 'Belediye resmi evlilik cüzdanı: EVL-TR-9941' },
    outcomeHeadline: {
      fa: 'ثبت عقد بین‌المللی در ۳ روز با مهر آپوستیل معتبر بین‌المللی',
      en: 'International marriage registered in 3 days, with an internationally valid Apostille',
      tr: '3 günde uluslararası nikâh kaydı, uluslararası geçerli apostilli',
    },
    originDestination: {
      fa: 'تهران ⇄ استانبول (کادیکوی)',
      en: 'Tehran ⇄ Istanbul (Kadıköy)',
      tr: 'Tahran ⇄ İstanbul (Kadıköy)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'اخذ برگه تجرد و تاییدیه کنسولگری',
          en: 'Certificate of single status and consular approval',
          tr: 'Bekârlık belgesi ve konsolosluk onayı',
        },
        desc: {
          fa: 'انجام آزمایشات پزشکی معتبر در بیمارستان طرف قرارداد',
          en: 'Approved medical tests at a contracted hospital',
          tr: 'Anlaşmalı hastanede onaylı sağlık testleri',
        },
      },
      {
        title: {
          fa: 'مراسم رسمی در سالن شهرداری',
          en: 'Official ceremony at the municipality',
          tr: 'Belediyede resmi tören',
        },
        desc: {
          fa: 'ثبت در دفاتر رسمی با حضور مترجم همزمان',
          en: 'Registration in the official records with a simultaneous interpreter',
          tr: 'Simultane tercüman eşliğinde resmi kayıtlara işlenme',
        },
      },
      {
        title: {
          fa: 'دریافت آپوستیل و دفترچه قرمز',
          en: 'Apostille and red booklet received',
          tr: 'Apostil ve kırmızı cüzdanın teslimi',
        },
        desc: {
          fa: 'تایید نهایی برای ارائه به کلیه سفارت‌خانه‌های خارجی',
          en: 'Final approval for submission to any foreign embassy',
          tr: 'Tüm yabancı büyükelçiliklere sunulmak üzere son onay',
        },
      },
    ],
  },
  {
    id: 'testi-5',
    clientName: {
      fa: 'نیما حبیبی (دانشجوی دکترای دندانپزشکی دانشگاه یدی‌تپه)',
      en: 'Nima Habibi (doctoral student in dentistry, Yeditepe University)',
      tr: 'Nima Habibi (Yeditepe Üniversitesi diş hekimliği doktora öğrencisi)',
    },
    serviceUsed: {
      fa: 'پذیرش تحصیلی و تمدید اقامت دانشجویی (İkamet)',
      en: 'University admission and student residence renewal (İkamet)',
      tr: 'Üniversite kabulü ve öğrenci ikameti uzatma',
    },
    routeOrContext: {
      fa: 'اخذ پذیرش رسمی دانشگاه یدی‌تپه استانبول و صدور کارت کیملیک',
      en: 'Official admission to Yeditepe University, Istanbul, and issue of a kimlik card',
      tr: 'İstanbul Yeditepe Üniversitesi resmi kabulü ve kimlik kartı düzenlenmesi',
    },
    comment: {
      fa: 'از مکاتبه اولیه با دانشگاه برای اخذ بورسیه تا پرداخت شهریه و راندووی اداره مهاجرت (Göç İdaresi)، تمام مراحل با مشاوره دقیق انجام شد. حتی بیمه درمانی دانشجویی معتبر را با مناسب‌ترین قیمت تهیه کردند.',
      en: 'From the first letters to the university about a scholarship, through paying tuition, to the appointment at the migration office (Göç İdaresi), every step came with careful advice. They even found valid student health insurance at the best price.',
      tr: 'Burs için üniversiteyle ilk yazışmadan harç ödemesine ve Göç İdaresi randevusuna kadar her adım titiz bir danışmanlıkla yürütüldü. Geçerli öğrenci sağlık sigortasını bile en uygun fiyata buldular.',
    },
    year: { fa: '۱۴۰۳', en: '2024', tr: '2024' },
    avatarSeed: 'student-edu',
    rating: 5,
    category: 'immigration',
    categoryLabel: {
      fa: 'اقامت و تحصیل',
      en: 'Residency and study',
      tr: 'Oturum ve eğitim',
    },
    verifiedCode: { fa: 'شماره پرونده اداره مهاجرت: GÖÇ-77192', en: 'Immigration office case number: GÖÇ-77192', tr: 'Göç İdaresi dosya numarası: GÖÇ-77192' },
    outcomeHeadline: {
      fa: 'اخذ بورسیه تحصیلی و صدور کارت اقامت دوساله دانشجویی',
      en: 'A scholarship and a two-year student residence card',
      tr: 'Burs ve iki yıllık öğrenci ikamet kartı',
    },
    originDestination: {
      fa: 'تبریز ⇄ استانبول (آتاشهیر)',
      en: 'Tabriz ⇄ Istanbul (Ataşehir)',
      tr: 'Tebriz ⇄ İstanbul (Ataşehir)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'ارزیابی مدارک و تاییدیه دنکلیک',
          en: 'Document review and equivalence (denklik)',
          tr: 'Belge incelemesi ve denklik onayı',
        },
        desc: {
          fa: 'اخذ پذیرش نهایی از دانشگاه بین‌المللی',
          en: 'Final admission from the international university',
          tr: 'Uluslararası üniversiteden kesin kabul',
        },
      },
      {
        title: {
          fa: 'تنظیم بیمه‌نامه و فایل راندوو',
          en: 'Insurance and appointment file',
          tr: 'Sigorta ve randevu dosyası',
        },
        desc: {
          fa: 'آماده‌سازی پرونده بدون ریسک ریجکتی',
          en: 'A file prepared with no risk of rejection',
          tr: 'Ret riski olmadan hazırlanan dosya',
        },
      },
      {
        title: {
          fa: 'تحویل کارت کیملیک از پست PTT',
          en: 'Kimlik card delivered by PTT',
          tr: 'Kimlik kartının PTT ile teslimi',
        },
        desc: {
          fa: 'دریافت کارت اقامت رسمی درب منزل',
          en: 'The official residence card delivered to the door',
          tr: 'Resmi ikamet kartının kapıda teslimi',
        },
      },
    ],
  },
  {
    id: 'testi-6',
    clientName: {
      fa: 'حاج محمد رضایی (مدیر شرکت صادرات و واردات فرابر)',
      en: 'Haj Mohammad Rezaei (Director, Faraber import–export company)',
      tr: 'Hacı Mohammad Rezaei (Faraber İthalat-İhracat Şirketi Müdürü)',
    },
    serviceUsed: {
      fa: 'حوالجات ارزی بین‌المللی و سوئیفت شرکتی',
      en: 'International currency transfers and corporate SWIFT',
      tr: 'Uluslararası döviz transferi ve kurumsal SWIFT',
    },
    routeOrContext: {
      fa: 'انتقال و تسویه لیر، یورو و درهم به حساب‌های تجاری کارخانجات ترکیه',
      en: 'Transfer and settlement of lira, euros and dirhams to the trade accounts of Turkish factories',
      tr: 'Türk fabrikalarının ticari hesaplarına lira, avro ve dirhem transferi ve ödemesi',
    },
    comment: {
      fa: 'در نقل و انتقالات مالی بزرگ، مهم‌ترین فاکتور سرعت انتقال و امنیت حساب بانکی است. کلیه حواله‌های ما ظرف کمتر از ۴۵ دقیقه با نرخ لحظه‌ای صرافی و با فاکتور رسمی بدون هیچ‌گونه ریسک مسدودی حساب انجام می‌پذیرد.',
      en: 'In large financial transfers, speed and the safety of the bank account matter most. All our transfers go through in under 45 minutes, at the live exchange rate and with an official invoice, with no risk of the account being frozen.',
      tr: 'Büyük para transferlerinde en önemli unsur hız ve banka hesabının güvenliğidir. Tüm transferlerimiz 45 dakikadan kısa sürede, anlık döviz kuruyla ve resmi faturayla, hesap bloke riski olmadan gerçekleşiyor.',
    },
    year: { fa: '۱۴۰۳', en: '2024', tr: '2024' },
    avatarSeed: 'swift-financial',
    rating: 5,
    category: 'financial',
    categoryLabel: {
      fa: 'مالی و سوئیفت',
      en: 'Finance and SWIFT',
      tr: 'Finans ve SWIFT',
    },
    verifiedCode: { fa: 'کد رهگیری سوئیفت: SWIFT-FX-3391', en: 'SWIFT tracking code: SWIFT-FX-3391', tr: 'SWIFT takip kodu: SWIFT-FX-3391' },
    outcomeHeadline: {
      fa: 'تسویه ارزی زیر ۴۵ دقیقه با فاکتور رسمی و ضمانت مبدا بانکی',
      en: 'Currency settled in under 45 minutes with an official invoice and verified bank source',
      tr: '45 dakikanın altında, resmi faturalı ve banka kaynağı güvenceli döviz ödemesi',
    },
    originDestination: {
      fa: 'تهران ⇄ استانبول (بانک واقیف و زراعت)',
      en: 'Tehran ⇄ Istanbul (VakıfBank and Ziraat)',
      tr: 'Tahran ⇄ İstanbul (VakıfBank ve Ziraat)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'استعلام لحظه‌ای نرخ ارز',
          en: 'Live exchange rate quote',
          tr: 'Anlık döviz kuru sorgusu',
        },
        desc: {
          fa: 'ثبت سفارش با بهترین نرخ صرافی رسمی',
          en: 'Order placed at the best official exchange rate',
          tr: 'En iyi resmi kurla sipariş',
        },
      },
      {
        title: {
          fa: 'تایید هویت حساب مقصد',
          en: 'Destination account verified',
          tr: 'Alıcı hesabın doğrulanması',
        },
        desc: {
          fa: 'بررسی صحت شماره IBAN و نام شرکت تحویل‌گیرنده',
          en: 'IBAN and recipient company name checked',
          tr: 'IBAN ve alıcı şirket adının kontrolü',
        },
      },
      {
        title: {
          fa: 'ارسال رسید رسمی بانکی',
          en: 'Official bank receipt sent',
          tr: 'Resmi banka dekontunun gönderimi',
        },
        desc: {
          fa: 'تسویه حساب و ارائه برگه تراکنش بانکی معتبر',
          en: 'Settlement and a valid bank transaction slip',
          tr: 'Ödemenin tamamlanması ve geçerli banka dekontu',
        },
      },
    ],
  },
  {
    id: 'testi-7',
    clientName: {
      fa: 'مهندس بهمن خلیلی (مدیر زنجیره تامین قطعات خودرو)',
      en: 'Eng. Bahman Khalili (supply chain manager, automotive parts)',
      tr: 'Müh. Bahman Khalili (otomotiv yedek parça tedarik zinciri müdürü)',
    },
    serviceUsed: {
      fa: 'ترانزیت جاده‌ای سنگین از ترکیه و بیمه CMR',
      en: 'Heavy road transit from Turkey with CMR insurance',
      tr: 'Türkiye\'den ağır kara transiti ve CMR sigortası',
    },
    routeOrContext: {
      fa: 'حمل محموله قطعات صنعتی از مبدا بورسا در ترکیه به تبریز',
      en: 'Shipping industrial parts from Bursa, Turkey, to Tabriz',
      tr: 'Bursa\'dan Tebriz\'e endüstriyel parça sevkiyatı',
    },
    comment: {
      fa: 'ترانزیت بارهای حساس صنعتی نیاز به نظارت مستمر و موقعیت‌یابی ۲۴ ساعته دارد. ناوگان رویال تراول با بارنامه سراسری TIR Carnet و پیگیری آنلاین، محموله ۲۲ تنی را بدون یک مورد خراشیدگی به سلامت ترخیص و تحویل داد.',
      en: 'Transit of sensitive industrial cargo needs constant supervision and round-the-clock tracking. With a TIR Carnet covering the whole route and online tracking, Royal Travel’s fleet cleared and delivered our 22-tonne shipment safely, without a single scratch.',
      tr: 'Hassas endüstriyel yüklerin transiti sürekli denetim ve 24 saat konum takibi gerektirir. Royal Travel filosu, tüm güzergâhı kapsayan TIR karnesi ve online takiple 22 tonluk sevkiyatımızı tek bir çizik olmadan gümrükleyip teslim etti.',
    },
    year: { fa: '۱۴۰۳', en: '2024', tr: '2024' },
    avatarSeed: 'transit-turkey',
    rating: 5,
    category: 'cargo',
    categoryLabel: {
      fa: 'ترانزیت ترکیه',
      en: 'Turkey transit',
      tr: 'Türkiye transiti',
    },
    verifiedCode: { fa: 'کارنه تیر بین‌المللی: TIR-TR-8291', en: 'International TIR carnet: TIR-TR-8291', tr: 'Uluslararası TIR karnesi: TIR-TR-8291' },
    outcomeHeadline: {
      fa: 'حمل امن محموله ۲۲ تنی از بورسا با رهگیری ماهواره‌ای GPS',
      en: 'A 22-tonne shipment from Bursa delivered safely with GPS satellite tracking',
      tr: 'GPS uydu takibiyle Bursa\'dan 22 tonluk yükün güvenli taşınması',
    },
    originDestination: {
      fa: 'بورسا (ترکیه) ⇄ گمرک تبریز (سهلان)',
      en: 'Bursa (Turkey) ⇄ Tabriz customs (Sahlan)',
      tr: 'Bursa (Türkiye) ⇄ Tebriz gümrüğü (Sahlan)',
    },
    satisfactionScore: '۵.۰ / ۵.۰',
    milestones: [
      {
        title: {
          fa: 'صدور کارنه تیر و گواهی پلمپ',
          en: 'TIR Carnet and seal certificate',
          tr: 'TIR karnesi ve mühür belgesi',
        },
        desc: {
          fa: 'بارگیری مطابق با بالاترین استانداردهای ایمنی بین‌المللی',
          en: 'Loaded to the highest international safety standards',
          tr: 'En yüksek uluslararası güvenlik standartlarına göre yükleme',
        },
      },
      {
        title: {
          fa: 'رهگیری ماهواره‌ای در طول مسیر',
          en: 'Satellite tracking en route',
          tr: 'Yol boyunca uydu takibi',
        },
        desc: {
          fa: 'گزارش‌دهی ۲۴ ساعته موقعیت جغرافیایی تریلی ترانزیت',
          en: '24-hour location reports for the transit trailer',
          tr: 'Transit tırın 24 saat konum raporlaması',
        },
      },
      {
        title: {
          fa: 'ترخیص در گمرک سهلان تبریز',
          en: 'Clearance at Sahlan customs, Tabriz',
          tr: 'Tebriz Sahlan gümrüğünde gümrükleme',
        },
        desc: {
          fa: 'فک پلمپ قانونی و تحویل بدون کوچک‌ترین آسیب',
          en: 'Legal unsealing and delivery without the slightest damage',
          tr: 'Yasal mühür açılışı ve en küçük hasar olmadan teslim',
        },
      },
    ],
  },
];

export const MARQUEE_TRUST_QUOTES = [
  {
    fa: '«صندلی‌های VIP تخت‌خواب‌شو رویال تراول سفر طولانی استانبول را مثل یک هتل متحرک لذت‌بخش می‌کند»',
    en: '“Royal Travel’s VIP sleeper seats make the long trip to Istanbul as pleasant as a hotel on wheels”',
    tr: '“Royal Travel’ın VIP yataklı koltukları uzun İstanbul yolculuğunu tekerlekli bir otel kadar keyifli kılıyor”',
  },
  {
    fa: '«تسویه سریع حواله لیر ظرف ۳۰ دقیقه و بدون کارمزد پنهان»',
    en: '“Lira transfers settled in 30 minutes, with no hidden fees”',
    tr: '“Lira transferleri 30 dakikada, gizli komisyon olmadan”',
  },
  {
    fa: '«ترخیص تخصصی گمرک و بیمه‌نامه معتبر بین‌المللی CMR»',
    en: '“Expert customs clearance and valid international CMR insurance”',
    tr: '“Uzman gümrükleme ve geçerli uluslararası CMR sigortası”',
  },
  {
    fa: '«دفاتر فیزیکی در آکسارای استانبول و پایانه‌های تهران و تبریز»',
    en: '“Offices in Aksaray, Istanbul, and at the Tehran and Tabriz terminals”',
    tr: '“İstanbul Aksaray’da ve Tahran ile Tebriz terminallerinde fiziksel ofisler”',
  },
  {
    fa: '«ثبت شرکت و حساب بانکی زراعت در کمتر از ۱۰ روز کاری»',
    en: '“Company registration and a Ziraat bank account in under 10 working days”',
    tr: '“10 iş gününden kısa sürede şirket kuruluşu ve Ziraat banka hesabı”',
  },
  {
    fa: '«پشتیبانی و همراهی ۲۴ ساعته در مرزهای ورودی و خروجی»',
    en: '“24-hour support at every border crossing, in and out”',
    tr: '“Giriş ve çıkış sınır kapılarında 7/24 destek ve eşlik”',
  },
];
