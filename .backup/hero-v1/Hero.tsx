'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  Boxes,
  Truck,
  Building2,
  CircleDollarSign,
} from 'lucide-react';
import { InternationalTradeAnimation } from './InternationalTradeAnimation';
import { useNavigate } from '../../hooks/useNavigate';

export const Hero: React.FC = () => {
  const onNavigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#040D10] via-[#07191F] to-[#0A2229] pt-8 pb-20 border-b border-[#12B8B0]/20">
      {/* Dynamic Animated Transit Highway Backdrop SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 480 C 300 320, 600 580, 1000 360 C 1200 240, 1400 310, 1600 220"
            stroke="#12B8B0"
            strokeWidth="2"
            strokeDasharray="8 12"
            className="animate-dash-flow"
          />
          <path
            d="M-50 250 C 400 450, 750 200, 1100 420 C 1300 520, 1500 400, 1650 350"
            stroke="#C6A15B"
            strokeWidth="1.5"
            strokeDasharray="6 14"
            className="animate-dash-flow"
            style={{ animationDirection: 'reverse', animationDuration: '12s' }}
          />
        </svg>
      </div>

      {/* Atmospheric Ambient Glow Orbs */}
      <div className="absolute top-1/4 right-10 w-[550px] h-[550px] bg-[#12B8B0]/15 rounded-full blur-[160px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#C6A15B]/15 rounded-full blur-[170px] pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Right Column: Editorial Typography & Brand Authority (5 cols in RTL) */}
          <div className="lg:col-span-5 space-y-6 text-right">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C252B] border border-[#12B8B0]/30 shadow-lg shadow-[#12B8B0]/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B8B0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12B8B0]"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-[#E2C98C]">
                GITI | OFFICIAL INTERNATIONAL LOGISTICS & COMMERCE
              </span>
            </div>

            {/* Mandatory Headline from Brief */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F7F7F3] leading-[1.2] tracking-tight">
              مرزها، پایان مسیر نیستند؛
              <span className="gold-gradient-text block mt-2 text-4xl sm:text-5xl md:text-5xl drop-shadow-sm">
                آغاز فرصت‌های تازه‌اند.
              </span>
            </h1>

            {/* Mandatory Description from Brief */}
            <p className="text-base sm:text-lg text-[#A2B6BC] leading-relaxed">
              گیتی پیما، همراه مطمئن شما در مسیر خدمات بین‌المللی، تجارت، حمل‌ونقل و راهکارهای فرامرزی؛ از ایران تا ترکیه، اروپا و فراتر از آن.
            </p>

            {/* Key Value Badges Strip */}
            <div className="p-4 rounded-2xl bg-[#0C252B]/85 border border-white/10 backdrop-blur-md space-y-2.5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E2C98C]">
                <ShieldCheck className="w-4 h-4 text-[#12B8B0] shrink-0" />
                <span>تنها نمایندگی رسمی شرکت بین‌المللی گیتی پیما در کشور ترکیه</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A2B6BC] pt-1.5 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B8B0]"></span>
                  <span>پایانه آکسارای استانبول</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
                  <span>پایانه مسافربری غرب تهران</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/services')}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#12B8B0] via-[#087F7B] to-[#12B8B0] text-[#07191F] font-black text-sm tracking-wide shadow-xl shadow-[#12B8B0]/30 hover:shadow-[#12B8B0]/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <span>مشاهده ۱۱ خدمت فرامرزی</span>
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/consultation')}
                className="px-6 py-4 rounded-full bg-[#0C252B] hover:bg-[#14282D] text-[#E2C98C] border border-[#C6A15B]/40 hover:border-[#E2C98C] font-bold text-sm tracking-wide shadow-md transition-all flex items-center gap-2 group"
              >
                <span>درخواست مشاوره ۲۴ ساعته</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Left Column: Bespoke Animated International Trade & Freight Hub (7 cols in RTL) */}
          <div className="lg:col-span-7 relative">
            <InternationalTradeAnimation />
          </div>
        </div>

        {/* Bottom Credibility Ticker Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
          <div
            onClick={() => onNavigate('/services/bus-vip-tehran-istanbul')}
            className="p-4 rounded-2xl bg-[#0C252B]/50 border border-white/5 hover:border-[#12B8B0]/40 transition-colors cursor-pointer space-y-1"
          >
            <span className="text-xs text-[#12B8B0] font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>ناوگان روزانه VIP</span>
            </span>
            <span className="text-sm font-black text-white block">تهران ⇄ استانبول</span>
            <p className="text-[11px] text-[#718085]">حرکت همه‌روزه از پایانه آزادی و بیهقی</p>
          </div>

          <div
            onClick={() => onNavigate('/services/cargo-customs-clearance')}
            className="p-4 rounded-2xl bg-[#0C252B]/50 border border-white/5 hover:border-[#C6A15B]/40 transition-colors cursor-pointer space-y-1"
          >
            <span className="text-xs text-[#E2C98C] font-bold flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" />
              <span>کارگو و ترخیص رسمی</span>
            </span>
            <span className="text-sm font-black text-white block">۳ الی ۵ روز اکسپرس</span>
            <p className="text-[11px] text-[#718085]">بیمه‌نامه CMR و ترخیص گمرکات</p>
          </div>

          <div
            onClick={() => onNavigate('/services/currency-exchange-swift')}
            className="p-4 rounded-2xl bg-[#0C252B]/50 border border-white/5 hover:border-[#12B8B0]/40 transition-colors cursor-pointer space-y-1"
          >
            <span className="text-xs text-[#12B8B0] font-bold flex items-center gap-1.5">
              <CircleDollarSign className="w-3.5 h-3.5" />
              <span>تسویه ارزی و سوئیفت</span>
            </span>
            <span className="text-sm font-black text-white block">زیر ۳۰ دقیقه</span>
            <p className="text-[11px] text-[#718085]">واریز به بانک‌های ترکیه و اروپا</p>
          </div>

          <div
            onClick={() => onNavigate('/contact')}
            className="p-4 rounded-2xl bg-[#0C252B]/50 border border-white/5 hover:border-[#E2C98C]/40 transition-colors cursor-pointer space-y-1"
          >
            <span className="text-xs text-[#E2C98C] font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>دفاتر فیزیکی معتبر</span>
            </span>
            <span className="text-sm font-black text-white block">استانبول، تهران، تبریز</span>
            <p className="text-[11px] text-[#718085]">پاسخگویی مستقیم ۲۴/۷</p>
          </div>
        </div>
      </div>
    </section>
  );
};
