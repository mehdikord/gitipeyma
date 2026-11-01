'use client';

import React from 'react';
import { ArrowUpRight, Sparkles, PhoneCall } from 'lucide-react';
import { COMPANY_CONFIG } from '../../data/company';
import { useNavigate } from '../../hooks/useNavigate';

export const FinalCTA: React.FC = () => {
  const onNavigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-t from-[#051115] via-[#07191F] to-[#0C252B] text-white relative overflow-hidden border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C6A15B]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12B8B0]/15 border border-[#12B8B0]/30 text-[#12B8B0] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>آغاز همراهی فرامرزی با گیتی پیما</span>
        </div>

        {/* Mandatory Headline from Brief */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F7F7F3] tracking-tight leading-tight">
          «برای شروع یک مسیر تازه آماده‌اید؟»
        </h2>

        {/* Mandatory Description from Brief */}
        <p className="text-base sm:text-lg text-[#A2B6BC] max-w-xl mx-auto leading-relaxed">
          نیاز خود را با ما در میان بگذارید تا کارشناسان گیتی پیما شما را راهنمایی کنند.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/consultation')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#C6A15B] via-[#E2C98C] to-[#C6A15B] text-[#07191F] font-black text-sm tracking-wide shadow-xl shadow-[#C6A15B]/30 hover:shadow-[#C6A15B]/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <span>درخواست مشاوره</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <a
            href={`tel:${COMPANY_CONFIG.emergencySupportPhone.replace(/[\s()-]/g, '')}`}
            className="px-7 py-4 rounded-full bg-[#0C252B] hover:bg-[#12B8B0]/20 text-[#12B8B0] hover:text-[#74FFF7] border border-[#12B8B0]/40 font-bold text-sm transition-all flex items-center gap-2"
            dir="ltr"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="font-mono">{COMPANY_CONFIG.emergencySupportPhone}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
