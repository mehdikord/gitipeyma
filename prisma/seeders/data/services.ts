// The site's starting services, in every language. Seeded by serviceSeeder; TranslationSeeder also uses
// them to add English and Turkish to rows that still have the same Persian text.

export const SERVICES_DATA = [
  {
    id: 'service-1',
    slug: 'bus-vip-tehran-istanbul',
    title: {
      fa: 'سرویس VIP اتوبوس تهران به استانبول',
      en: 'VIP Coach Service from Tehran to Istanbul',
      tr: 'Tahran – İstanbul VIP Otobüs Seferleri',
    },
    shortTitle: {
      fa: 'اتوبوس VIP تهران - استانبول',
      en: 'VIP Coach Tehran – Istanbul',
      tr: 'Tahran – İstanbul VIP Otobüs',
    },
    category: 'transport',
    categoryLabel: {
      fa: 'حمل‌ونقل بین‌المللی',
      en: 'International transport',
      tr: 'Uluslararası taşımacılık',
    },
    eyebrow: {
      fa: 'تنها نمایندگی رسمی شرکت بین‌المللی گیتی پیما در ترکیه',
      en: 'The only official agency of GITI International in Turkey',
      tr: 'GITI International\'ın Türkiye\'deki tek resmi acentesi',
    },
    summary: {
      fa: 'ارائه سرویس‌های روزانه VIP با صندلی تک‌نفره تخت‌خواب‌شو، مانیتور اختصاصی و اینترنت وای‌فای از تهران به استانبول و بالعکس.',
      en: 'Daily VIP coaches between Tehran and Istanbul, in both directions, with single reclining sleeper seats, a personal screen and Wi-Fi.',
      tr: 'Tahran ile İstanbul arasında her iki yönde günlük VIP seferler: tekli yataklı koltuk, kişisel ekran ve Wi-Fi.',
    },
    description: {
      fa: 'گیتی پیما به عنوان تنها نمایندگی رسمی در ترکیه، سفرهای بین‌المللی جاده‌ای میان ایران و ترکیه را با بالاترین استانداردهای رفاهی ارائه می‌دهد. ناوگان پیشرفته مجهز به سیستم تهویه هوشمند، صندلی‌های ارگونومیک تک‌نفره، پذیرایی گرم و مهمانداران مسلط به زبان‌های فارسی و ترکی در تمام طول مسیر همراه شما خواهند بود.',
      en: 'As the only official agency in Turkey, GITI Peyma runs road travel between Iran and Turkey to the highest standards of comfort. Our modern fleet has smart climate control, ergonomic single seats and hot meals, and hosts fluent in Persian and Turkish travel with you the whole way.',
      tr: 'Türkiye\'deki tek resmi acente olarak GITI Peyma, İran ile Türkiye arasındaki kara yolculuklarını en yüksek konfor standartlarıyla sunar. Akıllı klima sistemi, ergonomik tekli koltuklar ve sıcak ikramlarla donatılmış modern filomuzda, Farsça ve Türkçe bilen hostesler yolculuk boyunca yanınızdadır.',
    },
    detailedContent: [
      {
        fa: 'سفر جاده‌ای میان تهران و استانبول یکی از زیباترین و خاطره‌انگیزترین مسیرهای ترانزیتی منطقه است. اتوبوس‌های ۲۵ نفره VIP گیتی پیما با فاصله صندلی استاندارد هواپیمایی، تجربه‌ای بدون خستگی را برای مسافران رقم می‌زنند.',
        en: 'The road between Tehran and Istanbul is one of the most beautiful and memorable transit routes in the region. GITI Peyma’s 25-seat VIP coaches have airline-standard seat spacing, so passengers arrive rested.',
        tr: 'Tahran – İstanbul kara yolu, bölgenin en güzel ve unutulmaz transit güzergâhlarından biridir. GITI Peyma\'nın 25 kişilik VIP otobüsleri, havayolu standardında koltuk aralığıyla yorgunluk hissettirmeyen bir yolculuk sunar.',
      },
      {
        fa: 'حرکت‌های روزانه همه‌روزه از پایانه‌های غرب تهران و پایانه بیهقی به سمت پایانه اسنلر و آکسارای استانبول انجام می‌پذیرد و توقف‌های برنامه‌ریزی‌شده در مجتمع‌های رفاهی استاندارد مرزی و بین‌راهی در ترکیه تضمین‌کننده آسایش شماست.',
        en: 'Coaches leave every day from Tehran’s West Terminal and Beyhaghi Terminal for Esenler and Aksaray terminals in Istanbul, with planned stops at standard service areas at the border and along the way in Turkey for your comfort.',
        tr: 'Seferler her gün Tahran Batı Terminali ve Beyhaghi Terminali\'nden İstanbul\'daki Esenler ve Aksaray terminallerine yapılır; sınırda ve Türkiye\'deki güzergâh boyunca standart dinlenme tesislerinde planlı molalar konforunuzu güvence altına alır.',
      },
      {
        fa: 'امکان حمل بار مجاز مسافری تا ۳۰ کیلوگرم، بیمه‌نامه مسافرتی بین‌المللی معتبر در طول سفر، و پشتیبانی مرزی ۲۴ ساعته در مرز بازرگان - گوربولاغ از دیگر مزایای ویژه سفر با گیتی پیما است.',
        en: 'A passenger baggage allowance of up to 30 kg, valid international travel insurance for the whole journey, and 24-hour support at the Bazargan – Gürbulak border are among the other benefits of travelling with GITI Peyma.',
        tr: '30 kg\'a kadar yolcu bagaj hakkı, yolculuk boyunca geçerli uluslararası seyahat sigortası ve Bazargan – Gürbulak sınır kapısında 7/24 destek, GITI Peyma ile seyahatin diğer ayrıcalıklarıdır.',
      },
    ],
    features: [
      {
        fa: 'صندلی‌های تک‌نفره تخت‌خواب‌شو با روکش چرم طبیعی و فضای استراحت اختصاصی',
        en: 'Single reclining sleeper seats in genuine leather with your own space to rest',
        tr: 'Doğal deri kaplı tekli yataklı koltuklar ve size ayrılmış dinlenme alanı',
      },
      {
        fa: 'اینترنت Wi-Fi ماهواره‌ای پرسرعت در سراسر خاک ایران و ترکیه',
        en: 'High-speed satellite Wi-Fi across Iran and Turkey',
        tr: 'İran ve Türkiye\'nin tamamında yüksek hızlı uydu Wi-Fi',
      },
      {
        fa: 'مانیتور لمسی اختصاصی برای هر صندلی با آرشیو فیلم و موسیقی روز',
        en: 'A personal touch screen at every seat with the latest films and music',
        tr: 'Her koltukta güncel film ve müzik arşivli kişisel dokunmatik ekran',
      },
      {
        fa: 'پریز برق ۲۲۰ ولت و پورت‌های USB مستقل جهت شارژ دستگاه‌ها',
        en: '220-volt sockets and separate USB ports for charging your devices',
        tr: 'Cihazlarınızı şarj etmek için 220 volt priz ve ayrı USB girişleri',
      },
      {
        fa: 'پذیرایی گرم، نوشیدنی‌های سرد و گرم رایگان در طول سفر',
        en: 'Hot meals and free cold and hot drinks on board',
        tr: 'Yolculuk boyunca sıcak ikram ve ücretsiz soğuk-sıcak içecekler',
      },
      {
        fa: 'کادر رانندگان باسابقه بین‌المللی و مهمانداران دوزبانه مسلط',
        en: 'Experienced international drivers and fluent bilingual hosts',
        tr: 'Uluslararası deneyimli sürücüler ve iki dili akıcı konuşan hostesler',
      },
      {
        fa: 'بیمه کامل مسافرتی بین‌المللی در تمامی طول مسیر ترانزیت',
        en: 'Full international travel insurance along the entire transit route',
        tr: 'Tüm transit güzergâh boyunca tam kapsamlı uluslararası seyahat sigortası',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'انتخاب تاریخ و رزرو صندلی',
          en: 'Choose a date and reserve your seat',
          tr: 'Tarih seçimi ve koltuk rezervasyonu',
        },
        description: {
          fa: 'مشخص کردن تاریخ رفت یا برگشت و رزرو آنلاین یا تلفنی صندلی مورد نظر در چیدمان VIP.',
          en: 'Pick your outbound or return date and book your seat in the VIP layout online or by phone.',
          tr: 'Gidiş veya dönüş tarihinizi belirleyin, VIP düzendeki koltuğunuzu online ya da telefonla ayırtın.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'صدور بلیت الکترونیک بین‌المللی',
          en: 'Your international e-ticket is issued',
          tr: 'Uluslararası e-biletin düzenlenmesi',
        },
        description: {
          fa: 'دریافت تاییدیه رسمی بلیت با کد رهگیری اختصاصی و مشخصات دقیق ساعت و سکوی حرکت.',
          en: 'Receive official ticket confirmation with your own tracking code and the exact departure time and platform.',
          tr: 'Size özel takip kodu ve kesin kalkış saati ile peron bilgisini içeren resmi bilet onayınızı alın.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'پذیرش مسافر و چمدان در پایانه',
          en: 'Check-in and luggage at the terminal',
          tr: 'Terminalde yolcu ve bagaj kabulü',
        },
        description: {
          fa: 'حضور در ترمینال ۱ ساعت قبل از حرکت، تحویل بار و تگ‌گذاری امن چمدان‌ها توسط مهماندار.',
          en: 'Arrive at the terminal one hour before departure; the host takes your luggage and tags it securely.',
          tr: 'Kalkıştan 1 saat önce terminalde olun; bagajınız hostes tarafından teslim alınıp güvenle etiketlenir.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'تشریفات سریع مرزی و ورود به مقصد',
          en: 'Quick border formalities and arrival',
          tr: 'Hızlı sınır işlemleri ve varış',
        },
        description: {
          fa: 'همراهی سرپرست کاروان در گیت‌های گذرنامه مرز بازرگان و حرکت مستقیم به سمت استانبول.',
          en: 'The tour leader accompanies you through passport control at the Bazargan border, then the coach heads straight for Istanbul.',
          tr: 'Kafile sorumlusu Bazargan sınırındaki pasaport kontrolünde size eşlik eder, ardından doğrudan İstanbul\'a hareket edilir.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'میزان بار مجاز برای هر مسافر در سفر چقدر است؟',
          en: 'What is the baggage allowance per passenger?',
          tr: 'Yolcu başına bagaj hakkı ne kadar?',
        },
        answer: {
          fa: 'هر مسافر مجاز به همراه داشتن یک چمدان استاندارد تا ۳۰ کیلوگرم در صندوق اتوبوس و یک ساک دستی کوچک تا ۷ کیلوگرم در داخل کابین است.',
          en: 'Each passenger may bring one standard suitcase of up to 30 kg in the hold and one small hand bag of up to 7 kg in the cabin.',
          tr: 'Her yolcu bagaj bölmesinde 30 kg\'a kadar bir standart valiz ve kabinde 7 kg\'a kadar küçük bir el çantası taşıyabilir.',
        },
      },
      {
        question: {
          fa: 'مدت زمان تقریبی سفر از تهران به استانبول چقدر است؟',
          en: 'How long does the journey from Tehran to Istanbul take?',
          tr: 'Tahran – İstanbul yolculuğu yaklaşık ne kadar sürer?',
        },
        answer: {
          fa: 'مدت زمان معمول سفر با در نظر گرفتن توقف‌های رفاهی و تشریفات گمرکی مرزی بین ۳۰ الی ۳۴ ساعت است.',
          en: 'Including rest stops and border customs formalities, the journey usually takes 30 to 34 hours.',
          tr: 'Dinlenme molaları ve sınır gümrük işlemleri dahil yolculuk genellikle 30 ila 34 saat sürer.',
        },
      },
      {
        question: {
          fa: 'آیا برای مسافران اینترنت وای‌فای در ترکیه فعال است؟',
          en: 'Is there Wi-Fi for passengers in Turkey?',
          tr: 'Türkiye\'de yolcular için Wi-Fi var mı?',
        },
        answer: {
          fa: 'بله، اتوبوس‌های VIP گیتی پیما مجهز به مودم‌های سلولار بین‌المللی هستند که به محض ورود به خاک ترکیه اینترنت پرسرعت را در اختیار مسافران قرار می‌دهند.',
          en: 'Yes. GITI Peyma VIP coaches carry international cellular modems that give passengers high-speed internet as soon as they enter Turkey.',
          tr: 'Evet. GITI Peyma VIP otobüslerinde uluslararası hücresel modemler bulunur; Türkiye\'ye girer girmez yolculara yüksek hızlı internet sağlanır.',
        },
      },
    ],
    image: '/images/services/bus-vip-tehran-istanbul.webp',
    badge: {
      fa: 'سرویس ویژه روزانه',
      en: 'Daily premium service',
      tr: 'Günlük özel sefer',
    },
    highlight: true,
  },
  {
    id: 'service-2',
    slug: 'cargo-express-postal',
    title: {
      fa: 'ارسال بار و خدمات پستی اکسپرس',
      en: 'Express Parcel and Postal Services',
      tr: 'Ekspres Kargo ve Posta Hizmetleri',
    },
    shortTitle: {
      fa: 'ارسال بار و پست بین‌الملل',
      en: 'International Parcels and Post',
      tr: 'Uluslararası Kargo ve Posta',
    },
    category: 'cargo',
    categoryLabel: {
      fa: 'پست و کارگو',
      en: 'Post and cargo',
      tr: 'Posta ve kargo',
    },
    eyebrow: {
      fa: 'سریع‌ترین پل ارتباطی پستی میان ایران و ترکیه',
      en: 'The fastest postal link between Iran and Turkey',
      tr: 'İran ile Türkiye arasındaki en hızlı posta köprüsü',
    },
    summary: {
      fa: 'ارسال بار و ارائه خدمات تخصصی پست از ایران به ترکیه و بالعکس، با راهکارهای متناسب با نیاز مشتریان.',
      en: 'Parcel shipping and specialist postal services from Iran to Turkey and back, with solutions tailored to each customer.',
      tr: 'İran\'dan Türkiye\'ye ve Türkiye\'den İran\'a kargo gönderimi ve müşteri ihtiyacına uygun uzman posta hizmetleri.',
    },
    description: {
      fa: 'اگر قصد ارسال مدارک فوری، بسته‌های شخصی، پوشاک یا نمونه‌های تجاری سبک بین شهرهای ایران و تمامی استان‌های ترکیه را دارید، سرویس پستی اختصاصی گیتی پیما با بسته‌بندی مکانیزه و رهگیری لحظه‌ای مرسوله بهترین گزینه شماست.',
      en: 'Whether you need to send urgent documents, personal parcels, clothing or light trade samples between cities in Iran and any province of Turkey, GITI Peyma’s dedicated postal service, with machine packing and live parcel tracking, is your best option.',
      tr: 'İran şehirleri ile Türkiye\'nin tüm illeri arasında acil evrak, kişisel paket, giyim veya hafif ticari numune göndermek istiyorsanız, makineli paketleme ve anlık gönderi takibi sunan GITI Peyma posta hizmeti en iyi seçeneğinizdir.',
    },
    detailedContent: [
      {
        fa: 'خدمات پستی گیتی پیما با همکاری دفاتر هماهنگی در تهران، تبریز و استانبول انجام می‌شود. بسته‌های پستی بر اساس زمان‌بندی دقیق و استانداردهای پستی بین‌المللی بارگیری و توزیع می‌گردند.',
        en: 'GITI Peyma’s postal services run through our coordination offices in Tehran, Tabriz and Istanbul. Parcels are loaded and delivered on a precise schedule and to international postal standards.',
        tr: 'GITI Peyma posta hizmetleri Tahran, Tebriz ve İstanbul\'daki koordinasyon ofislerimizle yürütülür. Paketler hassas bir zaman planına ve uluslararası posta standartlarına göre yüklenir ve dağıtılır.',
      },
      {
        fa: 'ما امکان تحویل درب به درب (Door to Door) را در استانبول، آنکارا، ازمیر، آنتالیا و کلان‌شهرهای ایران فراهم کرده‌ایم تا بدون نیاز به مراجعه حضوری، محموله خود را ارسال یا دریافت فرمایید.',
        en: 'We offer door-to-door delivery in Istanbul, Ankara, Izmir, Antalya and Iran’s major cities, so you can send or receive a shipment without visiting an office.',
        tr: 'İstanbul, Ankara, İzmir, Antalya ve İran\'ın büyük şehirlerinde kapıdan kapıya teslimat sunuyoruz; böylece ofise gitmeden gönderinizi yollayabilir ya da teslim alabilirsiniz.',
      },
    ],
    features: [
      {
        fa: 'تحویل درب به درب (Door to Door) در ایران و تمامی شهرهای ترکیه',
        en: 'Door-to-door delivery in Iran and every city in Turkey',
        tr: 'İran\'da ve Türkiye\'nin tüm şehirlerinde kapıdan kapıya teslimat',
      },
      {
        fa: 'بسته‌بندی ضربه‌گیر ۵ لایه و پلمپ ضد سرقت استاندارد',
        en: 'Five-layer shock-absorbing packaging and standard tamper-proof seals',
        tr: '5 katlı darbe emici ambalaj ve standart hırsızlığa karşı mühür',
      },
      {
        fa: 'کد رهگیری آنلاین مرسوله از زمان تحویل تا مقصد نهایی',
        en: 'Online tracking code from drop-off to final destination',
        tr: 'Teslimden varış noktasına kadar online gönderi takip kodu',
      },
      {
        fa: 'بیمه کامل ارزش اعلام‌شده کالا در برابر آسیب و مفقودی',
        en: 'Full insurance of the declared value against damage and loss',
        tr: 'Beyan edilen değerin hasar ve kayba karşı tam sigortası',
      },
      {
        fa: 'زمان تحویل سریع بین ۳ الی ۵ روز کاری',
        en: 'Fast delivery in 3 to 5 working days',
        tr: '3 ila 5 iş günü içinde hızlı teslimat',
      },
      {
        fa: 'تعرفه‌های شفاف و منصفانه بدون هزینه‌های پنهان مرزی',
        en: 'Clear, fair rates with no hidden border charges',
        tr: 'Gizli sınır masrafı olmayan şeffaf ve adil ücretler',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'ثبت درخواست و توزین بسته',
          en: 'Request and weigh your parcel',
          tr: 'Talep oluşturma ve tartım',
        },
        description: {
          fa: 'تحویل مرسوله به دفاتر گیتی پیما یا هماهنگی پیک جهت دریافت مرسوله از محل شما.',
          en: 'Drop your parcel at a GITI Peyma office or book a courier to collect it from you.',
          tr: 'Gönderinizi GITI Peyma ofislerine teslim edin ya da adresinizden alınması için kurye ayarlayın.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'بسته‌بندی استاندارد و صدور بارنامه',
          en: 'Standard packing and waybill',
          tr: 'Standart paketleme ve irsaliye',
        },
        description: {
          fa: 'ایمن‌سازی کالا، صدور قبض رسمی با کد رهگیری اختصاصی و ثبت در سامانه ترانزیت.',
          en: 'Your goods are secured, an official receipt with a dedicated tracking code is issued and the shipment is registered in the transit system.',
          tr: 'Ürününüz güvenle paketlenir, özel takip kodlu resmi makbuz düzenlenir ve transit sistemine kaydedilir.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'حمل هوایی یا زمینی اکسپرس',
          en: 'Express air or road transport',
          tr: 'Ekspres hava veya kara taşımacılığı',
        },
        description: {
          fa: 'انتقال سریع از طریق خطوط اختصاصی گیتی پیما و عبور از خطوط بازرسی پستی گمرک.',
          en: 'Fast transfer on GITI Peyma’s dedicated lines and through customs postal inspection.',
          tr: 'GITI Peyma\'nın özel hatlarıyla hızlı aktarım ve gümrük posta denetiminden geçiş.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'تحویل نهایی به گیرنده',
          en: 'Final delivery to the recipient',
          tr: 'Alıcıya son teslimat',
        },
        description: {
          fa: 'تحویل محموله در آدرس مقصد با دریافت امضای دیجیتال و ارسال پیامک تایید به فرستنده.',
          en: 'Delivery at the destination address with a digital signature and a confirmation text message to the sender.',
          tr: 'Varış adresinde dijital imza ile teslim ve göndericiye onay SMS’i.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'ارسال چه کالاهایی از طریق پست ممنوع است؟',
          en: 'Which items cannot be sent by post?',
          tr: 'Hangi ürünlerin posta ile gönderilmesi yasaktır?',
        },
        answer: {
          fa: 'ارسال مایعات آتش‌زا، مواد فاسدشدنی، اقلام بدون فاکتور گمرکی خاص، طلا و مسکوکات قیمتی خارج از سقف قانونی از طریق پست اکسپرس مجاز نمی‌باشد.',
          en: 'Flammable liquids, perishables, items lacking the required customs invoice, and gold or precious coins above the legal limit cannot be sent by express post.',
          tr: 'Yanıcı sıvılar, bozulabilir gıdalar, gerekli gümrük faturası olmayan ürünler ile yasal sınırın üzerindeki altın ve değerli sikkeler ekspres posta ile gönderilemez.',
        },
      },
      {
        question: {
          fa: 'چگونه می‌توانم موقعیت بسته پستی خود را پیگیری کنم؟',
          en: 'How can I track my parcel?',
          tr: 'Paketimin nerede olduğunu nasıl takip edebilirim?',
        },
        answer: {
          fa: 'با وارد کردن کد رهگیری ۱۰ رقمی درج‌شده روی بارنامه در سامانه پیگیری گیتی پیما می‌توانید موقعیت لحظه‌ای مرسوله را مشاهده فرمایید.',
          en: 'Enter the 10-digit tracking code printed on your waybill in the GITI Peyma tracking system to see where your parcel is at any moment.',
          tr: 'İrsaliyenizdeki 10 haneli takip kodunu GITI Peyma takip sistemine girerek gönderinizin anlık konumunu görebilirsiniz.',
        },
      },
    ],
    image: '/images/services/cargo-express-postal.webp',
    badge: {
      fa: 'اکسپرس ۳ تا ۵ روزه',
      en: 'Express in 3 to 5 days',
      tr: '3–5 günde ekspres',
    },
    highlight: true,
  },
  {
    id: 'service-3',
    slug: 'cargo-customs-clearance',
    title: {
      fa: 'کارگو تجاری و ترخیص کالا',
      en: 'Commercial Cargo and Customs Clearance',
      tr: 'Ticari Kargo ve Gümrük İşlemleri',
    },
    shortTitle: {
      fa: 'کارگو و ترخیص رسمی کالا',
      en: 'Cargo and Official Customs Clearance',
      tr: 'Kargo ve Resmi Gümrükleme',
    },
    category: 'cargo',
    categoryLabel: {
      fa: 'تجارت و لجستیک',
      en: 'Trade and logistics',
      tr: 'Ticaret ve lojistik',
    },
    eyebrow: {
      fa: 'راهکار جامع واردات و صادرات با مجوزهای رسمی',
      en: 'A complete import and export solution with official licences',
      tr: 'Resmi izinlerle eksiksiz ithalat ve ihracat çözümü',
    },
    summary: {
      fa: 'ارسال بار تجاری و انجام تشریفات ترخیص رسمی کالا از گمرکات رسمی بین ایران، ترکیه و ترانزیت اروپایی.',
      en: 'Commercial freight and official customs clearance through the customs offices of Iran and Turkey, with transit to Europe.',
      tr: 'İran ve Türkiye resmi gümrükleri üzerinden ticari yük taşımacılığı ve resmi gümrükleme, Avrupa\'ya transit dahil.',
    },
    description: {
      fa: 'برای بازرگانان، شرکت‌های تولیدی و واردکنندگان، ترخیص به‌موقع و ایمن کالا حیاتی است. گیتی پیما با تیمی از حق‌العمل‌کاران و ترخیص‌کاران رسمی در گمرکات بازرگان، غرب تهران، سهلان و گمرکات ترکیه، فرآیند ترخیص کالا را در کمترین زمان و با کمترین هزینه عملیاتی محقق می‌سازد.',
      en: 'For traders, manufacturers and importers, clearing goods on time and safely is vital. With a team of licensed customs brokers at Bazargan, West Tehran and Sahlan customs and at Turkish customs, GITI Peyma clears your goods in the shortest time and at the lowest operating cost.',
      tr: 'Tüccarlar, üreticiler ve ithalatçılar için malların zamanında ve güvenle gümrükten çekilmesi hayati önem taşır. GITI Peyma, Bazargan, Batı Tahran, Sahlan ve Türkiye gümrüklerindeki lisanslı gümrük müşavirlerinden oluşan ekibiyle gümrükleme sürecini en kısa sürede ve en düşük operasyon maliyetiyle tamamlar.',
    },
    detailedContent: [
      {
        fa: 'مدیریت بارهای تجاری کانتینری و خرده‌بار (LCL و FCL) با رعایت کامل کنوانسیون‌های CMR و TIR Carnet.',
        en: 'Handling of containerised and groupage commercial cargo (LCL and FCL) in full compliance with the CMR and TIR Carnet conventions.',
        tr: 'CMR ve TIR Karnesi sözleşmelerine tam uyumla konteyner ve parsiyel (LCL ve FCL) ticari yük yönetimi.',
      },
      {
        fa: 'محاسبه دقیق عوارض و سود بازرگانی، تعیین تعرفه گمرکی HS Code، اخذ مجوزهای استاندارد و بهداشت، و ترانزیت مستقیم کالا تا انبار مشتری در سراسر کشور.',
        en: 'Precise calculation of duties and commercial fees, HS Code tariff classification, standards and health permits, and direct transit of goods to the customer’s warehouse anywhere in the country.',
        tr: 'Gümrük vergisi ve ticari harçların hassas hesabı, GTİP (HS Code) tarife tespiti, standart ve sağlık izinleri ile malların ülke genelinde müşteri deposuna doğrudan transiti.',
      },
    ],
    features: [
      {
        fa: 'صدور بارنامه بین‌المللی CMR و پوشش بیمه‌ای کلوز A بین‌المللی',
        en: 'International CMR waybill and Institute Cargo Clauses (A) insurance cover',
        tr: 'Uluslararası CMR taşıma senedi ve A tipi enstitü kloz sigorta teminatı',
      },
      {
        fa: 'ترخیص قطعی کالا در گمرکات تهران، بازرگان، جلفا، مرادپاشا و هالکالی استانبول',
        en: 'Final clearance at Tehran, Bazargan, Jolfa, Murat Paşa and Halkalı (Istanbul) customs',
        tr: 'Tahran, Bazargan, Culfa, Murat Paşa ve İstanbul Halkalı gümrüklerinde kesin gümrükleme',
      },
      {
        fa: 'ارائه خدمات انبارداری اختصاصی، بسته‌بندی پالت و انبارش کالا در استانبول',
        en: 'Dedicated warehousing, palletising and storage in Istanbul',
        tr: 'İstanbul\'da özel depolama, paletleme ve stoklama hizmetleri',
      },
      {
        fa: 'مشاوره تخصصی تعیین تعرفه کالا (HS Code) جهت کاهش هزینه‌های گمرکی',
        en: 'Expert HS Code tariff classification to lower customs costs',
        tr: 'Gümrük masraflarını düşürmek için uzman GTİP (HS Code) danışmanlığı',
      },
      {
        fa: 'حمل تخصصی قطعات صنعتی، مواد اولیه، منسوجات و لوازم یدکی',
        en: 'Specialist transport of industrial parts, raw materials, textiles and spare parts',
        tr: 'Endüstriyel parça, hammadde, tekstil ve yedek parçanın uzman taşımacılığı',
      },
      {
        fa: 'پشتیبانی ارزی و ترانزیت مالی مستقیم فاکتورهای تجاری Proforma',
        en: 'Currency support and direct settlement of proforma trade invoices',
        tr: 'Döviz desteği ve proforma ticari faturaların doğrudan ödemesi',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'بررسی اسناد حمل و پروفرما',
          en: 'Review of shipping documents and proforma',
          tr: 'Taşıma belgeleri ve proforma incelemesi',
        },
        description: {
          fa: 'آنالیز اسناد خرید (Packing List, Invoice) و انطباق با قوانین گمرکی مبدا و مقصد.',
          en: 'Analysis of your purchase documents (packing list, invoice) and their compliance with customs rules at origin and destination.',
          tr: 'Satın alma belgelerinizin (çeki listesi, fatura) incelenmesi ve çıkış-varış gümrük kurallarına uygunluğu.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'بارگیری و تشریفات خروج گمرکی',
          en: 'Loading and export customs formalities',
          tr: 'Yükleme ve ihracat gümrük işlemleri',
        },
        description: {
          fa: 'بارگیری در کانتینرهای ایمن، پلمپ رسمی گمرکی و صدور اسناد بین‌المللی ترانزیت.',
          en: 'Loading into secure containers, official customs sealing and issue of international transit documents.',
          tr: 'Güvenli konteynerlere yükleme, resmi gümrük mühürü ve uluslararası transit belgelerinin düzenlenmesi.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'ارزیابی و اخذ مجوزهای ترخیص',
          en: 'Inspection and clearance permits',
          tr: 'Muayene ve gümrükleme izinleri',
        },
        description: {
          fa: 'انجام اظهارنامه گمرکی در سامانه EPL و اخذ تاییدیه‌های استاندارد و قرنطینه.',
          en: 'Filing the customs declaration in the EPL system and obtaining standards and quarantine approvals.',
          tr: 'Gümrük beyannamesinin EPL sistemine girilmesi, standart ve karantina onaylarının alınması.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'خروج کالا و تحویل در انبار',
          en: 'Release and warehouse delivery',
          tr: 'Malın çıkışı ve depoya teslim',
        },
        description: {
          fa: 'تسویه حساب نهایی، خروج محموله از درب خروج گمرک و بارگیری به انبار مقصد.',
          en: 'Final settlement, release of the shipment through the customs gate and delivery to the destination warehouse.',
          tr: 'Son hesap kapanışı, gönderinin gümrük kapısından çıkışı ve varış deposuna yüklenmesi.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'تفاوت بار خرده‌بار (گروپاژ) با کانتینر دربست چیست؟',
          en: 'What is the difference between groupage and a full container?',
          tr: 'Parsiyel yük ile komple konteyner arasındaki fark nedir?',
        },
        answer: {
          fa: 'در روش گروپاژ بارهای چند بازرگان در یک کامیون ترانزیت تجمیع می‌شوند که هزینه حمل را برای تناژهای پایین به‌شدت کاهش می‌دهد.',
          en: 'With groupage, goods from several traders are consolidated in one transit truck, which greatly lowers the cost of shipping small tonnages.',
          tr: 'Parsiyel yöntemde birkaç tüccarın yükü tek bir transit kamyonda birleştirilir; bu da düşük tonajlarda taşıma maliyetini büyük ölçüde azaltır.',
        },
      },
    ],
    image: '/images/services/cargo-customs-clearance.webp',
    badge: {
      fa: 'ترخیص رسمی گمرکی',
      en: 'Official customs clearance',
      tr: 'Resmi gümrükleme',
    },
    highlight: true,
  },
  {
    id: 'service-4',
    slug: 'company-registration',
    title: {
      fa: 'ثبت شرکت بین‌المللی در ترکیه و حوزه اروپا',
      en: 'International Company Registration in Turkey and Europe',
      tr: 'Türkiye ve Avrupa\'da Uluslararası Şirket Kuruluşu',
    },
    shortTitle: {
      fa: 'ثبت شرکت بین‌المللی',
      en: 'International Company Registration',
      tr: 'Uluslararası Şirket Kuruluşu',
    },
    category: 'business',
    categoryLabel: {
      fa: 'امور شرکتی و تجاری',
      en: 'Corporate and trade',
      tr: 'Kurumsal ve ticari işler',
    },
    eyebrow: {
      fa: 'گسترش تجارت فرامرزی با شخصیت حقوقی مستقل',
      en: 'Grow your cross-border trade with an independent legal entity',
      tr: 'Bağımsız tüzel kişilikle sınır ötesi ticaretinizi büyütün',
    },
    summary: {
      fa: 'ارائه خدمات ثبت شرکت با مسئولیت محدود و نامحدود در چارچوب قوانین کشور مقصد.',
      en: 'Registration of limited and unlimited liability companies under the laws of the destination country.',
      tr: 'Hedef ülke mevzuatı çerçevesinde limited ve sınırsız sorumlu şirket kuruluş hizmetleri.',
    },
    description: {
      fa: 'افتتاح شرکت در ترکیه پلی استوار برای ورود به بازارهای جهانی، افتتاح حساب‌های بانکی سوئیفت‌دار بین‌المللی و تجارت بدون تحریم است. تیم وکلای تجاری گیتی پیما صفر تا صد مراحل ثبت شرکت با مسئولیت محدود (Limited Şirket) را با رعایت تمامی موازین قانونی کشور ترکیه پیگیری می‌نمایند.',
      en: 'A company in Turkey is a solid bridge into global markets, international bank accounts with SWIFT, and trade free of sanctions. GITI Peyma’s commercial lawyers handle every step of registering a limited company (Limited Şirket) in full compliance with Turkish law.',
      tr: 'Türkiye\'de şirket kurmak; küresel pazarlara, SWIFT\'li uluslararası banka hesaplarına ve yaptırımsız ticarete açılan sağlam bir köprüdür. GITI Peyma\'nın ticaret hukuku avukatları, limited şirket kuruluşunun tüm aşamalarını Türk mevzuatına tam uyumla takip eder.',
    },
    detailedContent: [
      {
        fa: 'فرآیند ثبت شرکت شامل تنظیم اساسنامه رسمی در سیستم مرسیس (MERSİS)، اخذ کد مالیاتی اولیه، تایید امضا در دفاتر اسناد رسمی (Noter)، ثبت در روزنامه رسمی بازرگانی ترکیه (Ticaret Sicil Gazetesi) و بازرسی محل دفتر توسط مامور اداره مالیات (Yoklama) است.',
        en: 'Registration covers drafting the official articles of association in the MERSİS system, obtaining the initial tax number, signature approval at a notary (Noter), publication in the Turkish Trade Registry Gazette (Ticaret Sicil Gazetesi) and the tax office’s inspection of the office address (Yoklama).',
        tr: 'Kuruluş süreci; MERSİS sisteminde ana sözleşmenin hazırlanması, ilk vergi numarasının alınması, noterde imza onayı, Ticaret Sicil Gazetesi\'nde ilan ve vergi dairesinin adres yoklamasını kapsar.',
      },
      {
        fa: 'گیتی پیما همچنین خدمات ارائه دفتر مجازی (Virtual Office) استاندارد، معرفی حسابدار رسمی تاییدشده (Mali Müşavir) و دریافت کارت بازرگانی بین‌المللی را پشتیبانی می‌کند.',
        en: 'GITI Peyma also provides a standard virtual office, referral to a certified accountant (Mali Müşavir) and support in obtaining an international trade card.',
        tr: 'GITI Peyma ayrıca standart sanal ofis, onaylı mali müşavir yönlendirmesi ve uluslararası ticaret kartı alımında destek sunar.',
      },
    ],
    features: [
      {
        fa: 'ثبت قانونی شرکت در کمتر از ۷ الی ۱۰ روز کاری',
        en: 'Legal registration of your company in 7 to 10 working days',
        tr: 'Şirketinizin 7 ila 10 iş günü içinde yasal kuruluşu',
      },
      {
        fa: 'امکان مالکیت ۱۰۰٪ سهام توسط اتباع خارجی بدون نیاز به شریک محلی',
        en: '100% foreign ownership with no need for a local partner',
        tr: 'Yerli ortak gerekmeden yabancı uyruklulara %100 hisse sahipliği',
      },
      {
        fa: 'افتتاح حساب بانکی بین‌المللی شرکتی در زراعت بانک یا ایش بانک',
        en: 'Corporate international bank account at Ziraat Bankası or İş Bankası',
        tr: 'Ziraat Bankası veya İş Bankası’nda kurumsal uluslararası banka hesabı',
      },
      {
        fa: 'فراهم‌سازی آدرس اداری معتبر و دفاتر مجازی قانونی در استانبول',
        en: 'A valid business address and legal virtual office in Istanbul',
        tr: 'İstanbul\'da geçerli iş adresi ve yasal sanal ofis',
      },
      {
        fa: 'معرفی مشاور مالی و حسابدار رسمی ترک زبان و فارسی‌زبان',
        en: 'Referral to a Turkish- and Persian-speaking financial adviser and certified accountant',
        tr: 'Türkçe ve Farsça konuşan mali danışman ve mali müşavir yönlendirmesi',
      },
      {
        fa: 'آماده‌سازی بستر اخذ اقامت کاری (Çalışma İzni) برای مدیرعامل',
        en: 'Groundwork for the managing director’s work permit (Çalışma İzni)',
        tr: 'Şirket müdürü için çalışma izni altyapısının hazırlanması',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'مشاوره اولیه و انتخاب موضوع فعالیت',
          en: 'Initial consultation and business activity',
          tr: 'İlk danışmanlık ve faaliyet konusu',
        },
        description: {
          fa: 'تعیین نام شرکت، سرمایه اولیه و تدوین حوزه‌های مجاز اساسنامه تجاری.',
          en: 'Choosing the company name and initial capital, and defining the permitted activities in the articles.',
          tr: 'Şirket adı ve başlangıç sermayesinin belirlenmesi, ana sözleşmedeki faaliyet alanlarının tanımlanması.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'ترجمه مدارک هویتی و ثبت در مرسیس',
          en: 'Translating ID documents and MERSİS registration',
          tr: 'Kimlik belgelerinin tercümesi ve MERSİS kaydı',
        },
        description: {
          fa: 'ترجمه رسمی پاسپورت موسسین، اخذ کد مالیاتی و رزرو نام شرکت در اتاق بازرگانی.',
          en: 'Official translation of the founders’ passports, obtaining a tax number and reserving the company name at the chamber of commerce.',
          tr: 'Kurucuların pasaportlarının resmi tercümesi, vergi numarası alınması ve ticaret odasında şirket adının ayrılması.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'تنظیم اساسنامه و امضا در نوتر',
          en: 'Articles of association signed at the notary',
          tr: 'Ana sözleşmenin noterde imzalanması',
        },
        description: {
          fa: 'حضور سهامداران در دفترخانه رسمی استانبول و امضای رسمی اساسنامه و بیانیه تاسیس.',
          en: 'Shareholders attend an official notary in Istanbul to sign the articles and founding declaration.',
          tr: 'Ortakların İstanbul\'da resmi notere giderek ana sözleşme ve kuruluş beyanını imzalaması.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'دریافت روزنامه رسمی و افتتاح حساب',
          en: 'Trade gazette and bank account',
          tr: 'Ticaret sicil gazetesi ve banka hesabı',
        },
        description: {
          fa: 'صدور برگه مالیاتی فعال (Vergi Levhası)، بازدید اداره مالیات و افتتاح حساب بانکی.',
          en: 'Issue of an active tax certificate (Vergi Levhası), the tax office visit and opening of the bank account.',
          tr: 'Aktif vergi levhasının düzenlenmesi, vergi dairesi yoklaması ve banka hesabının açılması.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'آیا برای ثبت شرکت نیاز به اجاره دفتر تجاری واقعی است؟',
          en: 'Do I need to rent a real commercial office to register a company?',
          tr: 'Şirket kurmak için gerçek bir ticari ofis kiralamam gerekir mi?',
        },
        answer: {
          fa: 'خیر، قوانین ترکیه اجازه استفاده از دفاتر مجازی قانونی و هم‌رسانی‌شده (Virtual Office) را برای شرکت‌های خدماتی و بازرگانی صادر کرده است.',
          en: 'No. Turkish law allows service and trading companies to use legal shared virtual offices.',
          tr: 'Hayır. Türk mevzuatı hizmet ve ticaret şirketlerinin yasal paylaşımlı sanal ofis kullanmasına izin verir.',
        },
      },
    ],
    image: '/images/services/company-registration.webp',
    badge: {
      fa: 'افتتاح حساب شرکتی',
      en: 'Corporate bank account',
      tr: 'Kurumsal banka hesabı',
    },
  },
  {
    id: 'service-5',
    slug: 'international-visa',
    title: {
      fa: 'مشاوره و اخذ ویزای بین‌المللی',
      en: 'International Visa Consulting and Applications',
      tr: 'Uluslararası Vize Danışmanlığı ve Başvurusu',
    },
    shortTitle: {
      fa: 'ویزای بین‌المللی (شنگن و کانادا)',
      en: 'International Visas (Schengen and Canada)',
      tr: 'Uluslararası Vize (Schengen ve Kanada)',
    },
    category: 'immigration',
    categoryLabel: {
      fa: 'خدمات کنسولی و اقامت',
      en: 'Consular and residency services',
      tr: 'Konsolosluk ve oturum hizmetleri',
    },
    eyebrow: {
      fa: 'همراهی تخصصی در آماده‌سازی مدارک و نوبت‌دهی سفارت',
      en: 'Expert help preparing your documents and booking embassy appointments',
      tr: 'Evrak hazırlığı ve konsolosluk randevusunda uzman destek',
    },
    summary: {
      fa: 'ارائه خدمات مشاوره و پیگیری درخواست ویزای شنگن، کانادا و آمریکا برای متقاضیان واجد شرایط.',
      en: 'Consulting and follow-up on Schengen, Canadian and US visa applications for eligible applicants.',
      tr: 'Şartları sağlayan başvuru sahipleri için Schengen, Kanada ve ABD vize başvurularında danışmanlık ve takip.',
    },
    description: {
      fa: 'درخواست ویزاهای توریستی، تجاری و تحصیلی کشورهای حوزه شنگن، بریتانیا و کانادا مستلزم تنظیم پرونده‌ای دقیق و بی‌نقص است. کارشناسان امور بین‌الملل گیتی پیما مدارک شغلی، مالی و سفری شما را بازبینی کرده و بهترین استراتژی ارائه به افسر ویزا را تدوین می‌کنند.',
      en: 'Tourist, business and student visas for the Schengen area, the UK and Canada call for a precise, flawless file. GITI Peyma’s international affairs specialists review your employment, financial and travel documents and plan the best way to present your case to the visa officer.',
      tr: 'Schengen bölgesi, Birleşik Krallık ve Kanada\'nın turistik, ticari ve öğrenci vizeleri eksiksiz ve titiz bir dosya gerektirir. GITI Peyma uluslararası işler uzmanları iş, mali ve seyahat belgelerinizi inceler ve dosyanızı vize memuruna sunmanın en iyi yolunu planlar.',
    },
    detailedContent: [
      {
        fa: 'خدمات شامل تنظیم Cover Letter اختصاصی، رزرو هتل و پرواز معتبر هماهنگ با تاریخ سفر، بیمه‌نامه مسافرتی شنگن با پوشش ۳۰,۰۰۰ یورو و اخذ وقت ملاقات فوری در کارگزاری‌های رسمی VFS Global, BLS International و کنسولگری‌ها است.',
        en: 'Our service includes a tailored cover letter, valid hotel and flight bookings matched to your travel dates, Schengen travel insurance with €30,000 cover, and fast appointments at official centres such as VFS Global and BLS International and at consulates.',
        tr: 'Hizmetimiz; size özel niyet mektubu, seyahat tarihlerinize uygun geçerli otel ve uçuş rezervasyonu, 30.000 € teminatlı Schengen seyahat sigortası ve VFS Global, BLS International gibi resmi merkezlerde ve konsolosluklarda hızlı randevuyu kapsar.',
      },
      {
        fa: 'مشاوره شبیه‌سازی مصاحبه سفارت و راهنمایی در خصوص اثبات تمکن مالی و علایق بازگشت به کشور از مؤلفه‌های کلیدی موفقیت پرونده‌های متقاضیان است.',
        en: 'Mock embassy interviews and guidance on proving your financial means and ties to your home country are key to a successful application.',
        tr: 'Konsolosluk mülakatı provası ile mali yeterlilik ve ülkeye dönüş bağlarının kanıtlanması konusundaki rehberlik, başarılı bir başvurunun temel unsurlarıdır.',
      },
    ],
    features: [
      {
        fa: 'بررسی دقیق مدارک هویتی، شغلی و تمکن بانکی پیش از ارسال',
        en: 'Careful review of identity, employment and bank documents before submission',
        tr: 'Başvuru öncesi kimlik, iş ve banka belgelerinin titizlikle incelenmesi',
      },
      {
        fa: 'نگارش حرفه‌ای معرفی‌نامه سفر (Cover Letter) و برنامه سفر (Itinerary)',
        en: 'Professionally written cover letter and itinerary',
        tr: 'Profesyonel niyet mektubu (cover letter) ve seyahat planı',
      },
      {
        fa: 'نوبت‌دهی وقت انگشت‌نگاری و مصاحبه در کارگزاری‌های بین‌المللی',
        en: 'Booking fingerprint and interview appointments at international visa centres',
        tr: 'Uluslararası vize merkezlerinde parmak izi ve mülakat randevusu',
      },
      {
        fa: 'رزرو بلیت رفت و برگشت و واچر هتل معتبر دارای کد رهگیری رزرو',
        en: 'Return flight and hotel voucher bookings with valid reservation codes',
        tr: 'Geçerli rezervasyon kodlu gidiş-dönüş bilet ve otel voucher’ı',
      },
      {
        fa: 'بیمه‌نامه مسافرتی بین‌المللی منطبق بر استانداردهای سفارتخانه‌ها',
        en: 'International travel insurance that meets embassy standards',
        tr: 'Konsolosluk standartlarına uygun uluslararası seyahat sigortası',
      },
      {
        fa: 'مشاوره آمادگی مصاحبه حضوری با شبیه‌سازی سوالات متداول',
        en: 'Interview preparation with practice of common questions',
        tr: 'Sık sorulan soruların provasıyla mülakat hazırlığı',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'ارزیابی صلاحیت پرونده متقاضی',
          en: 'Eligibility assessment',
          tr: 'Başvuru uygunluğunun değerlendirilmesi',
        },
        description: {
          fa: 'بررسی تاریخچه سفر (Travel History)، گردش حساب و مدارک شغلی توسط کارشناس.',
          en: 'A specialist reviews your travel history, bank statements and employment documents.',
          tr: 'Seyahat geçmişiniz, hesap hareketleriniz ve iş belgeleriniz uzman tarafından incelenir.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'ترجمه رسمی و تدوین مدارک تکمیلی',
          en: 'Official translation and supporting documents',
          tr: 'Resmi tercüme ve ek belgeler',
        },
        description: {
          fa: 'ترجمه رسمی با تاییدات لازم، رزرو بلیت و هتل و تنظیم انگیزه‌نامه اختصاصی.',
          en: 'Certified translations, flight and hotel bookings and a tailored motivation letter.',
          tr: 'Onaylı tercümeler, bilet ve otel rezervasyonu ile size özel motivasyon mektubu.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'اخذ نوبت سفارت و ثبت در پورتال',
          en: 'Embassy appointment and online portal',
          tr: 'Konsolosluk randevusu ve portal kaydı',
        },
        description: {
          fa: 'تکمیل فرم‌های رسمی آنلاین سفارت و دریافت تاریخ و ساعت انگشت‌نگاری.',
          en: 'Completing the embassy’s official online forms and getting your fingerprint appointment.',
          tr: 'Konsolosluğun resmi online formlarının doldurulması ve parmak izi randevusunun alınması.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'حضور در مرکز انگشت‌نگاری و پیگیری',
          en: 'Attending the visa centre and follow-up',
          tr: 'Vize merkezine gidiş ve takip',
        },
        description: {
          fa: 'راهنمایی در روز ملاقات و رصد مداوم وضعیت پرونده تا صدور روادید.',
          en: 'Guidance on the day of your appointment and close tracking of your file until the visa is issued.',
          tr: 'Randevu gününde rehberlik ve vize çıkana kadar dosyanızın yakından takibi.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'آیا صدور ویزا تضمینی است؟',
          en: 'Is the visa guaranteed?',
          tr: 'Vize garantili mi?',
        },
        answer: {
          fa: 'تصمیم‌گیری نهایی منحصراً در صلاحیت کنسولگری و افسر ویزا است؛ گیتی پیما بدون وعده‌های واهی تضمینی، پرونده شما را در استانداردترین حالت ممکن تنظیم می‌کند.',
          en: 'The final decision rests solely with the consulate and the visa officer. GITI Peyma makes no empty promises; we prepare your file to the highest possible standard.',
          tr: 'Nihai karar yalnızca konsolosluğa ve vize memuruna aittir. GITI Peyma boş garanti vaat etmez; dosyanızı mümkün olan en yüksek standartta hazırlar.',
        },
      },
    ],
    image: '/images/services/international-visa.webp',
    badge: {
      fa: 'مشاوره تخصصی پرونده',
      en: 'Expert file consulting',
      tr: 'Uzman dosya danışmanlığı',
    },
  },
  {
    id: 'service-6',
    slug: 'turkey-weddings',
    title: {
      fa: 'برگزاری مراسم ازدواج و تشریفات لوکس در ترکیه',
      en: 'Luxury Weddings and Events in Turkey',
      tr: 'Türkiye\'de Lüks Düğün ve Organizasyon',
    },
    shortTitle: {
      fa: 'برگزاری مراسم ازدواج در ترکیه',
      en: 'Weddings in Turkey',
      tr: 'Türkiye\'de Düğün Organizasyonu',
    },
    category: 'events',
    categoryLabel: {
      fa: 'تشریفات و رویدادهای لوکس',
      en: 'Luxury events and ceremonies',
      tr: 'Lüks organizasyon ve etkinlikler',
    },
    eyebrow: {
      fa: 'خلق خاطره‌انگیزترین روز زندگی در سواحل بسفر و عمارات تاریخی',
      en: 'The most memorable day of your life on the Bosphorus and in historic mansions',
      tr: 'Boğaz kıyısında ve tarihi konaklarda hayatınızın en unutulmaz günü',
    },
    summary: {
      fa: 'برنامه‌ریزی و ارائه خدمات برگزاری مراسم ازدواج و عروسی در کشور ترکیه.',
      en: 'Planning and running wedding ceremonies and receptions in Turkey.',
      tr: 'Türkiye\'de nikâh ve düğün törenlerinin planlanması ve düzenlenmesi.',
    },
    description: {
      fa: 'ترکیه با عمارات باشکوه عثمانی در حاشیه تنگه بسفر، کشتی‌های مجلل تفریحی و هتل‌های ۵ ستاره بین‌المللی، رویایی‌ترین مقصد برای برگزاری جشن‌های ازدواج است. تیم تشریفات اختصاصی گیتی پیما از طراحی دکور و گل‌آرایی ژورنالی تا پذیرایی و مدیریت مهمانان را بر عهده می‌گیرد.',
      en: 'With grand Ottoman mansions along the Bosphorus, luxury yachts and international five-star hotels, Turkey is a dream destination for weddings. GITI Peyma’s dedicated events team takes care of everything from décor and editorial-style floral design to catering and guest management.',
      tr: 'Boğaz kıyısındaki görkemli Osmanlı konakları, lüks yatları ve uluslararası beş yıldızlı otelleriyle Türkiye, düğünler için hayalinizdeki adrestir. GITI Peyma\'nın özel organizasyon ekibi; dekor ve editoryal çiçek tasarımından ikram ve misafir yönetimine kadar her şeyi üstlenir.',
    },
    detailedContent: [
      {
        fa: 'ما هماهنگی کامل با برترین باغ‌ها، کاخ‌های تاریخی و سالن‌های مجلل استانبول و آنتالیا را انجام می‌دهیم. خدمات صوتی و تصویری با دوربین‌های سینمایی، گروه ارکستر زنده، منوی شام چندمرحله‌ای بین‌المللی و ترانسفر VIP مهمانان در پکیج‌های تشریفاتی گنجانده شده است.',
        en: 'We coordinate with the finest gardens, historic palaces and luxury venues in Istanbul and Antalya. Cinema-grade photo and video, a live orchestra, a multi-course international dinner menu and VIP transfers for your guests are included in our event packages.',
        tr: 'İstanbul ve Antalya\'nın en seçkin bahçeleri, tarihi sarayları ve lüks salonlarıyla tam koordinasyon sağlıyoruz. Sinema kalitesinde fotoğraf ve video, canlı orkestra, çok aşamalı uluslararası akşam yemeği menüsü ve misafirler için VIP transfer paketlerimize dahildir.',
      },
      {
        fa: 'همچنین کلیه امور مربوط به هتلینگ و اقامت مهمانان با تخفیف‌های ویژه سازمانی برنامه‌ریزی می‌گردد.',
        en: 'Hotel bookings and accommodation for your guests are also arranged, with special corporate discounts.',
        tr: 'Misafirlerinizin otel ve konaklama işlemleri de özel kurumsal indirimlerle planlanır.',
      },
    ],
    features: [
      {
        fa: 'انتخاب لوکیشن‌های اختصاصی: کاخ‌های بسفر، کشتی‌های مجلل و باغ‌های لوکس',
        en: 'Exclusive venues: Bosphorus palaces, luxury yachts and elegant gardens',
        tr: 'Özel mekânlar: Boğaz sarayları, lüks yatlar ve seçkin bahçeler',
      },
      {
        fa: 'دیزاین و گل‌آرایی ژورنالی متناسب با تم اختصاصی عروس و داماد',
        en: 'Editorial-style décor and flowers designed around the couple’s own theme',
        tr: 'Çiftin temasına özel editoryal dekor ve çiçek tasarımı',
      },
      {
        fa: 'تیم فیلمبرداری و عکاسی حرفه‌ای با تجهیزات سینمایی و هلی‌شات',
        en: 'Professional photo and film crew with cinema equipment and aerial shots',
        tr: 'Sinema ekipmanı ve havadan çekimle profesyonel fotoğraf ve video ekibi',
      },
      {
        fa: 'منوی پذیرایی کترینگ بین‌المللی با سرآشپزهای مجرب و تست منو',
        en: 'International catering by experienced chefs, with a menu tasting',
        tr: 'Deneyimli şeflerle uluslararası catering ve menü tadımı',
      },
      {
        fa: 'موسیقی زنده، دی‌جی‌های بین‌المللی و سیستم نورپردازی هوشمند کنسرت',
        en: 'Live music, international DJs and smart concert lighting',
        tr: 'Canlı müzik, uluslararası DJ\'ler ve akıllı konser ışıklandırması',
      },
      {
        fa: 'هماهنگی ترانسفر VIP مهمانان از فرودگاه تا هتل و محل مراسم',
        en: 'VIP transfers for guests from the airport to the hotel and venue',
        tr: 'Misafirler için havalimanından otele ve tören alanına VIP transfer',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'جلسه نیازسنجی و انتخاب پکیج',
          en: 'Planning meeting and package choice',
          tr: 'İhtiyaç görüşmesi ve paket seçimi',
        },
        description: {
          fa: 'بررسی سلیقه، تعداد مهمانان، تاریخ مدنظر و انتخاب لوکیشن ایده‌آل در استانبول.',
          en: 'Your taste, guest count and preferred date, and choosing the ideal venue in Istanbul.',
          tr: 'Zevkiniz, misafir sayısı ve tercih ettiğiniz tarih; İstanbul\'da ideal mekânın seçimi.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'طراحی کانسپت و برنامه‌ریزی دکور',
          en: 'Concept and décor design',
          tr: 'Konsept ve dekor tasarımı',
        },
        description: {
          fa: 'تدوین جدول زمان‌بندی مراسم، طراحی استیج و انتخاب تم رنگی و گل‌آرایی.',
          en: 'The ceremony timeline, stage design and choice of colour theme and flowers.',
          tr: 'Tören zaman çizelgesi, sahne tasarımı ile renk teması ve çiçek seçimi.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'هماهنگی خدمات کترینگ و موسیقی',
          en: 'Catering and music',
          tr: 'Catering ve müzik koordinasyonu',
        },
        description: {
          fa: 'تست منوی غذا و شیرینی و تنظیم پلی‌لیست موسیقی و آیتم‌های سرگرمی.',
          en: 'Tasting the food and desserts, and setting the music playlist and entertainment.',
          tr: 'Yemek ve tatlı tadımı, müzik listesi ve eğlence programının belirlenmesi.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'اجرای باشکوه جشن با مدیریت میدانی',
          en: 'A flawless celebration, managed on site',
          tr: 'Sahada yönetilen kusursuz bir kutlama',
        },
        description: {
          fa: 'حضور مدیر تشریفات در تمام ساعات مراسم جهت تضمین اجرای بدون نقص برنامه‌ها.',
          en: 'Our events manager is present throughout to make sure every part of the programme runs perfectly.',
          tr: 'Organizasyon müdürümüz programın eksiksiz uygulanması için tören boyunca yanınızdadır.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'چند ماه قبل از مراسم باید برنامه‌ریزی را آغاز کرد؟',
          en: 'How many months ahead should we start planning?',
          tr: 'Planlamaya kaç ay önceden başlamalıyız?',
        },
        answer: {
          fa: 'بهترین زمان رزرو عمارت‌ها و سالن‌های ساحلی بسفر ۳ الی ۶ ماه پیش از تاریخ مراسم است تا دسترسی به بهترین لوکیشن‌ها تضمین شود.',
          en: 'The best time to book Bosphorus mansions and waterfront venues is 3 to 6 months before the date, to secure the best locations.',
          tr: 'Boğaz konakları ve sahil salonları için en uygun rezervasyon zamanı, en iyi mekânları garantilemek adına tarihten 3 ila 6 ay öncesidir.',
        },
      },
    ],
    image: '/images/services/turkey-weddings.webp',
    badge: {
      fa: 'لوکیشن‌های بسفر و آنتالیا',
      en: 'Bosphorus and Antalya venues',
      tr: 'Boğaz ve Antalya mekânları',
    },
  },
  {
    id: 'service-7',
    slug: 'legal-power-of-attorney',
    title: {
      fa: 'خدمات حقوقی و تنظیم وکالتنامه بین‌المللی',
      en: 'Legal Services and International Powers of Attorney',
      tr: 'Hukuki Hizmetler ve Uluslararası Vekâletname',
    },
    shortTitle: {
      fa: 'خدمات حقوقی و وکالتنامه',
      en: 'Legal Services and Power of Attorney',
      tr: 'Hukuki Hizmetler ve Vekâletname',
    },
    category: 'legal',
    categoryLabel: {
      fa: 'امور حقوقی و اسناد',
      en: 'Legal affairs and documents',
      tr: 'Hukuki işler ve belgeler',
    },
    eyebrow: {
      fa: 'تنظیم وکالتنامه‌های معتبر دوطرفه ایران و ترکیه با تاییدات رسمی',
      en: 'Valid powers of attorney between Iran and Turkey, with official approvals',
      tr: 'İran ve Türkiye arasında resmi onaylı geçerli vekâletnameler',
    },
    summary: {
      fa: 'تنظیم و ارائه خدمات وکالتنامه از ترکیه به ایران و بالعکس و پذیرش و پیگیری دعاوی حقوقی در ترکیه.',
      en: 'Powers of attorney from Turkey to Iran and from Iran to Turkey, and taking on and pursuing legal cases in Turkey.',
      tr: 'Türkiye\'den İran\'a ve İran\'dan Türkiye\'ye vekâletname düzenlenmesi; Türkiye\'de hukuki davaların kabulü ve takibi.',
    },
    description: {
      fa: 'انجام امور ملکی، بانکی، انحصار وراثت و اداری در ایران بدون سفر حضوری، با تنظیم وکالتنامه‌های رسمی در نوترهای ترکیه یا سرکنسولگری ایران در استانبول امکان‌پذیر است. وکلای مجرب همکار گیتی پیما متن وکالتنامه را با دقت حقوقی تنظیم کرده و در تمامی مراحل حضور خواهند داشت.',
      en: 'Property, banking, inheritance and administrative matters in Iran can be handled without travelling, with an official power of attorney drawn up at a Turkish notary or at the Consulate General of Iran in Istanbul. GITI Peyma’s experienced partner lawyers draft the document with legal precision and stay with you at every step.',
      tr: 'İran\'daki tapu, banka, veraset ve idari işlerinizi seyahat etmeden; Türkiye\'deki noterlerde veya İran\'ın İstanbul Başkonsolosluğu\'nda düzenlenen resmi vekâletnameyle halledebilirsiniz. GITI Peyma\'nın deneyimli iş ortağı avukatları metni hukuki titizlikle hazırlar ve her aşamada yanınızda olur.',
    },
    detailedContent: [
      {
        fa: 'خدمات شامل تنظیم وکالتنامه کاری، وکالت فروش و خرید ملک، وکالت طلاق و امور خانواده، و وکالت بانکی است. حضور مترجم رسمی معتمد دادگستری ترکیه در نوتر (Noter Yeminli Tercüman) برای متقاضیانی که به زبان ترکی مسلط نیستند الزامی است که توسط تیم ما فراهم می‌گردد.',
        en: 'We prepare general powers of attorney, powers to sell and buy property, divorce and family matters, and banking. A sworn court translator (Noter Yeminli Tercüman) must be present at the notary for applicants who do not speak Turkish, and our team arranges one.',
        tr: 'Genel vekâletname, gayrimenkul alım-satım, boşanma ve aile işleri ile banka vekâletnameleri düzenliyoruz. Türkçe bilmeyen başvuru sahipleri için noterde yeminli tercüman bulunması zorunludur ve ekibimiz bunu sağlar.',
      },
      {
        fa: 'همچنین پذیرش و دفاع از دعاوی ملکی، تجاری و دعاوی کیفری در محاکم دادگستری استانبول توسط وکلای پایه یک عضو کانون وکلای استانبول (İstanbul Barosu) صورت می‌پذیرد.',
        en: 'Property, commercial and criminal cases before the Istanbul courts are taken on and defended by senior lawyers who are members of the Istanbul Bar Association (İstanbul Barosu).',
        tr: 'İstanbul mahkemelerindeki gayrimenkul, ticari ve ceza davaları, İstanbul Barosu\'na kayıtlı kıdemli avukatlar tarafından üstlenilir ve savunulur.',
      },
    ],
    features: [
      {
        fa: 'تنظیم وکالتنامه در نوترهای ترکیه با آپوستیل بین‌المللی (Apostille)',
        en: 'Powers of attorney at Turkish notaries with an international Apostille',
        tr: 'Türkiye\'deki noterlerde uluslararası apostilli vekâletname',
      },
      {
        fa: 'همراهی مترجم رسمی همزمان قسم‌خورده نوتر برای اتباع غیرترک',
        en: 'A sworn notary interpreter for non-Turkish citizens',
        tr: 'Türk vatandaşı olmayanlar için noter yeminli tercümanı',
      },
      {
        fa: 'تنظیم و ثبت وکالتنامه در سامانه میخک کنسولگری ایران در استانبول',
        en: 'Drafting and registering powers of attorney in the Mikhak system of the Iranian consulate in Istanbul',
        tr: 'İran\'ın İstanbul konsolosluğundaki Mikhak sisteminde vekâletname düzenleme ve kaydı',
      },
      {
        fa: 'مشاوره حقوقی تخصصی در قراردادهای پیش‌فروش و خرید ملک در ترکیه',
        en: 'Expert legal advice on off-plan and property purchase contracts in Turkey',
        tr: 'Türkiye\'de topraktan satış ve gayrimenkul alım sözleşmelerinde uzman hukuki danışmanlık',
      },
      {
        fa: 'پیگیری دعاوی تجاری و وصول مطالبات بازرگانان در محاکم ترکیه',
        en: 'Pursuing commercial claims and debt recovery for traders in Turkish courts',
        tr: 'Türk mahkemelerinde tüccarlar için ticari dava ve alacak takibi',
      },
      {
        fa: 'استعلامات ثبتی و بررسی وضعیت سند ملکی (Tapu) پیش از معامله',
        en: 'Land registry checks on the title deed (Tapu) before a transaction',
        tr: 'İşlem öncesi tapu kaydı sorgusu ve tapu durumunun incelenmesi',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'تدوین پیش‌نویس حقوقی وکالتنامه',
          en: 'Legal draft of the power of attorney',
          tr: 'Vekâletnamenin hukuki taslağı',
        },
        description: {
          fa: 'تنظیم حدود اختیارات وکیل متناسب با نیاز اداری یا ملکی با بررسی وکیل پایه یک.',
          en: 'A senior lawyer defines the attorney’s powers to fit your administrative or property needs.',
          tr: 'Kıdemli bir avukat, vekilin yetkilerini idari veya gayrimenkul ihtiyacınıza göre belirler.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'ترجمه رسمی و تایید نوتر',
          en: 'Official translation and notary approval',
          tr: 'Resmi tercüme ve noter onayı',
        },
        description: {
          fa: 'هماهنگی نوبت در نوتر مرکزی، حضور متقاضی همراه با مترجم قسم‌خورده و امضا.',
          en: 'Booking the central notary, attending with a sworn translator and signing.',
          tr: 'Merkez noterden randevu, yeminli tercümanla birlikte noterde hazır bulunma ve imza.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'اخذ آپوستیل یا تاییدیه کنسولی',
          en: 'Apostille or consular approval',
          tr: 'Apostil veya konsolosluk onayı',
        },
        description: {
          fa: 'ثبت مهر آپوستیل در فرمانداری (Kaymakamlık) یا تایید سرکنسولگری جمهوری اسلامی.',
          en: 'The Apostille stamp at the district governorate (Kaymakamlık) or approval by the Iranian Consulate General.',
          tr: 'Kaymakamlıkta apostil şerhi ya da İran Başkonsolosluğu\'nun onayı.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'ارسال امن به مقصد',
          en: 'Secure delivery to the destination',
          tr: 'Varış noktasına güvenli gönderim',
        },
        description: {
          fa: 'ارسال اصل سند وکالتنامه از طریق پست اکسپرس گیتی پیما به دست وکیل در ایران.',
          en: 'The original document is sent by GITI Peyma express post to your attorney in Iran.',
          tr: 'Vekâletnamenin aslı GITI Peyma ekspres postasıyla İran\'daki vekilinize ulaştırılır.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'آیا وکالتنامه تنظیم شده در نوتر ترکیه در بانک‌ها و ادارات ایران معتبر است؟',
          en: 'Is a power of attorney from a Turkish notary valid at banks and offices in Iran?',
          tr: 'Türk noterinde düzenlenen vekâletname İran\'daki banka ve resmi dairelerde geçerli mi?',
        },
        answer: {
          fa: 'بله، پس از اخذ تاییدیه فرمانداری (آپوستیل) و مهر تایید سرکنسولگری ایران، وکالتنامه در تمامی مراجع قضایی و اداری ایران اعتبار رسمی و قانونی دارد.',
          en: 'Yes. Once it carries the governorate’s Apostille and the Iranian Consulate General’s stamp, it has full official and legal force before all judicial and administrative authorities in Iran.',
          tr: 'Evet. Kaymakamlık apostili ve İran Başkonsolosluğu onayı alındıktan sonra vekâletname İran\'daki tüm yargı ve idari mercilerde resmi ve yasal olarak geçerlidir.',
        },
      },
    ],
    image: '/images/services/legal-power-of-attorney.webp',
    badge: {
      fa: 'تاییدیه نوتر و آپوستیل',
      en: 'Notary and Apostille approval',
      tr: 'Noter ve apostil onayı',
    },
  },
  {
    id: 'service-8',
    slug: 'official-translation',
    title: {
      fa: 'ترجمه رسمی اسناد و مدارک بین‌المللی',
      en: 'Certified Translation of International Documents',
      tr: 'Uluslararası Belgelerin Yeminli Tercümesi',
    },
    shortTitle: {
      fa: 'ترجمه رسمی اسناد و مدارک',
      en: 'Certified Document Translation',
      tr: 'Yeminli Belge Tercümesi',
    },
    category: 'legal',
    categoryLabel: {
      fa: 'امور حقوقی و اسناد',
      en: 'Legal affairs and documents',
      tr: 'Hukuki işler ve belgeler',
    },
    eyebrow: {
      fa: 'ترجمه دقیق و فوری با تاییدات دادگستری، خارجه، نوتر و فرمانداری',
      en: 'Accurate, fast translation with judiciary, foreign ministry, notary and governorate approvals',
      tr: 'Adliye, dışişleri, noter ve kaymakamlık onaylı hızlı ve doğru tercüme',
    },
    summary: {
      fa: 'ارائه خدمات ترجمه رسمی اسناد و مدارک برای امور بین‌المللی.',
      en: 'Certified translation of documents for international purposes.',
      tr: 'Uluslararası işlemler için belgelerin yeminli tercüme hizmetleri.',
    },
    description: {
      fa: 'ترجمه دقیق اسناد هویتی، مدارک دانشگاهی، گزارش‌های مالی و قراردادهای بازرگانی پایه و اساس کلیه اقدامات اقامتی، تحصیلی و تجاری است. دارالترجمه رسمی همکار گیتی پیما با بهره‌گیری از مترجمان معتمد رسمی، بالاترین دقت و سریع‌ترین زمان تحویل را ارائه می‌نماید.',
      en: 'Accurate translation of identity documents, academic records, financial reports and commercial contracts underpins every residency, study and business application. GITI Peyma’s partner certified translation office works with sworn translators to deliver the highest accuracy and the fastest turnaround.',
      tr: 'Kimlik belgeleri, diplomalar, mali raporlar ve ticari sözleşmelerin doğru tercümesi tüm oturum, eğitim ve ticari başvuruların temelidir. GITI Peyma\'nın iş ortağı yeminli tercüme bürosu, yeminli tercümanlarla en yüksek doğruluğu ve en hızlı teslimatı sunar.',
    },
    detailedContent: [
      {
        fa: 'ترجمه مدارک به زبان‌های ترکی استانبولی، انگلیسی، آلمانی، فرانسوی و عربی انجام می‌شود. تمامی ترجمه‌ها مجهز به تمبر رسمی، بارکد اصالت سنجی و در صورت نیاز تاییدات وزارت دادگستری و وزارت امور خارجه ایران یا نوتر و کایماکاملیک ترکیه می‌باشند.',
        en: 'We translate into Turkish, English, German, French and Arabic. Every translation carries an official stamp and an authenticity barcode and, where needed, approval by Iran’s Ministry of Justice and Ministry of Foreign Affairs or by a Turkish notary and Kaymakamlık.',
        tr: 'Türkçe, İngilizce, Almanca, Fransızca ve Arapçaya tercüme yapıyoruz. Tüm tercümeler resmi mühür ve doğrulama barkodu taşır; gerektiğinde İran Adalet ve Dışişleri Bakanlıkları ya da Türkiye\'de noter ve kaymakamlık onayıyla teslim edilir.',
      },
      {
        fa: 'امکان ارسال تصویر مدارک جهت ارزیابی اولیه و دریافت ترجمه تاییدشده درب منزل در کوتاه‌ترین زمان ممکن.',
        en: 'Send photos of your documents for an initial assessment and receive the approved translation at your door as quickly as possible.',
        tr: 'Ön değerlendirme için belgelerinizin fotoğrafını gönderin, onaylı tercümenizi en kısa sürede kapınızda teslim alın.',
      },
    ],
    features: [
      {
        fa: 'ترجمه رسمی با تایید دادگستری و وزارت امور خارجه جمهوری اسلامی ایران',
        en: 'Certified translation approved by Iran’s judiciary and Ministry of Foreign Affairs',
        tr: 'İran yargısı ve Dışişleri Bakanlığı onaylı yeminli tercüme',
      },
      {
        fa: 'ترجمه رسمی ترکی استانبولی با تایید نوتر و فرمانداری استانبول',
        en: 'Certified Turkish translation approved by a notary and the Istanbul governorate',
        tr: 'Noter ve İstanbul Valiliği onaylı Türkçe yeminli tercüme',
      },
      {
        fa: 'ترجمه تخصصی قراردادهای تجاری، اظهارنامه‌های مالیاتی و اسناد گمرکی',
        en: 'Specialist translation of commercial contracts, tax returns and customs documents',
        tr: 'Ticari sözleşme, vergi beyannamesi ve gümrük belgelerinde uzman tercüme',
      },
      {
        fa: 'ترجمه فوری مدارک هویتی (شناسنامه، پاسپورت، کارت ملی) ظرف ۲۴ ساعت',
        en: 'Express translation of ID documents (birth certificate, passport, national ID) within 24 hours',
        tr: 'Kimlik belgelerinin (nüfus cüzdanı, pasaport, kimlik kartı) 24 saatte acil tercümesi',
      },
      {
        fa: 'تطبیق اصطلاحات حقوقی و نام‌های خاص مطابق با پاسپورت متقاضی',
        en: 'Legal terms and proper names matched to the applicant’s passport',
        tr: 'Hukuki terimler ve özel isimlerin başvuru sahibinin pasaportuna uygun yazımı',
      },
      {
        fa: 'امکان تحویل نسخه فیزیکی و فایل اسکن باکیفیت و بارکددار',
        en: 'Printed copy plus a high-quality barcoded scan',
        tr: 'Basılı nüsha ile yüksek kaliteli barkodlu tarama dosyası',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'ارسال مدارک و پیش‌فاکتور',
          en: 'Send your documents and get a quote',
          tr: 'Belgelerin gönderimi ve fiyat teklifi',
        },
        description: {
          fa: 'ارسال تصویر مدارک از طریق فرم یا پیام‌رسان و اعلام زمان تحویل و هزینه دقیق.',
          en: 'Send photos of your documents through the form or a messenger and we confirm the price and delivery time.',
          tr: 'Belgelerinizin fotoğrafını form veya mesajlaşma uygulamasıyla gönderin; kesin ücret ve teslim süresini bildirelim.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'ترجمه تخصصی توسط مترجم رسمی',
          en: 'Specialist translation by a sworn translator',
          tr: 'Yeminli tercüman tarafından uzman tercüme',
        },
        description: {
          fa: 'پیاده‌سازی دقیق متون توسط مترجم قسم‌خورده قوه قضاییه با رعایت استانداردهای فرمتی.',
          en: 'A sworn translator of the judiciary renders the text precisely, following format standards.',
          tr: 'Metin, format standartlarına uygun olarak yargı yeminli tercümanınca titizlikle aktarılır.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'اخذ تاییدات قانونی و نوتر',
          en: 'Legal and notary approvals',
          tr: 'Yasal ve noter onayları',
        },
        description: {
          fa: 'مراجعه نماینده به دادگستری، وزارت امور خارجه، نوتر یا سفارتخانه مربوطه.',
          en: 'Our representative visits the judiciary, the Ministry of Foreign Affairs, the notary or the relevant embassy.',
          tr: 'Temsilcimiz adliyeye, Dışişleri Bakanlığına, notere veya ilgili büyükelçiliğe başvurur.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'تحویل پلمپ ترجمه رسمی',
          en: 'Delivery of the sealed certified translation',
          tr: 'Mühürlü yeminli tercümenin teslimi',
        },
        description: {
          fa: 'تحویل حضوری یا ارسال پستی نسخه فیزیکی مهر و موم شده به نشانی متقاضی.',
          en: 'The sealed printed copy is handed over in person or posted to your address.',
          tr: 'Mühürlü basılı nüsha elden teslim edilir ya da adresinize postalanır.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'اعتبار ترجمه‌های رسمی چقدر است؟',
          en: 'How long are certified translations valid?',
          tr: 'Yeminli tercümeler ne kadar süre geçerlidir?',
        },
        answer: {
          fa: 'معمولاً ترجمه‌های مدارک هویتی تا ۶ ماه و مدارک تحصیلی و ریزنمرات به‌صورت دائمی تا زمان عدم تغییر متن معتبر هستند.',
          en: 'Translations of identity documents are usually valid for up to 6 months; academic records and transcripts stay valid as long as the text does not change.',
          tr: 'Kimlik belgelerinin tercümeleri genellikle 6 aya kadar geçerlidir; diploma ve not dökümleri ise metin değişmediği sürece geçerliliğini korur.',
        },
      },
    ],
    image: '/images/services/official-translation.webp',
    badge: {
      fa: 'تاییدات فوری ۲۴ ساعته',
      en: 'Express approvals in 24 hours',
      tr: '24 saatte acil onay',
    },
  },
  {
    id: 'service-9',
    slug: 'currency-exchange-swift',
    title: {
      fa: 'حواله و انتقال ارز و خدمات سوئیفت بین‌المللی',
      en: 'Currency Transfers and International SWIFT Services',
      tr: 'Döviz Transferi ve Uluslararası SWIFT Hizmetleri',
    },
    shortTitle: {
      fa: 'حواله ارزی و انتقال سوئیفت',
      en: 'Currency Transfers and SWIFT',
      tr: 'Döviz Transferi ve SWIFT',
    },
    category: 'financial',
    categoryLabel: {
      fa: 'امور ارزی و صرافی',
      en: 'Currency and exchange',
      tr: 'Döviz ve kambiyo',
    },
    eyebrow: {
      fa: 'تبدیل و انتقال امن وجوه ارزی با کمترین کارمزد و رسید معتبر',
      en: 'Safe currency exchange and transfer with low fees and a valid receipt',
      tr: 'Düşük komisyon ve geçerli makbuzla güvenli döviz çevirme ve transfer',
    },
    summary: {
      fa: 'تبدیل و انتقال حواله‌های ارزی از ایران به دبی، ترکیه و اروپا و بالعکس، همراه با خدمات ارسال سوئیفت بین‌المللی.',
      en: 'Exchange and transfer of funds from Iran to Dubai, Turkey and Europe and back, together with international SWIFT transfers.',
      tr: 'İran\'dan Dubai, Türkiye ve Avrupa\'ya ve tersi yönde döviz çevirme ve transferi, uluslararası SWIFT gönderimi ile birlikte.',
    },
    description: {
      fa: 'گیتی پیما بستری امن و بدون واسطه برای تسویه وجوه ارزی، پرداخت شهریه دانشگاه‌های خارجی، انتقال وجوه خرید ملک و حواله‌های بازرگانی فراهم آورده است. تبدیل ریال به لیر، دلار، یورو و درهم با نرخ‌های لحظه‌ای رقابتی و تحویل نقدی در دفاتر استانبول و دبی یا واریز مستقیم بانکی انجام می‌شود.',
      en: 'GITI Peyma offers a safe, direct way to settle foreign currency payments, pay tuition at universities abroad, transfer funds for property purchases and make commercial transfers. Rials are exchanged into lira, dollars, euros and dirhams at competitive live rates, with cash collection at our Istanbul and Dubai offices or direct bank deposit.',
      tr: 'GITI Peyma; döviz ödemelerinin kapatılması, yurt dışı üniversite harçlarının ödenmesi, gayrimenkul alımı için fon transferi ve ticari havaleler için aracısız ve güvenli bir altyapı sunar. Riyal; lira, dolar, avro ve dirheme rekabetçi anlık kurlarla çevrilir, İstanbul ve Dubai ofislerimizde nakit teslim edilir ya da doğrudan banka hesabına yatırılır.',
    },
    detailedContent: [
      {
        fa: 'انتقال حواله‌های سوئیفت به حساب‌های شرکتی و شخصی در اروپا، ترکیه و امارات همراه با ارائه مدرک رسمی منبع وجه (Source of Funds) جهت جلوگیری از مسدود شدن حساب‌های بانکی.',
        en: 'SWIFT transfers to corporate and personal accounts in Europe, Turkey and the UAE, with official source-of-funds documentation so your bank accounts are not blocked.',
        tr: 'Avrupa, Türkiye ve BAE\'deki kurumsal ve bireysel hesaplara, banka hesaplarınızın bloke olmaması için resmi fon kaynağı belgesiyle birlikte SWIFT transferi.',
      },
      {
        fa: 'تسویه سریع واریزهای شتابی در ایران و انتقال لیر به حساب‌های زراعت بانک، ایش بانک، واکیف بانک و گارانتی بی‌بی‌وی‌ای در کوتاه‌ترین زمان.',
        en: 'Fast settlement of Shetab deposits in Iran and transfer of lira to accounts at Ziraat Bankası, İş Bankası, VakıfBank and Garanti BBVA in the shortest time.',
        tr: 'İran\'daki Shetab havalelerinin hızlı tahsili ve liranın Ziraat Bankası, İş Bankası, VakıfBank ve Garanti BBVA hesaplarına en kısa sürede aktarılması.',
      },
    ],
    features: [
      {
        fa: 'انتقال مستقیم ریال به لیر و بالعکس با واریز فوری به تمامی بانک‌های ترکیه',
        en: 'Direct rial-to-lira exchange and back, with instant deposit to any bank in Turkey',
        tr: 'Riyalden liraya ve tersine doğrudan çevirme, Türkiye\'deki tüm bankalara anında yatırım',
      },
      {
        fa: 'حواله دلار و یورو به بانک‌های کشورهای اروپایی و حوزه شنگن',
        en: 'Dollar and euro transfers to banks in Europe and the Schengen area',
        tr: 'Avrupa ve Schengen bölgesindeki bankalara dolar ve avro transferi',
      },
      {
        fa: 'حواله سوئیفت شرکتی همراه با ارائه فاکتور و مدارک منبع پول قانونی',
        en: 'Corporate SWIFT transfers with invoices and legal source-of-funds documents',
        tr: 'Fatura ve yasal fon kaynağı belgeleriyle kurumsal SWIFT transferi',
      },
      {
        fa: 'امکان تحویل نقدی اسکناس (Cash) در دفاتر صرافی مجاز استانبول و دبی',
        en: 'Cash collection at licensed exchange offices in Istanbul and Dubai',
        tr: 'İstanbul ve Dubai\'deki yetkili döviz bürolarında nakit teslim',
      },
      {
        fa: 'پرداخت مستقیم شهریه دانشگاه‌ها و هزینه‌های خوابگاه دانشجویی',
        en: 'Direct payment of university tuition and student housing fees',
        tr: 'Üniversite harçları ve öğrenci yurdu ücretlerinin doğrudan ödenmesi',
      },
      {
        fa: 'پشتیبانی ارزی ۲۴ ساعته با شفافیت کامل در محاسبه کارمزد',
        en: '24-hour currency support with fully transparent fees',
        tr: 'Komisyon hesabında tam şeffaflıkla 7/24 döviz desteği',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'استعلام نرخ لحظه‌ای و ثبت درخواست',
          en: 'Live rate quote and request',
          tr: 'Anlık kur teklifi ve talep',
        },
        description: {
          fa: 'تماس با واحد ارزی، اعلام مبلغ و تعیین نحوه دریافت (نقدی یا واریز به حساب بانکی).',
          en: 'Contact the currency desk, give the amount and choose how it is received (cash or bank deposit).',
          tr: 'Döviz birimiyle iletişime geçin, tutarı bildirin ve alım şeklini (nakit veya banka hesabı) seçin.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'واریز وجه ریالی یا ارزی',
          en: 'Pay in rials or foreign currency',
          tr: 'Riyal veya döviz ödemesi',
        },
        description: {
          fa: 'واریز به حساب‌های بانکی امن گیتی پیما و ارائه رسید تراکنش بانکی معتبر.',
          en: 'Deposit to GITI Peyma’s secure bank accounts and provide a valid bank receipt.',
          tr: 'GITI Peyma\'nın güvenli banka hesaplarına yatırın ve geçerli banka dekontunu iletin.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'اجرای حواله بین‌المللی',
          en: 'The international transfer is made',
          tr: 'Uluslararası transferin yapılması',
        },
        description: {
          fa: 'انتقال از طریق شبکه بانکی ترکیه (EFT/FAST) یا صدور سوئیفت ارزی با کد پیگیری.',
          en: 'Transfer through the Turkish banking network (EFT/FAST) or a SWIFT transfer with a tracking code.',
          tr: 'Türk bankacılık ağı (EFT/FAST) üzerinden ya da takip kodlu SWIFT ile transfer.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'ارائه رسید رسمی بانکی به مشتری',
          en: 'Official bank receipt for the customer',
          tr: 'Müşteriye resmi banka dekontu',
        },
        description: {
          fa: 'ارسال رسید رسمی مهرشده بانک و پیامک تکمیل موفقیت‌آمیز تراکنش به فرستنده.',
          en: 'The sender receives the bank’s stamped official receipt and a text message confirming the transaction.',
          tr: 'Göndericiye bankanın kaşeli resmi dekontu ve işlemin başarıyla tamamlandığını bildiren SMS gönderilir.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'حواله به حساب‌های زراعت بانک چقدر زمان می‌برد؟',
          en: 'How long does a transfer to a Ziraat Bankası account take?',
          tr: 'Ziraat Bankası hesaplarına transfer ne kadar sürer?',
        },
        answer: {
          fa: 'واریز لیر به حساب‌های زراعت بانک از طریق سیستم FAST ظرف کمتر از ۱۵ الی ۳۰ دقیقه در ساعات کاری تسویه می‌شود.',
          en: 'Lira deposits to Ziraat Bankası accounts through the FAST system clear in under 15 to 30 minutes during business hours.',
          tr: 'Ziraat Bankası hesaplarına FAST sistemiyle yapılan lira transferleri mesai saatlerinde 15 ila 30 dakikadan kısa sürede gerçekleşir.',
        },
      },
    ],
    image: '/images/services/currency-exchange-swift.webp',
    badge: {
      fa: 'تسویه فوری و امن',
      en: 'Fast and secure settlement',
      tr: 'Hızlı ve güvenli ödeme',
    },
    highlight: true,
  },
  {
    id: 'service-10',
    slug: 'education-residence-permit',
    title: {
      fa: 'پذیرش تحصیلی، اقامت و مجوز کار (Çalışma İzni)',
      en: 'University Admission, Residency and Work Permits (Çalışma İzni)',
      tr: 'Üniversite Kabulü, Oturum ve Çalışma İzni',
    },
    shortTitle: {
      fa: 'پذیرش تحصیلی و اقامت بین‌المللی',
      en: 'University Admission and Residency',
      tr: 'Üniversite Kabulü ve Oturum',
    },
    category: 'immigration',
    categoryLabel: {
      fa: 'خدمات کنسولی و اقامت',
      en: 'Consular and residency services',
      tr: 'Konsolosluk ve oturum hizmetleri',
    },
    eyebrow: {
      fa: 'مسیر مطمئن زندگی، تحصیل و کار در ترکیه و اروپا',
      en: 'A reliable path to living, studying and working in Turkey and Europe',
      tr: 'Türkiye ve Avrupa\'da yaşam, eğitim ve çalışma için güvenilir yol',
    },
    summary: {
      fa: 'ارائه خدمات پذیرش دانشجو و پیگیری امور اقامت کاری، سرمایه‌گذاری، تحصیلی و توریستی در کشورهای اروپایی، ترکیه و کشورهای عربی؛ همچنین خدمات مرتبط با مجوز کار (Çalışma İzni).',
      en: 'Student admissions and follow-up of work, investment, student and tourist residency in Europe, Turkey and the Arab countries, plus work permit (Çalışma İzni) services.',
      tr: 'Avrupa ülkeleri, Türkiye ve Arap ülkelerinde öğrenci kabulü ile çalışma, yatırım, öğrenci ve turistik oturum işlemlerinin takibi; ayrıca çalışma izni hizmetleri.',
    },
    description: {
      fa: 'تیم تخصصی مهاجرت تحصیلی و اقامتی گیتی پیما شما را در انتخاب رشته، اخذ پذیرش با بورسیه‌های ۳۰ تا ۱۰۰ درصدی از برترین دانشگاه‌های ترکیه و اروپا، و ثبت پرونده اقامت در اداره کل مدیریت مهاجرت (Göç İdaresi) همراهی می‌نماید.',
      en: 'GITI Peyma’s study and residency team helps you choose a programme, gain admission with 30% to 100% scholarships at leading universities in Turkey and Europe, and file your residence application with the Presidency of Migration Management (Göç İdaresi).',
      tr: 'GITI Peyma\'nın eğitim ve oturum ekibi; bölüm seçiminde, Türkiye ve Avrupa\'nın önde gelen üniversitelerinden %30 ila %100 burslu kabul almada ve Göç İdaresi\'ne oturum başvurusu yapmada size eşlik eder.',
    },
    detailedContent: [
      {
        fa: 'همچنین برای متخصصان و کارآفرینان، انجام مراحل قانونی اخذ مجوز کار رسمی (Çalışma İzni) از وزارت کار و تامین اجتماعی ترکیه و دریافت کارت اقامت یک‌ساله و دو ساله فراهم گردیده است.',
        en: 'For professionals and entrepreneurs, we also handle the legal process of obtaining an official work permit (Çalışma İzni) from Turkey’s Ministry of Labour and Social Security and receiving a one- or two-year residence card.',
        tr: 'Uzmanlar ve girişimciler için Çalışma ve Sosyal Güvenlik Bakanlığı’ndan resmi çalışma izni alınması ve bir ya da iki yıllık ikamet kartı edinilmesi süreçlerini de yürütüyoruz.',
      },
      {
        fa: 'مشاوره دقیق بیمه درمانی معتبر (SGK)، دریافت شماره ملی اتباع خارجی (Yabancı Kimlik Numarası - ۹۹) و پیگیری پرونده‌های تمدید اقامت بدون رد درخواست.',
        en: 'Expert advice on valid health insurance (SGK), obtaining a foreigner identity number (Yabancı Kimlik Numarası, starting with 99) and following up residence renewals without refusals.',
        tr: 'Geçerli sağlık sigortası (SGK), 99 ile başlayan Yabancı Kimlik Numarası alımı ve oturum uzatma dosyalarının ret almadan takibi konusunda uzman danışmanlık.',
      },
    ],
    features: [
      {
        fa: 'اخذ پذیرش تضمینی از دانشگاه‌های تاییدشده وزارت علوم و بهداشت ایران',
        en: 'Guaranteed admission at universities recognised by Iran’s ministries of science and health',
        tr: 'İran Bilim ve Sağlık Bakanlıklarınca tanınan üniversitelerden garantili kabul',
      },
      {
        fa: 'بورسیه‌های تحصیلی ویژه تا سقف ۱۰۰٪ در مقاطع کارشناسی، ارشد و دکتری',
        en: 'Scholarships of up to 100% for bachelor’s, master’s and doctoral programmes',
        tr: 'Lisans, yüksek lisans ve doktorada %100’e varan özel burslar',
      },
      {
        fa: 'تنظیم پرونده اقامت ملکی، اقامت تحصیلی و اقامت کاری',
        en: 'Property, student and work residence applications',
        tr: 'Tapu, öğrenci ve çalışma oturumu dosyalarının hazırlanması',
      },
      {
        fa: 'پیگیری مجوز کار رسمی (Çalışma İzni) برای مشاغل تخصصی و شرکتی',
        en: 'Official work permits (Çalışma İzni) for specialist and corporate roles',
        tr: 'Uzman ve kurumsal pozisyonlar için resmi çalışma izni takibi',
      },
      {
        fa: 'صدور بیمه‌نامه‌های درمانی استاندارد معتبر اداره مهاجرت ترکیه',
        en: 'Standard health insurance policies accepted by the Turkish migration authority',
        tr: 'Türkiye Göç İdaresince kabul edilen standart sağlık sigortası poliçeleri',
      },
      {
        fa: 'همراهی کارشناس مسلط در روز مصاحبه اداره مهاجرت (Randevu)',
        en: 'A fluent specialist with you on the day of your migration office appointment (Randevu)',
        tr: 'Göç idaresi randevu gününde akıcı konuşan bir uzmanın eşliği',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'مشاوره و ارزیابی شرایط متقاضی',
          en: 'Consultation and assessment',
          tr: 'Danışmanlık ve değerlendirme',
        },
        description: {
          fa: 'بررسی مدارک تحصیلی یا موقعیت شغلی متقاضی و تدوین برنامه اجرایی اقامت.',
          en: 'Reviewing your academic records or job position and drawing up a residency plan.',
          tr: 'Akademik belgelerinizin veya iş durumunuzun incelenmesi ve oturum planının hazırlanması.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'اخذ پذیرش دانشگاهی یا قرارداد کاری',
          en: 'University admission or work contract',
          tr: 'Üniversite kabulü veya iş sözleşmesi',
        },
        description: {
          fa: 'مکاتبه با دپارتمان‌های بین‌الملل دانشگاه‌ها و صدور برگه قبولی رسمی (Acceptance).',
          en: 'Corresponding with universities’ international offices and issuing the official acceptance letter.',
          tr: 'Üniversitelerin uluslararası ofisleriyle yazışma ve resmi kabul belgesinin düzenlenmesi.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'ثبت در سامانه اداره مهاجرت (E-İkamet)',
          en: 'Registration in the migration system (E-İkamet)',
          tr: 'Göç idaresi sistemine kayıt (E-İkamet)',
        },
        description: {
          fa: 'اخذ نوبت راندوو، آماده‌سازی پرونده با ترجمه‌ها و بیمه‌نامه و پرداخت مالیات.',
          en: 'Booking the appointment, preparing the file with translations and insurance, and paying the fees.',
          tr: 'Randevu alınması, dosyanın tercüme ve sigortayla hazırlanması ve harçların ödenmesi.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'انگشت‌نگاری و تحویل کارت اقامت',
          en: 'Fingerprints and residence card',
          tr: 'Parmak izi ve ikamet kartı',
        },
        description: {
          fa: 'حضور در اداره مهاجرت و ارسال کارت اقامت فیزیکی (İkamet Kartı) با پست PTT.',
          en: 'Attending the migration office; the physical residence card (İkamet Kartı) is sent by PTT post.',
          tr: 'Göç idaresinde işlemler tamamlanır; ikamet kartı PTT ile gönderilir.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'آیا برای تحصیل در دانشگاه‌های خصوصی ترکیه نیاز به مدرک زبان است؟',
          en: 'Do I need a language certificate to study at a private university in Turkey?',
          tr: 'Türkiye\'deki vakıf üniversitelerinde okumak için dil belgesi gerekir mi?',
        },
        answer: {
          fa: 'خیر، دانشگاه‌ها آزمون تعیین سطح زبان برگزار می‌کنند یا دوره‌های کالج زبان (Hazırlık) را ارائه می‌دهند.',
          en: 'No. Universities hold placement tests or offer preparatory language programmes (Hazırlık).',
          tr: 'Hayır. Üniversiteler seviye tespit sınavı yapar ya da hazırlık programı sunar.',
        },
      },
    ],
    image: '/images/services/education-residence-permit.webp',
    badge: {
      fa: 'بورسیه دانشگاهی و اقامت',
      en: 'Scholarships and residency',
      tr: 'Burslu kabul ve oturum',
    },
  },
  {
    id: 'service-11',
    slug: 'international-marriage',
    title: {
      fa: 'ثبت ازدواج بین‌المللی رسمی در ترکیه',
      en: 'Official International Marriage Registration in Turkey',
      tr: 'Türkiye\'de Resmi Uluslararası Evlilik Kaydı',
    },
    shortTitle: {
      fa: 'ازدواج بین‌المللی رسمی',
      en: 'Official International Marriage',
      tr: 'Resmi Uluslararası Evlilik',
    },
    category: 'legal',
    categoryLabel: {
      fa: 'امور حقوقی و اسناد',
      en: 'Legal affairs and documents',
      tr: 'Hukuki işler ve belgeler',
    },
    eyebrow: {
      fa: 'سند رسمی ازدواج بین‌المللی معتبر در سراسر کشورهای جهان',
      en: 'An official international marriage certificate recognised worldwide',
      tr: 'Tüm dünyada geçerli resmi uluslararası evlilik belgesi',
    },
    summary: {
      fa: 'ارائه راهنمایی و انجام اقدامات و تشریفات مرتبط با ازدواج بین‌المللی از ابتدا تا مراحل نهایی.',
      en: 'Guidance and handling of every formality of an international marriage, from start to finish.',
      tr: 'Uluslararası evliliğe ilişkin tüm işlem ve formalitelerde baştan sona rehberlik ve takip.',
    },
    description: {
      fa: 'ترکیه عضو کنوانسیون بین‌المللی احوال شخصیه (CIEC) است و سند رسمی ازدواج صادر شده توسط شهرداری‌های این کشور (Ailê Cüzdanı) دارای اعتبار بین‌المللی بدون نیاز به تایید مجدد در کشورهای اروپایی، کانادا و آمریکاست. گیتی پیما کلیه مراحل اخذ برگه تجرد، آزمایشات ژنتیک و خون، ترجمه و ثبت شهرداری را ظرف ۲ الی ۳ روز کاری ساماندهی می‌کند.',
      en: 'Turkey is a member of the International Commission on Civil Status (CIEC), and the official marriage certificate issued by its municipalities (Aile Cüzdanı) is recognised internationally, with no further approval needed in European countries, Canada or the US. GITI Peyma arranges the certificate of single status, genetic and blood tests, translation and municipal registration within 2 to 3 working days.',
      tr: 'Türkiye Uluslararası Nüfus Komisyonu (CIEC) üyesidir ve belediyelerin düzenlediği resmi evlilik belgesi (Aile Cüzdanı), Avrupa ülkeleri, Kanada ve ABD\'de ek onaya gerek kalmadan uluslararası geçerliliğe sahiptir. GITI Peyma; bekârlık belgesi, genetik ve kan testleri, tercüme ve belediye kaydının tüm aşamalarını 2 ila 3 iş günü içinde organize eder.',
    },
    detailedContent: [
      {
        fa: 'این خدمت ویژه متقاضیانی است که زوجین دارای دو تابعیت مختلف هستند، یا قصد اقدام جهت پرونده‌های الحاق به همسر (Family Reunion) در سفارتخانه‌های آلمان، اتریش، سوئد، کانادا و انگلستان را دارند.',
        en: 'This service is for couples of two different nationalities, or those applying for family reunion at the embassies of Germany, Austria, Sweden, Canada or the UK.',
        tr: 'Bu hizmet, farklı uyruklardan çiftler ile Almanya, Avusturya, İsveç, Kanada ve Birleşik Krallık büyükelçiliklerinde aile birleşimi başvurusu yapacaklar içindir.',
      },
      {
        fa: 'همچنین برای ثبت رسمی این واقعه در شناسنامه ایرانی، هماهنگی کامل جهت ثبت کنسولی در سرکنسولگری جمهوری اسلامی ایران در استانبول انجام می‌پذیرد.',
        en: 'To record the marriage in your Iranian birth certificate, we also coordinate consular registration at the Consulate General of the Islamic Republic of Iran in Istanbul.',
        tr: 'Evliliğin İran nüfus cüzdanına işlenmesi için İran İslam Cumhuriyeti İstanbul Başkonsolosluğu\'nda konsolosluk kaydı da eksiksiz koordine edilir.',
      },
    ],
    features: [
      {
        fa: 'صدور سند بین‌المللی ازدواج چندزبانه (کتابچه قرمز Ailê Cüzdanı)',
        en: 'A multilingual international marriage certificate (the red Aile Cüzdanı booklet)',
        tr: 'Çok dilli uluslararası evlilik belgesi (kırmızı Aile Cüzdanı)',
      },
      {
        fa: 'تکمیل کلیه مراحل اداری در کمترین زمان (۲ تا ۳ روز کاری)',
        en: 'All administrative steps completed quickly (2 to 3 working days)',
        tr: 'Tüm idari işlemlerin en kısa sürede tamamlanması (2–3 iş günü)',
      },
      {
        fa: 'انجام آزمایشات پزشکی و خون در بیمارستان‌های تاییدشده دولتی ترکیه',
        en: 'Medical and blood tests at approved Turkish state hospitals',
        tr: 'Onaylı Türk devlet hastanelerinde sağlık ve kan testleri',
      },
      {
        fa: 'اخذ برگه تجرد رسمی از کنسولگری و تایید در وزارت امور خارجه ترکیه',
        en: 'Official certificate of single status from the consulate, approved by Turkey’s foreign ministry',
        tr: 'Konsolosluktan resmi bekârlık belgesi ve Türkiye Dışişleri Bakanlığı onayı',
      },
      {
        fa: 'حضور مترجم رسمی قسم‌خورده در مراسم عقد رسمی در شهرداری',
        en: 'A sworn interpreter at the civil ceremony at the municipality',
        tr: 'Belediyedeki resmi nikâhta yeminli tercüman',
      },
      {
        fa: 'امکان هماهنگی عاقد شرعی ایرانی و ثبت در شناسنامه ایرانی زوجین',
        en: 'An Iranian religious officiant on request, and registration in both spouses’ Iranian birth certificates',
        tr: 'İsteğe bağlı İranlı dini nikâh memuru ve çiftin İran nüfus cüzdanına kayıt',
      },
    ],
    steps: [
      {
        stepNumber: '۰۱',
        title: {
          fa: 'اخذ گواهی تجرد و تاییدات کنسولی',
          en: 'Certificate of single status and consular approvals',
          tr: 'Bekârlık belgesi ve konsolosluk onayları',
        },
        description: {
          fa: 'مراجعه به سرکنسولگری و دریافت تاییدیه سلامت وضعیت تاهل و آپوستیل رسمی.',
          en: 'Visiting the Consulate General for confirmation of marital status and the official Apostille.',
          tr: 'Başkonsolosluğa başvurarak medeni hal onayı ve resmi apostilin alınması.',
        },
      },
      {
        stepNumber: '۰۲',
        title: {
          fa: 'آزمایشات سلامت و تایید پزشک معتمد',
          en: 'Health tests and approved doctor',
          tr: 'Sağlık testleri ve yetkili hekim onayı',
        },
        description: {
          fa: 'انجام آزمایش خون و تالاسمی در مراکز بهداشت مورد تایید شهرداری استانبول.',
          en: 'Blood and thalassaemia tests at health centres approved by the Istanbul municipality.',
          tr: 'İstanbul belediyesince onaylı sağlık merkezlerinde kan ve talasemi testleri.',
        },
      },
      {
        stepNumber: '۰۳',
        title: {
          fa: 'رزرو نوبت در شهرداری (Evlendirme Dairesi)',
          en: 'Booking at the marriage office (Evlendirme Dairesi)',
          tr: 'Evlendirme Dairesi randevusu',
        },
        description: {
          fa: 'ارائه پرونده به عاقد رسمی شهرداری و تعیین روز و ساعت مراسم عقد.',
          en: 'Submitting the file to the municipal registrar and setting the day and time of the ceremony.',
          tr: 'Dosyanın belediye nikâh memuruna sunulması ve nikâh gün ve saatinin belirlenmesi.',
        },
      },
      {
        stepNumber: '۰۴',
        title: {
          fa: 'برگزاری مراسم و تحویل سند بین‌المللی',
          en: 'The ceremony and the international certificate',
          tr: 'Nikâh töreni ve uluslararası belge',
        },
        description: {
          fa: 'حضور زوجین و مترجم رسمی، امضای دفتر رسمی و دریافت دفترچه سند بین‌المللی.',
          en: 'The couple and the sworn interpreter attend, sign the official register and receive the international certificate booklet.',
          tr: 'Çift ve yeminli tercüman hazır bulunur, resmi defter imzalanır ve uluslararası evlilik cüzdanı teslim alınır.',
        },
      },
    ],
    faqs: [
      {
        question: {
          fa: 'آیا سند ازدواج ترکیه در سفارت آلمان یا کانادا معتبر است؟',
          en: 'Is a Turkish marriage certificate valid at the German or Canadian embassy?',
          tr: 'Türkiye evlilik belgesi Almanya veya Kanada büyükelçiliğinde geçerli mi?',
        },
        answer: {
          fa: 'بله، سند بین‌المللی ازدواج ترکیه به دلیل عضویت در کنوانسیون آپوستیل و احوال شخصیه بین‌المللی، دارای بالاترین اعتبار حقوقی برای سفارتخانه‌هاست.',
          en: 'Yes. Because Turkey is a party to the Apostille and international civil status conventions, its international marriage certificate carries the highest legal standing with embassies.',
          tr: 'Evet. Türkiye apostil ve uluslararası nüfus sözleşmelerine taraf olduğu için uluslararası evlilik belgesi büyükelçiliklerde en yüksek hukuki geçerliliğe sahiptir.',
        },
      },
    ],
    image: '/images/services/international-marriage.webp',
    badge: {
      fa: 'سند بین‌المللی معتبر',
      en: 'Internationally valid certificate',
      tr: 'Uluslararası geçerli belge',
    },
  },
];
