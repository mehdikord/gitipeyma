'use client';

import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import { SERVICES_DATA } from '../../data/services';
import { ServiceImage } from '../ui/ServiceImage';
import { ServiceRequestForm } from './ServiceRequestForm';
import { CurrencyCalculator } from './CurrencyCalculator';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Wifi,
  Coffee,
  Tv,
} from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

interface ServiceDetailViewProps {
  slug: string;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ slug }) => {
  const onNavigate = useNavigate();
  const service = SERVICES_DATA.find((s) => s.slug === slug) || SERVICES_DATA[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Find related services from the same or adjacent categories
  const relatedServices = SERVICES_DATA.filter((s) => s.slug !== service.slug).slice(0, 3);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#07191F] text-[#F7F7F3] pb-24">
      {/* 1. Dedicated Service Hero with Robust Fallback */}
      <div className="relative h-[420px] sm:h-[480px] overflow-hidden">
        <ServiceImage
          src={service.image}
          alt={service.title}
          category={service.category}
          slug={service.slug}
          isHero={true}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07191F] via-[#07191F]/70 to-black/50"></div>

        {/* Back navigation button */}
        <div className="absolute top-6 right-4 sm:right-8 z-20">
          <button
            onClick={() => onNavigate('/services')}
            className="px-4 py-2 rounded-full bg-[#07191F]/80 hover:bg-[#12B8B0] hover:text-[#07191F] text-xs font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فهرست خدمات</span>
          </button>
        </div>

        {/* Hero Headline content */}
        <div className="absolute bottom-10 right-0 left-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#12B8B0] text-[#07191F] text-xs font-black shadow-md">
                {service.categoryLabel}
              </span>
              {service.badge && (
                <span className="px-3 py-1 rounded-full bg-[#C6A15B] text-[#07191F] text-xs font-bold">
                  {service.badge}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F7F7F3] tracking-tight">
              {service.title}
            </h1>

            <p className="text-sm sm:text-base text-[#E2C98C] font-medium max-w-3xl">
              {service.eyebrow}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* 2 & 3. Introduction & Detailed Content */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F7F7F3] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12B8B0]"></span>
                <span>معرفی و شرح فرآیند خدمت</span>
              </h2>
              <p className="text-base text-[#A2B6BC] leading-relaxed">
                {service.description}
              </p>
              <div className="space-y-3 pt-2">
                {service.detailedContent.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-sm text-[#718085] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Special Interactive Widget for Currency Service */}
            {service.slug === 'currency-exchange-swift' && (
              <section className="pt-2">
                <CurrencyCalculator />
              </section>
            )}

            {/* Special Timetable Widget for VIP Bus Service */}
            {service.slug === 'bus-vip-tehran-istanbul' && (
              <section className="p-6 sm:p-8 rounded-2xl bg-[#0C252B] border border-[#12B8B0]/30 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#E2C98C]" />
                  <h3 className="text-lg font-bold text-[#F7F7F3]">
                    برنامه حرکت روزانه سرویس‌های VIP گیتی پیما
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#07191F] border border-white/5 space-y-2">
                    <span className="text-[#12B8B0] font-bold block">مسیر رفت: تهران ⇄ استانبول</span>
                    <div>حرکت روزانه: ساعت ۰۹:۰۰ و ۱۲:۰۰ ظهر</div>
                    <div className="text-[#718085]">مبدا: پایانه غرب (آزادی) و پایانه بیهقی</div>
                    <div className="text-[#E2C98C]">مقصد: پایانه آکسارای و پایانه اسنلر استانبول</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#07191F] border border-white/5 space-y-2">
                    <span className="text-[#C6A15B] font-bold block">امکانات ویژه داخل کابین ۲۵ نفره</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5 text-[#12B8B0]" />
                      <span>اینترنت وای‌فای ماهواره‌ای در طول مسیر</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tv className="w-3.5 h-3.5 text-[#12B8B0]" />
                      <span>مانیتور لمسی اختصاصی برای هر صندلی</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-[#12B8B0]" />
                      <span>پذیرایی میان‌وعده و نوشیدنی رایگان</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 4. Features & Amenities */}
            <section className="space-y-5">
              <h2 className="text-xl font-bold text-[#F7F7F3] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
                <span>ویژگی‌ها و مزایای برجسته این خدمت</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-xl bg-[#0C252B] border border-white/5 flex items-start gap-3 hover:border-[#12B8B0]/30 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#12B8B0] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#F7F7F3]/90 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Step-by-Step Procedure */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-[#F7F7F3] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12B8B0]"></span>
                <span>مراحل کلی دریافت خدمت</span>
              </h2>
              <div className="space-y-4">
                {service.steps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl bg-[#0C252B] border border-white/5 flex items-start gap-4 hover:border-[#C6A15B]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-[#E2C98C] font-mono font-black text-sm flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#F7F7F3]">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-[#A2B6BC] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. FAQs Accordion */}
            {service.faqs && service.faqs.length > 0 && (
              <section className="space-y-5">
                <h2 className="text-xl font-bold text-[#F7F7F3] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#E2C98C]" />
                  <span>پرسش‌های متداول در خصوص {service.shortTitle}</span>
                </h2>
                <div className="space-y-3">
                  {service.faqs.map((faq, fIndex) => {
                    const isOpen = openFaqIndex === fIndex;
                    return (
                      <div
                        key={fIndex}
                        className="rounded-xl overflow-hidden bg-[#0C252B] border border-white/5 transition-colors"
                      >
                        <button
                          onClick={() => toggleFaq(fIndex)}
                          className="w-full p-4 text-right flex items-center justify-between gap-4 text-sm font-semibold text-[#F7F7F3] hover:text-[#12B8B0]"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#12B8B0]" /> : <ChevronDown className="w-4 h-4 text-[#718085]" />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-[#A2B6BC] leading-relaxed border-t border-white/5 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 8. Dedicated Service Request Form */}
            <section className="pt-4">
              <ServiceRequestForm serviceTitle={service.title} serviceSlug={service.slug} />
            </section>
          </div>

          {/* Sidebar Area (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Direct Support Card */}
            <div className="p-6 rounded-2xl bg-[#0C252B] border border-[#12B8B0]/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#12B8B0]" />
                <h3 className="text-base font-bold text-[#F7F7F3]">
                  مشاوره مستقیم با کارشناس
                </h3>
              </div>
              <p className="text-xs text-[#A2B6BC] leading-relaxed">
                پرسش یا ابهامی درباره این خدمت دارید؟ کارشناسان ما در دفاتر استانبول و تهران پاسخگوی شما هستند.
              </p>
              <button
                onClick={() => onNavigate('/consultation')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#E2C98C] text-[#07191F] font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                ثبت درخواست مشاوره رایگان
              </button>
            </div>

            {/* Related Services */}
            <div className="p-6 rounded-2xl bg-[#0C252B] border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-[#F7F7F3] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B8B0]"></span>
                <span>سایر خدمات فرامرزی مرتبط</span>
              </h3>
              <div className="space-y-3">
                {relatedServices.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onNavigate(`/services/${rel.slug}`);
                      window.scrollTo(0, 0);
                    }}
                    className="p-3 rounded-xl bg-[#07191F] border border-white/5 hover:border-[#12B8B0]/40 cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#F7F7F3] group-hover:text-[#12B8B0] transition-colors line-clamp-1">
                        {rel.shortTitle}
                      </h4>
                      <p className="text-[11px] text-[#718085] line-clamp-1 mt-0.5">
                        {rel.categoryLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
