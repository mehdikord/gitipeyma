'use client';

import React from 'react';
import { ServiceItem } from '../../types';
import { ServiceImage } from '../ui/ServiceImage';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '../../i18n/I18nProvider';

// The /services page: just the cards, every active service in the order set in the admin panel.
export const ServicesDirectory: React.FC<{ services: ServiceItem[] }> = ({ services }) => {
  const { t: { services: { directory: t }, common: { meta } }, path } = useI18n();

  return (
    <div className="min-h-screen bg-canvas text-ink pt-12 sm:pt-16 pb-24">
      {/* No visible title on this page, but the page still needs one for screen readers and search engines */}
      <h1 className="sr-only">{meta.services}</h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={path(`/services/${service.slug}`)}
              scroll={false}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-surface border border-brand/20 hover:border-gold-deep-line/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Image with Robust Fallback */}
              <div className="relative h-56 overflow-hidden">
                <ServiceImage
                  src={service.image}
                  alt={service.title}
                  category={service.category}
                  slug={service.slug}
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40"></div>

                {service.badge && (
                  <div className="absolute top-3 start-3">
                    <span className="px-3 py-1 rounded-full bg-brand-fill text-on-brand text-[11px] font-black shadow-md">
                      {service.badge}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 start-3">
                  <span className="text-[11px] font-medium text-white/90 bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
                    {service.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink group-hover:text-gold transition-colors mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-4">
                    {service.summary}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {service.features.slice(0, 2).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-ink-dim">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-bold text-brand">
                  <span>{t.details}</span>
                  <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand-fill group-hover:text-on-brand transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};
