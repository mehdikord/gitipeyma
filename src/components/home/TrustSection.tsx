import React from 'react';
import { Globe, Layers, UserCheck, Clock } from 'lucide-react';
import { getI18n } from '../../i18n/server';

// The look of each pillar; the words are in the stories dictionary, in the same order.
const PILLARS = [
  { icon: Globe, accent: 'border-brand/30 hover:border-brand', iconColor: 'text-brand' },
  { icon: Layers, accent: 'border-gold-deep-line/30 hover:border-gold-deep-line', iconColor: 'text-gold-deep' },
  { icon: UserCheck, accent: 'border-brand/30 hover:border-brand', iconColor: 'text-brand' },
  { icon: Clock, accent: 'border-gold-line/30 hover:border-gold-line', iconColor: 'text-gold' },
];

export async function TrustSection() {
  const { t } = await getI18n();
  const trustPillars = PILLARS.map((pillar, index) => ({ ...pillar, ...t.stories.trust[index] }));

  return (
    <section className="py-14 bg-canvas border-b border-ink/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-surface/70 border ${item.accent} transition-all duration-300 hover:-translate-y-1 shadow-lg`}
              >
                <div className="w-12 h-12 rounded-xl bg-canvas border border-ink/10 flex items-center justify-center mb-4">
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
