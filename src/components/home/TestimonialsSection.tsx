'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Quote,
  ChevronRight,
  ChevronLeft,
  Star,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  TrendingUp,
  PlusCircle,
  X,
  Send,
  Building,
  Truck,
  FileCheck2,
  Coins,
  Globe2,
} from 'lucide-react';
import { MetricItem, TestimonialItem } from '../../types';
import { submitTestimonial } from '../../modules/site/actions';
import { useI18n } from '../../i18n/I18nProvider';

// 'all', or a service category slug
type CategoryFilter = string;

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  metrics: MetricItem[];
  quotes: string[];
  // What a visitor can pick as the service they used, in the review form.
  services: { id: number; shortTitle: string }[];
}

const EMPTY_REVIEW = { name: '', serviceId: '', trackingCode: '', rating: 5, comment: '' };

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, metrics: TESTIMONIALS_METRICS, quotes: MARQUEE_TRUST_QUOTES, services }) => {
  const { t: { stories: { testimonials: t } }, locale, fill } = useI18n();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMilestones, setShowMilestones] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, startSubmit] = useTransition();
  const [reviewError, setReviewError] = useState<string | null>(null);

  // New review form state
  const [formData, setFormData] = useState(EMPTY_REVIEW);

  // A new review is saved for approval, so only published ones are listed
  const testimonialsList = testimonials;

  // Filtered testimonials
  const filteredTestimonials = testimonialsList.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Ensure currentIndex stays within bounds when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [activeCategory]);

  const current = filteredTestimonials[currentIndex] || filteredTestimonials[0] || testimonials[0];

  // Auto-play timer with progress bar
  const duration = 7500; // 7.5 seconds
  const intervalStep = 50;

  useEffect(() => {
    if (!isPlaying || isModalOpen) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % filteredTestimonials.length);
          return 0;
        }
        return prev + (intervalStep / duration) * 100;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPlaying, isModalOpen, filteredTestimonials.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
    setProgress(0);
  };

  const selectTestimonial = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    startSubmit(async () => {
      const result = await submitTestimonial({
        name: formData.name,
        serviceId: formData.serviceId,
        trackingCode: formData.trackingCode,
        rating: formData.rating,
        comment: formData.comment,
      }, locale);
      if (!result.ok) {
        setReviewError(Object.values(result.errors ?? {})[0] ?? result.message);
        return;
      }
      setReviewError(null);
      setSubmissionSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmissionSuccess(false);
        setFormData(EMPTY_REVIEW);
      }, 2500);
    });
  };

  // Helper icon for category
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'transport':
        return <Truck className="w-4 h-4 text-brand" />;
      case 'cargo':
        return <Building className="w-4 h-4 text-gold-deep" />;
      case 'business':
        return <FileCheck2 className="w-4 h-4 text-brand" />;
      case 'financial':
        return <Coins className="w-4 h-4 text-gold" />;
      default:
        return <Globe2 className="w-4 h-4 text-brand" />;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-canvas via-canvas-deep to-canvas-deep text-ink border-b border-ink/10 relative overflow-hidden">
      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[160px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-gold-deep/10 rounded-full blur-[170px] pointer-events-none -z-0"></div>

      {/* Decorative Network Grid SVG */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
          <pattern id="grid-dots-testi" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="#12B8B0" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-dots-testi)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface border border-brand/30 shadow-lg shadow-brand/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-fill opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-fill"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-gold">
              {t.eyebrow}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight">
            {t.title}
            <span className="gold-gradient-text block mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold">
              {t.subtitle}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            {t.lead}
          </p>
        </div>

        {/* 4 Trust KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {TESTIMONIALS_METRICS.map((kpi) => (
            <div
              key={kpi.id}
              className="p-5 rounded-2xl bg-surface/80 border border-ink/10 hover:border-brand/40 backdrop-blur-md shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-black text-ink-strong group-hover:text-brand transition-colors">
                  {kpi.value}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand/15 text-brand text-[10px] font-bold">
                  {kpi.trend}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gold mb-1">
                {kpi.label}
              </h3>
              <p className="text-[11px] text-ink-dim leading-relaxed">
                {kpi.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Category Filter Pills & Review CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {[
              { id: 'all', label: t.tabs.all, count: testimonialsList.length },
              ...(['transport', 'cargo', 'business', 'legal', 'financial'] as const).map((id) => ({
                id,
                label: t.tabs[id],
                count: testimonialsList.filter((x) => x.category === id).length,
              })),
            ]
              .filter((tab) => tab.id === 'all' || tab.count > 0)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === tab.id
                      ? 'bg-brand-fill text-on-accent shadow-lg shadow-brand/25 scale-105'
                      : 'bg-surface text-ink-muted hover:text-ink-strong border border-ink/5 hover:border-ink/20'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === tab.id ? 'bg-canvas/30 text-on-accent' : 'bg-ink/10 text-ink-strong/70'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
          </div>

          {/* Submit Review Modal Trigger */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gold-deep/15 hover:bg-gold-deep/25 text-gold border border-gold-deep-line/40 hover:border-gold-line text-xs font-bold transition-all flex items-center gap-2 shrink-0 group shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-gold group-hover:rotate-90 transition-transform duration-300" />
            <span>{t.addReview}</span>
          </button>
        </div>

        {/* Featured Main Spotlight Bento Card */}
        <div
          className="relative rounded-3xl bg-surface/90 border border-brand/30 shadow-2xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Animated Auto-play Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-ink/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-fill to-gold-fill transition-all ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Watermark Quote Icon */}
          <Quote className="w-24 h-24 text-brand/10 absolute -top-4 -end-4 pointer-events-none rotate-180" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Right Side: Primary Review Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                {current.verifiedCode && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                    <span>{current.verifiedCode}</span>
                  </span>
                )}

                {current.originDestination && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-ink-muted text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{current.originDestination}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-deep/15 border border-gold-deep-line/30 text-gold text-xs font-bold">
                  {getCategoryIcon(current.category)}
                  <span>{current.categoryLabel || current.serviceUsed}</span>
                </span>
              </div>

              {/* Star Rating and Score */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold-deep" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gold">
                  {current.satisfactionScore || t.fullScore}
                </span>
                <span className="text-xs text-ink-dim border-s border-ink/10 ps-3 ms-1">
                  {fill(t.caseYear, { year: current.year })}
                </span>
              </div>

              {/* Key Outcome Headline */}
              {current.outcomeHeadline && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r ltr:bg-gradient-to-l from-brand-fill/15 to-transparent border-s-4 border-brand text-sm sm:text-base font-bold text-ink-strong">
                  {current.outcomeHeadline}
                </div>
              )}

              {/* Comment Content */}
              <blockquote className="text-base sm:text-lg text-ink leading-relaxed font-light min-h-[90px]">
                {t.quoteOpen}{current.comment}{t.quoteClose}
              </blockquote>

              {/* Author Info */}
              <div className="pt-4 border-t border-ink/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-fill to-surface p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-canvas flex items-center justify-center text-gold font-black text-sm">
                    {current.clientName.substring(0, 2)}
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-ink flex items-center gap-1.5">
                    <span>{current.clientName}</span>
                    <CheckCircle2 className="w-4 h-4 text-brand" />
                  </h4>
                  <span className="text-xs text-brand font-medium block mt-0.5">
                    {current.serviceUsed}
                  </span>
                  <span className="text-[11px] text-ink-dim block mt-0.5">
                    {current.routeOrContext}
                  </span>
                </div>
              </div>
            </div>

            {/* Left Side: Service Journey Milestones & Navigation Controls (4 cols) */}
            <div className="lg:col-span-4 space-y-5 lg:border-s lg:border-ink/10 lg:ps-6">
              {/* Journey Milestones Drawer */}
              <div className="p-4 rounded-2xl bg-canvas/80 border border-ink/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                    <span>{t.milestones}</span>
                  </span>
                  <button
                    onClick={() => setShowMilestones(!showMilestones)}
                    className="text-[11px] text-brand hover:underline"
                  >
                    {showMilestones ? t.hide : t.show}
                  </button>
                </div>

                {showMilestones && current.milestones && (
                  <div className="space-y-2.5 pt-1">
                    {current.milestones.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-start">
                        <div className="w-5 h-5 rounded-full bg-brand/20 text-brand text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink-strong">{step.title}</div>
                          <div className="text-[11px] text-ink-dim leading-tight mt-0.5">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slider Controls & Carousel Status */}
              <div className="p-4 rounded-2xl bg-canvas/60 border border-ink/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <span>{t.caseLabel}</span>
                    <span className="font-mono font-bold text-gold">
                      {currentIndex + 1}
                    </span>
                    <span>{t.of}</span>
                    <span className="font-mono text-ink-strong">
                      {filteredTestimonials.length}
                    </span>
                  </div>

                  {/* Play / Pause Toggle */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-ink/5 hover:bg-ink/10 text-ink-muted hover:text-ink-strong transition-colors"
                    title={isPlaying ? t.pause : t.play}
                    aria-label={isPlaying ? t.pause : t.play}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Prev / Next Chevrons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handlePrev}
                    className="flex-1 py-2.5 rounded-xl bg-surface border border-ink/10 hover:border-brand hover:text-brand text-ink-strong text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    aria-label={t.prevAria}
                  >
                    <ChevronRight className="w-4 h-4 ltr:-scale-x-100" />
                    <span>{t.prev}</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-fill to-[#087F7B] hover:brightness-110 text-on-accent text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-brand/20"
                    aria-label={t.nextAria}
                  >
                    <span>{t.next}</span>
                    <ChevronLeft className="w-4 h-4 ltr:-scale-x-100" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Selector Thumbnail Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredTestimonials.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => selectTestimonial(idx)}
              className={`p-3.5 rounded-2xl text-start transition-all duration-300 relative overflow-hidden ${
                currentIndex === idx
                  ? 'bg-surface border-2 border-brand shadow-lg shadow-brand/20 scale-[1.02]'
                  : 'bg-surface/40 border border-ink/5 hover:border-ink/20 hover:bg-surface/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-bold text-gold truncate max-w-[130px]">
                  {item.clientName.split(' ')[0]} {item.clientName.split(' ')[1] || ''}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gold font-bold">
                  <Star className="w-3 h-3 fill-gold text-gold-deep" />
                  <span>{t.thumbScore}</span>
                </span>
              </div>
              <p className="text-[11px] text-ink-muted line-clamp-1">
                {item.serviceUsed}
              </p>
              <span className="text-[10px] text-ink-dim block mt-1 truncate">
                {item.originDestination || item.routeOrContext}
              </span>
            </button>
          ))}
        </div>

        {/* Continuous Animated Marquee Ticker */}
        <div className="mt-14 pt-8 border-t border-ink/10 overflow-hidden relative">
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-fill animate-pulse"></span>
            <span className="text-xs font-bold text-gold">
              {t.marqueeTitle}
            </span>
          </div>

          {/* The ticker drifts against the reading direction: rightward in Persian, leftward in English and Turkish */}
          <div className="w-max ltr:-translate-x-1/2">
          <div className="animate-marquee-rtl ltr:[animation-direction:reverse] py-2">
            {[...MARQUEE_TRUST_QUOTES, ...MARQUEE_TRUST_QUOTES].map((quote, qIdx) => (
              <div
                key={qIdx}
                className="inline-flex items-center gap-3 px-5 py-2.5 mx-2 rounded-xl bg-surface/80 border border-ink/5 hover:border-brand/40 transition-colors text-xs text-ink whitespace-nowrap shadow-sm"
              >
                <Quote className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>{quote.replace(/[«»“”]/g, '')}</span>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Transparent Mock Notice as Required */}
        <div className="mt-8 text-center text-[11px] text-ink-dim leading-relaxed">
          {t.notice}
        </div>
      </div>

      {/* Review Submission Interactive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-surface border border-brand/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-start">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label={t.form.close}
              className="absolute top-5 end-5 p-2 rounded-full bg-ink/5 hover:bg-ink/10 text-ink-muted hover:text-ink-strong transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/15 text-brand text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.form.eyebrow}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-ink-strong">
                {t.form.title}
              </h3>
              <p className="text-xs text-ink-muted">
                {t.form.lead}
              </p>
            </div>

            {submissionSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-brand/20 text-brand flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-ink-strong">
                  {t.form.successTitle}
                </h4>
                <p className="text-xs text-ink-muted">
                  {t.form.successText}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gold mb-1.5">
                    {t.form.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.form.namePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-ink/10 text-ink-strong placeholder:text-ink-dim text-xs focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gold mb-1.5">
                      {t.form.service}
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-ink/10 text-ink-strong text-xs focus:outline-none focus:border-brand"
                    >
                      <option value="">{t.form.otherServices}</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gold mb-1.5">
                      {t.form.tracking}
                    </label>
                    <input
                      type="text"
                      value={formData.trackingCode}
                      onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                      placeholder={t.form.trackingPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-ink/10 text-ink-strong placeholder:text-ink-dim text-xs focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gold mb-1.5">
                    {t.form.rating}
                  </label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setFormData({ ...formData, rating: starVal })}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            formData.rating >= starVal
                              ? 'fill-gold text-gold-deep'
                              : 'text-ink-dim'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gold ms-2">
                      {fill(t.form.ratingValue, { rating: formData.rating })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gold mb-1.5">
                    {t.form.comment}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder={t.form.commentPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-ink/10 text-ink-strong placeholder:text-ink-dim text-xs focus:outline-none focus:border-brand resize-none"
                  ></textarea>
                </div>

                {reviewError && (
                  <p role="alert" className="text-xs leading-relaxed text-danger">
                    {reviewError}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 text-ink-muted text-xs font-bold transition-colors"
                  >
                    {t.form.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-fill to-[#087F7B] hover:brightness-110 disabled:opacity-70 disabled:cursor-wait text-on-accent text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-brand/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? t.form.sending : t.form.submit}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
