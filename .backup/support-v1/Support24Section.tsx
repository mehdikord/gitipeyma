'use client';

import React from 'react';
import {
  PhoneCall,
  MessageCircle,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Headphones,
  CheckCircle2,
  MapPin,
  FileText,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../../data/company';
import { useNavigate } from '../../hooks/useNavigate';

export const Support24Section: React.FC = () => {
  const onNavigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-b from-[#F2F6F6] via-[#F7F7F3] to-[#EDF3F3] text-[#07191F] relative overflow-hidden border-y border-emerald-950/10">
      {/* Ambient warm mineral and turquoise glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#12B8B0]/8 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#C6A15B]/8 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Subtle topographic grid texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <pattern id="support-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="1.2" fill="#087F7B" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#support-grid-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-900/10 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B8B0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#087F7B]"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-[#087F7B]">
              24/7 DEDICATED ASSISTANCE | مرکز پاسخگویی و همراهی شبانه‌روزی
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#07191F] tracking-tight leading-tight">
            «در تمام مسیر، تنها نخواهید بود.»
            <span className="text-[#087F7B] block mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold">
              همراهی لحظه‌به‌لحظه از پایانه‌های ایران تا قلب استانبول و اروپا
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#5F7279] max-w-2xl mx-auto leading-relaxed">
            تیم پشتیبانی گیتی پیما در تمام مراحل پیگیری خدمات، رزرو بلیت، ترخیص کارگو و تشریفات قانونی، آماده پاسخگویی و همراهی بی‌وقفه با شماست.
          </p>
        </div>

        {/* 3 Main Contact & Support Channel Cards (Bento Hub) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Channel 1: Istanbul & International Hotline */}
          <div className="p-8 rounded-3xl bg-white/95 border border-emerald-950/10 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-[#12B8B0]/40 transition-all hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-[#12B8B0]/15 text-[#087F7B] flex items-center justify-center group-hover:bg-[#12B8B0] group-hover:text-white transition-all shadow-md shadow-[#12B8B0]/10">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#12B8B0]/10 text-[#087F7B] text-[11px] font-bold">
                  پاسخگویی ۲۴/۷
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#07191F] mb-1">
                  مرکز تماس تلفنی استانبول
                </h3>
                <p className="text-xs text-[#5F7279] leading-relaxed">
                  خط مستقیم شبانه‌روزی پایانه آکسارای جهت پیگیری لحظه‌ای اتوبوس، بلیت و ترانزیت.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-right">
                  <span className="text-[11px] text-[#718085] block">تلفن مستقیم دفتر مرکزی استانبول:</span>
                  <a
                    href="tel:+902125884040"
                    dir="ltr"
                    className="text-lg font-mono font-black text-[#07191F] hover:text-[#087F7B] transition-colors inline-block mt-0.5"
                  >
                    +90 (212) 588 40 40
                  </a>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#718085] block">شماره همراه پشتیبانی ۲۴ ساعته:</span>
                  <a
                    href="tel:+905367008090"
                    dir="ltr"
                    className="text-sm font-mono font-bold text-[#087F7B] hover:underline inline-block mt-0.5"
                  >
                    +90 (536) 700 80 90
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="tel:+902125884040"
                className="w-full py-3.5 rounded-2xl bg-[#07191F] hover:bg-[#0C252B] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg"
              >
                <PhoneCall className="w-4 h-4 text-[#12B8B0]" />
                <span>برقراری تماس مستقیم</span>
              </a>
            </div>
          </div>

          {/* Channel 2: WhatsApp Direct Line */}
          <div className="p-8 rounded-3xl bg-white/95 border border-emerald-950/10 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-[#25D366]/40 transition-all hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-[#25D366]/15 text-[#1FB855] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-md shadow-[#25D366]/10">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#25D366]/10 text-[#1FB855] text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span>پاسخ زیر ۳ دقیقه</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#07191F] mb-1">
                  ارتباط سریع در واتس‌اپ
                </h3>
                <p className="text-xs text-[#5F7279] leading-relaxed">
                  ارسال مدارک، استعلام بارنامه CMR، صدور بلیت و مکالمه مستقیم با کارشناسان.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F9F6] border border-[#25D366]/20 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#07191F] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>پذیرش ۲۴ ساعته پیام‌های صوتی و متنی</span>
                </div>
                <div className="flex items-center gap-2 text-[#5F7279] text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>بررسی مدارک هویتی، پاسپورت و فاکتورها</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/905367008090"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20BA59] text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>شروع گفتگو در واتس‌اپ</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Channel 3: Consultation & Case Appointment */}
          <div className="p-8 rounded-3xl bg-white/95 border border-emerald-950/10 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-[#C6A15B]/40 transition-all hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-[#C6A15B]/15 text-[#9B7832] flex items-center justify-center group-hover:bg-[#C6A15B] group-hover:text-white transition-all shadow-md shadow-[#C6A15B]/10">
                  <Headphones className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#9B7832] text-[11px] font-bold">
                  مشاوره تخصصی
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#07191F] mb-1">
                  درخواست مشاوره فرامرزی
                </h3>
                <p className="text-xs text-[#5F7279] leading-relaxed">
                  بررسی پرونده‌های تجاری، ثبت شرکت، ترخیص گمرکی، امور حقوقی و عقد بین‌المللی.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#C6A15B]/25 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#07191F] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#9B7832] shrink-0" />
                  <span>تخصیص کارشناس حقوقی و بازرگانی</span>
                </div>
                <div className="flex items-center gap-2 text-[#5F7279] text-[11px]">
                  <Clock className="w-4 h-4 text-[#9B7832] shrink-0" />
                  <span>تماس در زمان انتخابی شما در همان روز</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('/consultation')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#087F7B] via-[#12B8B0] to-[#087F7B] hover:brightness-110 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-[#12B8B0]/20 hover:shadow-lg"
              >
                <span>دریافت وقت مشاوره تخصصی</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Trust Signals: Comprehensive Journey Coverage */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-emerald-950/10 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#12B8B0]/15 text-[#087F7B] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#07191F]">حضور میدانی در مبدأ و مقصد</h4>
              <p className="text-xs text-[#5F7279] mt-1 leading-relaxed">
                دفاتر فعال در پایانه غرب تهران و پایانه اختصاصی آکسارای استانبول.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C6A15B]/15 text-[#9B7832] flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#07191F]">همراهی در گیت‌های مرزی</h4>
              <p className="text-xs text-[#5F7279] mt-1 leading-relaxed">
                راهنمایی و تشریفات مسافری و ترانزیت در مرز بازرگان، رازی و سرو.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#12B8B0]/15 text-[#087F7B] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#07191F]">رهگیری آنلاین بارنامه CMR</h4>
              <p className="text-xs text-[#5F7279] mt-1 leading-relaxed">
                اطلاع‌رسانی لحظه‌ای وضعیت ترخیص کالا از گمرکات ایران و ترکیه.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C6A15B]/15 text-[#9B7832] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#07191F]">مترجم رسمی و همراه حقوقی</h4>
              <p className="text-xs text-[#5F7279] mt-1 leading-relaxed">
                همراهی در دفاتر نوتر، ثبت اسناد، اتاق بازرگانی و بانک زراعت.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
