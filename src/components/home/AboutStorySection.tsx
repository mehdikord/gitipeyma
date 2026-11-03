'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, Shield, Compass, Award } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';
import { useI18n } from '../../i18n/I18nProvider';

export const AboutStorySection: React.FC = () => {
  const onNavigate = useNavigate();
  const { t: { stories: { story: t } } } = useI18n();
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
                src="/images/about/istanbul-galata.webp"
                alt={t.imageAlt}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07191F] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#0C252B]/90 backdrop-blur-md border border-[#C6A15B]/30">
                <span className="text-xs font-bold text-[#E2C98C] block mb-1">
                  {t.officeTitle}
                </span>
                <p className="text-[11px] text-[#A2B6BC] leading-relaxed">
                  {t.officeText}
                </p>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div className="hidden sm:block absolute -top-5 -start-5 z-20 p-4 rounded-xl bg-[#0C252B] border border-[#12B8B0]/40 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C6A15B]" />
                <div>
                  <span className="text-xs font-bold text-white block">{t.badgeTitle}</span>
                  <span className="text-[10px] text-[#12B8B0]">{t.badgeText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#E2C98C] text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>{t.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#F7F7F3] leading-tight">
              {t.titleLine1}
              <span className="gold-gradient-text block mt-1">
                {t.titleLine2}
              </span>
            </h2>

            <p className="text-base text-[#A2B6BC] leading-relaxed">
              {t.lead}
            </p>

            <p className="text-sm text-[#718085] leading-relaxed">
              {t.body}
            </p>

            {/* Key Values List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {t.values.map((value) => (
                <div key={value} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0C252B]/60 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#12B8B0] shrink-0" />
                  <span className="text-xs font-medium text-[#F7F7F3]">{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-3 rounded-full bg-[#0C252B] hover:bg-[#12B8B0] hover:text-[#07191F] text-[#F7F7F3] border border-[#12B8B0]/30 font-bold text-sm transition-all duration-300 flex items-center gap-2 group"
              >
                <span>{t.more}</span>
                <ArrowLeft className="w-4 h-4 transform ltr:-scale-x-100 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
