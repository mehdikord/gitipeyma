'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, Shield, Compass, Award } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export const AboutStorySection: React.FC = () => {
  const onNavigate = useNavigate();
  return (
    <section className="py-24 bg-[#07191F] text-[#F7F7F3] relative overflow-hidden border-b border-white/5">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#12B8B0]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Layout (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-[#12B8B0]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"
                alt="نمای استانبول و تنگه بسفر - هاب بین‌المللی گیتی پیما"
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07191F] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#0C252B]/90 backdrop-blur-md border border-[#C6A15B]/30">
                <span className="text-xs font-bold text-[#E2C98C] block mb-1">
                  دفتر مرکزی ترکیه (استانبول - فاتیح)
                </span>
                <p className="text-[11px] text-[#A2B6BC] leading-relaxed">
                  نقطه اتصال ترانزیت جاده‌ای خاورمیانه به دروازه‌های اروپایی با ارائه خدمات جامع اقامتی و تجاری.
                </p>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div className="hidden sm:block absolute -top-5 -right-5 z-20 p-4 rounded-xl bg-[#0C252B] border border-[#12B8B0]/40 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C6A15B]" />
                <div>
                  <span className="text-xs font-bold text-white block">تنها نمایندگی رسمی</span>
                  <span className="text-[10px] text-[#12B8B0]">شرکت بین‌المللی گیتی پیما</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#E2C98C] text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>هویت و رسالت مجموعه</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#F7F7F3] leading-tight">
              یک همراه مطمئن،
              <span className="gold-gradient-text block mt-1">
                برای مسیرهایی فراتر از مرزها
              </span>
            </h2>

            <p className="text-base text-[#A2B6BC] leading-relaxed">
              «گیتی پیما» نامی آشنا و پرسابقه در عرصه ترانزیت و ارتباطات بین‌المللی است. با تاسیس نمایندگی رسمی در ترکیه، توانسته‌ایم زنجیره‌ای یکپارچه از خدمات ضروری را به ایرانیان، بازرگانان، دانشجویان و مسافران ارائه دهیم.
            </p>

            <p className="text-sm text-[#718085] leading-relaxed">
              رویکرد ما بر پایه شفافیت حقوقی، احترام به وقت متقاضیان، حذف واسطه‌های غیررسمی و ارائه خدمات بی‌واسطه در شهرهای استانبول و تهران بنا شده است. از سفر جاده‌ای ۲۵ نفره VIP تا ثبت رسمی شرکت و ترخیص بارهای تجاری، تیم ما متعهد به همراهی تا پایان فرآیند است.
            </p>

            {/* Key Values List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0C252B]/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#12B8B0] shrink-0" />
                <span className="text-xs font-medium text-[#F7F7F3]">پاسخگویی مستقیم بدون واسطه‌گری</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0C252B]/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#12B8B0] shrink-0" />
                <span className="text-xs font-medium text-[#F7F7F3]">حضور دفاتر فیزیکی فعال در ایران و ترکیه</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0C252B]/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#12B8B0] shrink-0" />
                <span className="text-xs font-medium text-[#F7F7F3]">تسلط بر موازین قانونی هر دو کشور</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0C252B]/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#12B8B0] shrink-0" />
                <span className="text-xs font-medium text-[#F7F7F3]">شبکه ترانزیت روزانه بدون وقفه</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-3 rounded-full bg-[#0C252B] hover:bg-[#12B8B0] hover:text-[#07191F] text-[#F7F7F3] border border-[#12B8B0]/30 font-bold text-sm transition-all duration-300 flex items-center gap-2 group"
              >
                <span>آشنایی بیشتر با گیتی پیما</span>
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
