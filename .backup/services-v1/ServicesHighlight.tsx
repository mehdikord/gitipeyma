'use client';

import React, { useState } from 'react';
import { SERVICES_DATA } from '../../data/services';
import { ServiceItem } from '../../types';
import { ServiceImage } from '../ui/ServiceImage';
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bus,
  Boxes,
  CircleDollarSign,
  Building2,
  Filter,
} from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

type FilterTab = 'all' | 'transit' | 'cargo' | 'business' | 'residency';

export const ServicesHighlight: React.FC = () => {
  const onNavigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'همه خدمات برگزیده', count: 11 },
    { key: 'transit', label: 'حمل‌ونقل و اتوبوس VIP', count: 1 },
    { key: 'cargo', label: 'کارگو و ترخیص کالا', count: 2 },
    { key: 'business', label: 'تجارت، صرافی و حقوقی', count: 4 },
    { key: 'residency', label: 'اقامت، تحصیل و تشریفات', count: 4 },
  ];

  const getFilteredServices = (): ServiceItem[] => {
    switch (activeTab) {
      case 'transit':
        return SERVICES_DATA.filter((s) => s.category === 'transport');
      case 'cargo':
        return SERVICES_DATA.filter((s) => s.category === 'cargo');
      case 'business':
        return SERVICES_DATA.filter(
          (s) => s.category === 'business' || s.category === 'financial' || s.category === 'legal'
        );
      case 'residency':
        return SERVICES_DATA.filter(
          (s) => s.category === 'immigration' || s.category === 'events'
        );
      case 'all':
      default:
        return SERVICES_DATA.slice(0, 6);
    }
  };

  const displayedServices = getFilteredServices();
  const heroBusService = SERVICES_DATA.find((s) => s.slug === 'bus-vip-tehran-istanbul') || SERVICES_DATA[0];

  return (
    <section className="py-24 bg-gradient-to-b from-[#F2F5F5] via-[#F7F7F3] to-[#EEF3F3] text-[#14282D] relative overflow-hidden border-y border-gray-200/80">
      {/* Subtle warm luxury glow accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#12B8B0]/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#C6A15B]/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-3 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#087F7B]/10 border border-[#087F7B]/20 text-[#087F7B] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خدمات تخصصی و بین‌المللی گیتی پیما</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#07191F] tracking-tight leading-tight">
              راهکارهای جامع فرامرزی؛
              <span className="block text-[#087F7B] font-extrabold mt-1">
                از سفر VIP جاده‌ای تا تجارت و اقامت
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#5A6D73] leading-relaxed">
              ارائه زنجیره‌ای هماهنگ و بدون واسطه از خدمات حمل‌ونقل مسافری، کارگو گمرکی، ثبت شرکت و صرافی رسمی میان ایران، ترکیه و اتحادیه اروپا.
            </p>
          </div>

          {/* All Services Link Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/services')}
              className="px-6 py-3.5 rounded-full bg-[#07191F] hover:bg-[#087F7B] text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-[#07191F]/15 flex items-center gap-2 group whitespace-nowrap"
            >
              <span>مشاهده دایرکتوری تمام ۱۱ خدمت</span>
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#087F7B] text-white shadow-lg shadow-[#087F7B]/25 scale-105'
                  : 'bg-white text-[#5A6D73] hover:text-[#087F7B] border border-gray-200/90 hover:border-[#087F7B]/40 shadow-xs'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.key ? 'bg-white/20 text-[#E2C98C]' : 'bg-gray-100 text-[#718085]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Master Showcase: Flagship VIP Bus Hero Card (Shown in 'all' or 'transit' tab) */}
        {(activeTab === 'all' || activeTab === 'transit') && (
          <div
            onClick={() => onNavigate(`/services/${heroBusService.slug}`)}
            className="mb-10 group cursor-pointer rounded-3xl overflow-hidden bg-white border border-[#C6A15B]/30 hover:border-[#C6A15B] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Visual Banner with guaranteed Fallback */}
              <div className="lg:col-span-6 h-64 sm:h-80 relative overflow-hidden bg-[#07191F]">
                <ServiceImage
                  src={heroBusService.image}
                  alt={heroBusService.title}
                  category={heroBusService.category}
                  slug={heroBusService.slug}
                  isHero={true}
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#087F7B] text-white text-xs font-black shadow-md">
                    سرویس ویژه روزانه
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#07191F]/90 text-[#E2C98C] text-xs font-mono font-bold backdrop-blur-md">
                    ۰۱
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="lg:col-span-6 p-6 sm:p-8 space-y-4 text-right">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087F7B]">
                  <Bus className="w-4 h-4 text-[#087F7B]" />
                  <span>تنها نمایندگی رسمی شرکت بین‌المللی گیتی پیما در ترکیه</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#07191F] group-hover:text-[#087F7B] transition-colors">
                  {heroBusService.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5A6D73] leading-relaxed">
                  {heroBusService.summary}
                </p>

                {/* Key specs pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-gray-200/70 flex items-center gap-2 text-xs text-[#14282D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#087F7B] shrink-0" />
                    <span>صندلی تک‌نفره تخت‌خواب‌شو ۲۵ نفره VIP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-gray-200/70 flex items-center gap-2 text-xs text-[#14282D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#087F7B] shrink-0" />
                    <span>اینترنت Wi-Fi ماهواره‌ای در سراسر مسیر</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-gray-200/70 flex items-center gap-2 text-xs text-[#14282D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                    <span>حرکت روزانه راس ساعت ۱۲:۰۰ و ۱۶:۰۰</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-gray-200/70 flex items-center gap-2 text-xs text-[#14282D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                    <span>پایانه آزادی تهران ⇄ پایانه آکسارای استانبول</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-gray-100 text-xs font-bold text-[#087F7B]">
                  <span>رزرو صندلی و مشاهده جزئیات حرکت</span>
                  <div className="w-8 h-8 rounded-full bg-[#087F7B]/10 flex items-center justify-center text-[#087F7B] group-hover:bg-[#087F7B] group-hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bento Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedServices
            .filter((s) => (activeTab === 'all' ? s.slug !== 'bus-vip-tehran-istanbul' : true))
            .map((service, index) => {
              const displayIndex = activeTab === 'all' ? index + 2 : index + 1;
              return (
                <div
                  key={service.id}
                  onClick={() => onNavigate(`/services/${service.slug}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white hover:bg-white border border-gray-200/80 hover:border-[#087F7B]/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {/* Image with Robust Fallback */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-[#07191F]">
                    <ServiceImage
                      src={service.image}
                      alt={service.title}
                      category={service.category}
                      slug={service.slug}
                      className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                    {/* Badges */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                      {service.badge && (
                        <span className="px-3 py-1 rounded-full bg-[#087F7B] text-white text-[11px] font-black shadow-md">
                          {service.badge}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-md bg-black/60 text-[#E2C98C] text-xs font-mono font-bold backdrop-blur-md">
                        {String(displayIndex).padStart(2, '۰')}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-4 z-10">
                      <span className="text-[11px] font-semibold text-white/95 bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-md">
                        {service.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-right">
                    <div>
                      <h3 className="text-lg font-bold text-[#07191F] group-hover:text-[#087F7B] transition-colors mb-2 leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#5A6D73] leading-relaxed line-clamp-2 mb-4">
                        {service.summary}
                      </p>

                      {/* Feature Highlights */}
                      <div className="space-y-1.5 mb-5">
                        {service.features.slice(0, 2).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-[#2D3F44]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#087F7B] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Action Link */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#087F7B]">
                      <span>مشاهده جزئیات کامل و مدارک</span>
                      <div className="w-7 h-7 rounded-full bg-[#087F7B]/10 flex items-center justify-center text-[#087F7B] group-hover:bg-[#087F7B] group-hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Bottom Banner: Direct Consultation CTA */}
        <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#07191F] via-[#0C252B] to-[#07191F] border border-[#12B8B0]/30 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E2C98C]">
              <ShieldCheck className="w-4 h-4 text-[#12B8B0]" />
              <span>پاسخگویی مستقیم دفاتر استانبول و تهران</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              نیاز به راهکاری سفارشی یا ثبت پرونده اختصاصی دارید؟
            </h4>
            <p className="text-xs sm:text-sm text-[#A2B6BC]">
              کارشناسان ارشد گیتی پیما آماده بررسی دقیق و ارائه مشاوره حقوقی، تجاری یا ترانزیتی به شما هستند.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/consultation')}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C6A15B] via-[#E2C98C] to-[#C6A15B] text-[#07191F] font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              درخواست مشاوره فوری
            </button>
            <button
              onClick={() => onNavigate('/services')}
              className="px-6 py-3.5 rounded-full bg-[#07191F] border border-white/20 hover:border-[#12B8B0] text-[#F7F7F3] font-bold text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              فهرست تمام خدمات
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
