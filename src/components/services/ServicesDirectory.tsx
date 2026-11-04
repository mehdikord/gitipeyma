'use client';

import React, { useState } from 'react';
import { ServiceCategoryItem, ServiceItem } from '../../types';
import { ServiceImage } from '../ui/ServiceImage';
import { Search, Filter, ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';
import { useI18n } from '../../i18n/I18nProvider';

export const ServicesDirectory: React.FC<{ services: ServiceItem[]; categories: ServiceCategoryItem[] }> = ({ services, categories: serviceCategories }) => {
  const onNavigate = useNavigate();
  const { t: { services: { directory: t } }, num, fill, intl } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: fill(t.all, { count: num(services.length) }) },
    ...serviceCategories.map((category) => ({ key: category.slug, label: category.title })),
  ];

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const query = searchQuery.trim().toLocaleLowerCase(intl);
    const matchesSearch =
      !query ||
      service.title.toLocaleLowerCase(intl).includes(query) ||
      service.summary.toLocaleLowerCase(intl).includes(query) ||
      service.description.toLocaleLowerCase(intl).includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-canvas text-ink pt-8 pb-24">
      {/* Services Directory Hero */}
      <div className="relative py-16 bg-gradient-to-b from-canvas-deep to-canvas border-b border-ink/5 overflow-hidden">
        <div className="absolute top-0 start-1/3 w-96 h-96 bg-brand/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.eyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
            {t.intro}
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-dim absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ps-10 pe-4 py-3 rounded-full bg-surface border border-brand/30 text-ink-strong text-xs sm:text-sm focus:outline-none focus:border-gold-line placeholder-ink-dim"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-ink-dim hover:text-ink-strong"
                >
                  {t.clear}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-brand-fill text-on-accent shadow-lg shadow-brand/20'
                  : 'bg-surface text-ink-muted hover:text-ink-strong hover:bg-surface-2 border border-ink/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="py-4 text-xs text-ink-dim flex items-center justify-between">
          <span>{fill(t.showing, { count: num(filteredServices.length) })}</span>
          {searchQuery && <span>{fill(t.filteredBy, { query: searchQuery })}</span>}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredServices.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => onNavigate(`/services/${service.slug}`)}
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
                    <span className="px-3 py-1 rounded-full bg-brand-fill text-on-accent text-[11px] font-black shadow-md">
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
                  <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand-fill group-hover:text-on-accent transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-surface rounded-2xl border border-ink/5 my-8 space-y-3">
            <p className="text-base text-ink-muted">{t.empty}</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-brand-fill text-on-accent text-xs font-bold"
            >
              {t.showAll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
