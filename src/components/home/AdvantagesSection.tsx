import React from 'react';
import { Headphones, Users, Briefcase, Award, CheckCircle } from 'lucide-react';

export const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      icon: Headphones,
      title: 'پشتیبانی ۲۴ ساعته',
      desc: 'پاسخگویی و همراهی پیوسته با مسافران و متقاضیان در طول تمامی مراحل پیگیری، ترانزیت مرزی و تکمیل پرونده‌ها.',
      highlight: 'شبانه‌روزی در ۷ روز هفته',
    },
    {
      icon: Users,
      title: 'تیم متخصص و حرفه‌ای',
      desc: 'استفاده از دانش و تجربه میدانی کارشناسان مسلط بر زبان‌های ترکی، انگلیسی و قوانین بین‌المللی در استانبول و تهران.',
      highlight: 'مشاوران باسابقه فرامرزی',
    },
    {
      icon: Briefcase,
      title: 'تنوع خدمات در یک درگاه',
      desc: 'دسترسی همزمان به خدمات ترانزیت جاده‌ای VIP، کارگو تجاری، صرافی بین‌المللی، امور ثبتی، اقامتی و تشریفات.',
      highlight: 'یکپارچگی ۱۱ خدمت کلیدی',
    },
    {
      icon: Award,
      title: 'همراهی تا پایان فرآیند',
      desc: 'تعهد به راهنمایی کامل مشتری در تمامی گام‌ها، از مشاوره اولیه تا تسویه نهایی، تحویل مدارک و رفع هرگونه ابهام.',
      highlight: 'بدون رها کردن پرونده',
    },
  ];

  return (
    <section className="py-20 bg-[#0C252B] text-[#F7F7F3] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#12B8B0] tracking-widest uppercase">
            WHY GITI SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F7F7F3]">
            مزیت‌های متمایز انتخاب گیتی پیما
          </h2>
          <p className="text-sm text-[#A2B6BC]">
            استانداردهای حرفه‌ای که امنیت خاطر و سرعت عمل را در تمامی امور فرامرزی شما تضمین می‌کنند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#07191F]/90 border border-[#12B8B0]/20 hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0C252B] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0] mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F7F7F3] mb-2">{adv.title}</h3>
                  <p className="text-xs text-[#A2B6BC] leading-relaxed mb-4">{adv.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-[#E2C98C]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{adv.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
