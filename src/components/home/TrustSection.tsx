import React from 'react';
import { Globe, Layers, UserCheck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: Globe,
      title: 'فعالیت تخصصی بین‌المللی',
      desc: 'تمرکز ویژه بر تعاملات تجاری، حمل‌ونقل و مبادلات فرامرزی میان ایران، ترکیه و اتحادیه اروپا با استانداردهای قانونی.',
      accent: 'border-[#12B8B0]/30 hover:border-[#12B8B0]',
      iconColor: 'text-[#12B8B0]',
    },
    {
      icon: Layers,
      title: 'تنوع خدمات در یک مجموعه',
      desc: 'یکپارچه‌سازی خدمات اتوبوس VIP، کارگو، امور حقوقی، ثبت شرکت، صرافی و اقامت بدون نیاز به مراجعه به مراجع متعدد.',
      accent: 'border-[#C6A15B]/30 hover:border-[#C6A15B]',
      iconColor: 'text-[#C6A15B]',
    },
    {
      icon: UserCheck,
      title: 'همراهی در تمامی مراحل',
      desc: 'راهنمایی گام‌به‌گام و پیگیری مستقیم پرونده‌های متقاضیان از لحظه ثبت تقاضا تا حصول نتیجه قطعی.',
      accent: 'border-[#12B8B0]/30 hover:border-[#12B8B0]',
      iconColor: 'text-[#12B8B0]',
    },
    {
      icon: Clock,
      title: 'پشتیبانی و پاسخگویی ۲۴ ساعته',
      desc: 'مرکز تماس و پشتیبانی مستقر در استانبول و تهران، آماده راهنمایی مسافران و بازرگانان در تمامی ساعات شبانه‌روز.',
      accent: 'border-[#E2C98C]/30 hover:border-[#E2C98C]',
      iconColor: 'text-[#E2C98C]',
    },
  ];

  return (
    <section className="py-14 bg-[#07191F] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-[#0C252B]/70 border ${item.accent} transition-all duration-300 hover:-translate-y-1 shadow-lg`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#07191F] border border-white/10 flex items-center justify-center mb-4">
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-[#F7F7F3] mb-2">{item.title}</h3>
                <p className="text-xs text-[#A2B6BC] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
