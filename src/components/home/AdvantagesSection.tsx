import React from 'react';
import { Headphones, Users, Briefcase, Award, CheckCircle } from 'lucide-react';
import { getI18n } from '../../i18n/server';

const ICONS = [Headphones, Users, Briefcase, Award];

export async function AdvantagesSection() {
  const { t: { stories: { advantages: t } } } = await getI18n();
  const advantages = t.items.map((item, index) => ({ ...item, icon: ICONS[index] }));

  return (
    <section className="py-20 bg-surface text-ink border-b border-ink/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-brand tracking-widest uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ink">
            {t.title}
          </h2>
          <p className="text-sm text-ink-muted">
            {t.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-canvas/90 border border-brand/20 hover:border-gold-deep-line/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface border border-brand/30 flex items-center justify-center text-brand mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">{adv.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed mb-4">{adv.desc}</p>
                </div>

                <div className="pt-3 border-t border-ink/10 flex items-center gap-1.5 text-[11px] font-semibold text-gold">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-deep" />
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
