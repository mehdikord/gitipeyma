// The one or two quick questions each service's request form asks, taken from what
// that service actually offers in services.ts. All are optional: a visitor can skip
// them and an expert asks on the call.

export type RequestRoute = { from: string; to: string };

export type RequestQuestion =
  | { id: string; kind: 'route'; label: string; routes: RequestRoute[] }
  | { id: string; kind: 'choice'; label: string; choices: string[] };

export const routeText = (route: RequestRoute) => `${route.from} به ${route.to}`;

const IRAN_TURKEY: RequestRoute[] = [
  { from: 'ایران', to: 'ترکیه' },
  { from: 'ترکیه', to: 'ایران' },
];

export const REQUEST_QUESTIONS: Record<string, RequestQuestion[]> = {
  'bus-vip-tehran-istanbul': [
    {
      id: 'route',
      kind: 'route',
      label: 'مسیر سفر',
      routes: [
        { from: 'تهران', to: 'استانبول' },
        { from: 'استانبول', to: 'تهران' },
      ],
    },
    { id: 'when', kind: 'choice', label: 'زمان سفر', choices: ['این هفته', 'هفته آینده', 'هنوز مشخص نیست'] },
  ],
  'cargo-express-postal': [
    { id: 'route', kind: 'route', label: 'مسیر ارسال', routes: IRAN_TURKEY },
    { id: 'parcel', kind: 'choice', label: 'نوع مرسوله', choices: ['مدارک فوری', 'بسته شخصی', 'پوشاک', 'نمونه تجاری'] },
  ],
  'cargo-customs-clearance': [
    { id: 'route', kind: 'route', label: 'مسیر بار', routes: IRAN_TURKEY },
    { id: 'load', kind: 'choice', label: 'نوع بار', choices: ['خرده‌بار (LCL)', 'کانتینری (FCL)', 'هنوز مشخص نیست'] },
  ],
  'company-registration': [
    { id: 'goal', kind: 'choice', label: 'نیاز اصلی شما', choices: ['ثبت شرکت', 'افتتاح حساب شرکتی', 'آدرس اداری و دفتر مجازی', 'اقامت کاری مدیرعامل'] },
  ],
  'international-visa': [
    { id: 'destination', kind: 'choice', label: 'مقصد', choices: ['شنگن', 'کانادا', 'آمریکا', 'بریتانیا'] },
    { id: 'visa', kind: 'choice', label: 'نوع ویزا', choices: ['توریستی', 'تجاری', 'تحصیلی'] },
  ],
  'turkey-weddings': [
    { id: 'venue', kind: 'choice', label: 'محل مراسم', choices: ['کاخ‌های بسفر', 'کشتی مجلل', 'باغ لوکس', 'هنوز تصمیم نگرفته‌ام'] },
  ],
  'legal-power-of-attorney': [
    { id: 'topic', kind: 'choice', label: 'موضوع', choices: ['تنظیم وکالتنامه', 'خرید ملک در ترکیه', 'دعاوی و مطالبات تجاری', 'استعلام سند (Tapu)'] },
  ],
  'official-translation': [
    { id: 'document', kind: 'choice', label: 'نوع سند', choices: ['مدارک هویتی', 'مدارک دانشگاهی', 'گزارش مالی', 'قرارداد بازرگانی'] },
  ],
  'currency-exchange-swift': [
    { id: 'transfer', kind: 'choice', label: 'نوع حواله', choices: ['ریال به لیر', 'دلار و یورو به اروپا', 'سوئیفت شرکتی', 'پرداخت شهریه'] },
  ],
  'education-residence-permit': [
    { id: 'goal', kind: 'choice', label: 'هدف شما', choices: ['پذیرش تحصیلی', 'اقامت تحصیلی', 'اقامت کاری', 'اقامت ملکی'] },
  ],
  'international-marriage': [
    { id: 'need', kind: 'choice', label: 'نیاز شما', choices: ['انجام کامل مراحل ازدواج', 'برگه تجرد', 'ترجمه و ثبت در شناسنامه'] },
  ],
};
