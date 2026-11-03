import React from 'react';
import { Headphones, Users, Briefcase, Award, CheckCircle } from 'lucide-react';
import { getI18n } from '../../i18n/server';

const ICONS = [Headphones, Users, Briefcase, Award];

export async function AdvantagesSection() {
  const { t: { stories: { advantages: t } } } = await getI18n();
  const advantages = t.items.map((item, index) => ({ ...item, icon: ICONS[index] }));

  return (
    <section className="py-20 bg-[#0C252B] text-[#F7F7F3] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#12B8B0] tracking-widest uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F7F7F3]">
            {t.title}
          </h2>
          <p className="text-sm text-[#A2B6BC]">
            {t.lead}
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
}
