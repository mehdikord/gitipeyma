'use client';

import React from 'react';
import { Compass, ShieldCheck, Award, Users, Globe2, Building2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';
import { useI18n } from '../../i18n/I18nProvider';

// Title colour of each core value card, in the order of the about dictionary's values.
const VALUE_COLORS = ['text-[#12B8B0]', 'text-[#E2C98C]', 'text-[#74FFF7]'];

export const AboutPage: React.FC = () => {
  const onNavigate = useNavigate();
  const { t: { about: t } } = useI18n();
  return (
    <div className="min-h-screen bg-[#07191F] text-[#F7F7F3] pb-24">
      {/* About Hero */}
      <div className="relative py-20 bg-gradient-to-b from-[#051115] to-[#07191F] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12B8B0]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#E2C98C] text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>{t.eyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F7F7F3] tracking-tight">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-[#A2B6BC] max-w-2xl mx-auto leading-relaxed">
            {t.lead}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">
        {/* Story & Background Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-start">
            <h2 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">
              {t.storyTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#A2B6BC] leading-relaxed">
              {t.storyLead}
            </p>
            <p className="text-xs sm:text-sm text-[#718085] leading-relaxed">
              {t.storyBody}
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-[#12B8B0]/30 shadow-2xl">
              <img
                src="/images/about/dubai-skyline.webp"
                alt={t.imageAlt}
                className="w-full h-[380px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -end-4 sm:end-6 p-4 rounded-2xl bg-[#0C252B] border border-[#C6A15B]/40 shadow-xl backdrop-blur-md max-w-xs">
              <div className="text-xs font-bold text-[#E2C98C] mb-1">{t.badgeTitle}</div>
              <div className="text-[11px] text-[#A2B6BC]">{t.badgeText}</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0C252B] border border-[#12B8B0]/20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0]">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F7F7F3]">{t.missionTitle}</h3>
              <p className="text-xs sm:text-sm text-[#A2B6BC] leading-relaxed">
                {t.missionText}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#07191F] border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F7F7F3]">{t.visionTitle}</h3>
              <p className="text-xs sm:text-sm text-[#A2B6BC] leading-relaxed">
                {t.visionText}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">{t.valuesTitle}</h3>
            <p className="text-xs sm:text-sm text-[#718085]">
              {t.valuesLead}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {t.values.map((value, index) => (
              <div key={value.title} className="p-6 rounded-2xl bg-[#0C252B] border border-white/5 space-y-3">
                <h4 className={`text-base font-bold ${VALUE_COLORS[index]}`}>{value.title}</h4>
                <p className="text-xs text-[#A2B6BC] leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0C252B] via-[#07191F] to-[#0C252B] border border-[#12B8B0]/30 text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">
            {t.ctaTitle}
          </h3>
          <p className="text-sm text-[#A2B6BC] max-w-lg mx-auto">
            {t.ctaText}
          </p>
          <button
            onClick={() => onNavigate('/consultation')}
            className="px-8 py-3.5 rounded-full bg-[#12B8B0] hover:bg-[#087F7B] text-[#07191F] font-bold text-sm shadow-xl transition-all hover:scale-105"
          >
            {t.ctaButton}
          </button>
        </div>
      </div>
    </div>
  );
};
