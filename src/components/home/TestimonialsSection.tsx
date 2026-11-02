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
      });
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
        return <Truck className="w-4 h-4 text-[#12B8B0]" />;
      case 'cargo':
        return <Building className="w-4 h-4 text-[#C6A15B]" />;
      case 'business':
        return <FileCheck2 className="w-4 h-4 text-[#12B8B0]" />;
      case 'financial':
        return <Coins className="w-4 h-4 text-[#E2C98C]" />;
      default:
        return <Globe2 className="w-4 h-4 text-[#12B8B0]" />;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#07191F] via-[#092128] to-[#051318] text-[#F7F7F3] border-b border-white/10 relative overflow-hidden">
      {/* Dynamic Animated Ambient Orbs */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-[#12B8B0]/10 rounded-full blur-[160px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#C6A15B]/10 rounded-full blur-[170px] pointer-events-none -z-0"></div>

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
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C252B] border border-[#12B8B0]/30 shadow-lg shadow-[#12B8B0]/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B8B0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12B8B0]"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-[#E2C98C]">
              CLIENT SATISFACTION INDEX | شاخص اعتماد بین‌المللی
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F7F7F3] tracking-tight">
            بازتاب اعتماد و همراهی
            <span className="gold-gradient-text block mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold">
              روایت تجربه‌های واقعی در پهنه تجارت و ترانزیت فرامرزی
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#A2B6BC] leading-relaxed">
            مستندات و بازخوردهای مراجعان رسمی از سه دفتر مرکزی در استانبول (آکسارای)، تهران (آزادی و بیهقی) و تبریز؛ اعتمادی که در طول سال‌ها استمرار یافته است.
          </p>
        </div>

        {/* 4 Trust KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {TESTIMONIALS_METRICS.map((kpi) => (
            <div
              key={kpi.id}
              className="p-5 rounded-2xl bg-[#0C252B]/80 border border-white/10 hover:border-[#12B8B0]/40 backdrop-blur-md shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#12B8B0] transition-colors">
                  {kpi.value}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#12B8B0]/15 text-[#12B8B0] text-[10px] font-bold">
                  {kpi.trend}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#E2C98C] mb-1">
                {kpi.label}
              </h3>
              <p className="text-[11px] text-[#718085] leading-relaxed">
                {kpi.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Category Filter Pills & Review CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {[
              { id: 'all', label: 'همه بازخوردها', count: testimonialsList.length },
              { id: 'transport', label: 'اتوبوس VIP استانبول', count: testimonialsList.filter((x) => x.category === 'transport').length },
              { id: 'cargo', label: 'کارگو و گمرک', count: testimonialsList.filter((x) => x.category === 'cargo').length },
              { id: 'business', label: 'ثبت شرکت و بانک', count: testimonialsList.filter((x) => x.category === 'business').length },
              { id: 'legal', label: 'عقد بین‌المللی و حقوقی', count: testimonialsList.filter((x) => x.category === 'legal').length },
              { id: 'financial', label: 'حوالجات سوئیفت', count: testimonialsList.filter((x) => x.category === 'financial').length },
            ]
              .filter((tab) => tab.id === 'all' || tab.count > 0)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === tab.id
                      ? 'bg-[#12B8B0] text-[#07191F] shadow-lg shadow-[#12B8B0]/25 scale-105'
                      : 'bg-[#0C252B] text-[#A2B6BC] hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === tab.id ? 'bg-[#07191F]/30 text-[#07191F]' : 'bg-white/10 text-white/70'
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
            className="px-4 py-2 rounded-xl bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 text-[#E2C98C] border border-[#C6A15B]/40 hover:border-[#E2C98C] text-xs font-bold transition-all flex items-center gap-2 shrink-0 group shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-[#E2C98C] group-hover:rotate-90 transition-transform duration-300" />
            <span>ثبت تجربه همکاری شما</span>
          </button>
        </div>

        {/* Featured Main Spotlight Bento Card */}
        <div
          className="relative rounded-3xl bg-[#0C252B]/90 border border-[#12B8B0]/30 shadow-2xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Animated Auto-play Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#12B8B0] to-[#E2C98C] transition-all ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Watermark Quote Icon */}
          <Quote className="w-24 h-24 text-[#12B8B0]/10 absolute -top-4 -left-4 pointer-events-none rotate-180" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Right Side: Primary Review Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                {current.verifiedCode && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12B8B0]/15 border border-[#12B8B0]/30 text-[#12B8B0] text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#12B8B0]" />
                    <span>{current.verifiedCode}</span>
                  </span>
                )}

                {current.originDestination && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#A2B6BC] text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#E2C98C]" />
                    <span>{current.originDestination}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#E2C98C] text-xs font-bold">
                  {getCategoryIcon(current.category)}
                  <span>{current.categoryLabel || current.serviceUsed}</span>
                </span>
              </div>

              {/* Star Rating and Score */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#E2C98C] text-[#C6A15B]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#E2C98C]">
                  {current.satisfactionScore || '۵.۰ / ۵.۰'}
                </span>
                <span className="text-xs text-[#718085] border-r border-white/10 pr-3 mr-1">
                  ثبت پرونده: سال {current.year}
                </span>
              </div>

              {/* Key Outcome Headline */}
              {current.outcomeHeadline && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#12B8B0]/15 to-transparent border-r-4 border-[#12B8B0] text-sm sm:text-base font-bold text-white">
                  {current.outcomeHeadline}
                </div>
              )}

              {/* Comment Content */}
              <blockquote className="text-base sm:text-lg text-[#F7F7F3] leading-relaxed font-light min-h-[90px]">
                «{current.comment}»
              </blockquote>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#12B8B0] to-[#0C252B] p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-[#07191F] flex items-center justify-center text-[#E2C98C] font-black text-sm">
                    {current.clientName.substring(0, 2)}
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F7F7F3] flex items-center gap-1.5">
                    <span>{current.clientName}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#12B8B0]" />
                  </h4>
                  <span className="text-xs text-[#12B8B0] font-medium block mt-0.5">
                    {current.serviceUsed}
                  </span>
                  <span className="text-[11px] text-[#718085] block mt-0.5">
                    {current.routeOrContext}
                  </span>
                </div>
              </div>
            </div>

            {/* Left Side: Service Journey Milestones & Navigation Controls (4 cols) */}
            <div className="lg:col-span-4 space-y-5 lg:border-r lg:border-white/10 lg:pr-6">
              {/* Journey Milestones Drawer */}
              <div className="p-4 rounded-2xl bg-[#07191F]/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E2C98C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#12B8B0]" />
                    <span>مراحل اجرایی پرونده در گیتی پیما</span>
                  </span>
                  <button
                    onClick={() => setShowMilestones(!showMilestones)}
                    className="text-[11px] text-[#12B8B0] hover:underline"
                  >
                    {showMilestones ? 'بستن' : 'نمایش'}
                  </button>
                </div>

                {showMilestones && current.milestones && (
                  <div className="space-y-2.5 pt-1">
                    {current.milestones.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-right">
                        <div className="w-5 h-5 rounded-full bg-[#12B8B0]/20 text-[#12B8B0] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{step.title}</div>
                          <div className="text-[11px] text-[#718085] leading-tight mt-0.5">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slider Controls & Carousel Status */}
              <div className="p-4 rounded-2xl bg-[#07191F]/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#A2B6BC]">
                    <span>پرونده</span>
                    <span className="font-mono font-bold text-[#E2C98C]">
                      {currentIndex + 1}
                    </span>
                    <span>از</span>
                    <span className="font-mono text-white">
                      {filteredTestimonials.length}
                    </span>
                  </div>

                  {/* Play / Pause Toggle */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A2B6BC] hover:text-white transition-colors"
                    title={isPlaying ? 'توقف موقت چرخش خودکار' : 'شروع مجدد چرخش خودکار'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Prev / Next Chevrons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handlePrev}
                    className="flex-1 py-2.5 rounded-xl bg-[#0C252B] border border-white/10 hover:border-[#12B8B0] hover:text-[#12B8B0] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    aria-label="نظر قبلی"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>تجربه قبلی</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#12B8B0] to-[#087F7B] hover:brightness-110 text-[#07191F] text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-[#12B8B0]/20"
                    aria-label="نظر بعدی"
                  >
                    <span>تجربه بعدی</span>
                    <ChevronLeft className="w-4 h-4" />
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
              className={`p-3.5 rounded-2xl text-right transition-all duration-300 relative overflow-hidden ${
                currentIndex === idx
                  ? 'bg-[#0C252B] border-2 border-[#12B8B0] shadow-lg shadow-[#12B8B0]/20 scale-[1.02]'
                  : 'bg-[#0C252B]/40 border border-white/5 hover:border-white/20 hover:bg-[#0C252B]/70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-bold text-[#E2C98C] truncate max-w-[130px]">
                  {item.clientName.split(' ')[0]} {item.clientName.split(' ')[1] || ''}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#E2C98C] font-bold">
                  <Star className="w-3 h-3 fill-[#E2C98C] text-[#C6A15B]" />
                  <span>۵.۰</span>
                </span>
              </div>
              <p className="text-[11px] text-[#A2B6BC] line-clamp-1">
                {item.serviceUsed}
              </p>
              <span className="text-[10px] text-[#718085] block mt-1 truncate">
                {item.originDestination || item.routeOrContext}
              </span>
            </button>
          ))}
        </div>

        {/* Continuous Animated Marquee Ticker */}
        <div className="mt-14 pt-8 border-t border-white/10 overflow-hidden relative">
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#07191F] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#07191F] to-transparent z-10 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#12B8B0] animate-pulse"></span>
            <span className="text-xs font-bold text-[#E2C98C]">
              مرور لحظه‌ای گزیده دیدگاه‌های ثبت‌شده در پایانه آکسارای استانبول و شعب گمرکی
            </span>
          </div>

          <div className="animate-marquee-rtl py-2">
            {[...MARQUEE_TRUST_QUOTES, ...MARQUEE_TRUST_QUOTES].map((quote, qIdx) => (
              <div
                key={qIdx}
                className="inline-flex items-center gap-3 px-5 py-2.5 mx-2 rounded-xl bg-[#0C252B]/80 border border-white/5 hover:border-[#12B8B0]/40 transition-colors text-xs text-[#F7F7F3] whitespace-nowrap shadow-sm"
              >
                <Quote className="w-3.5 h-3.5 text-[#12B8B0] shrink-0" />
                <span>{quote.replace(/[«»]/g, '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transparent Mock Notice as Required */}
        <div className="mt-8 text-center text-[11px] text-[#718085] leading-relaxed">
          * بازخوردهای فوق گزیده‌ای مستند از مراجعان حقیقی خطوط VIP، خدمات گمرکی و اداری گیتی پیما است. با ثبت نظر در فرم بالا، تجربه شما به این پورتال افزوده خواهد شد.
        </div>
      </div>

      {/* Review Submission Interactive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0C252B] border border-[#12B8B0]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-right">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A2B6BC] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12B8B0]/15 text-[#12B8B0] text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>باشگاه مشتریان گیتی پیما</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ثبت تجربه همکاری یا سفر شما
              </h3>
              <p className="text-xs text-[#A2B6BC]">
                دیدگاه شما پس از ارزیابی کیفی، در بخش بازتاب اعتماد و همراهی نمایش داده خواهد شد.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#12B8B0]/20 text-[#12B8B0] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  با سپاس، نظر شما با موفقیت ثبت شد!
                </h4>
                <p className="text-xs text-[#A2B6BC]">
                  تجربه شما پس از بررسی کارشناسان گیتی پیما در این بخش نمایش داده می‌شود.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#E2C98C] mb-1.5">
                    نام و نام خانوادگی یا عنوان شرکت *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: مهندس رامین خسروی (صنایع الکترونیک)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#07191F] border border-white/10 text-white placeholder:text-[#718085] text-xs focus:outline-none focus:border-[#12B8B0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#E2C98C] mb-1.5">
                      نوع خدمت دریافتی *
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#07191F] border border-white/10 text-white text-xs focus:outline-none focus:border-[#12B8B0]"
                    >
                      <option value="">سایر خدمات</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#E2C98C] mb-1.5">
                      شماره بلیت یا بارنامه CMR (اختیاری)
                    </label>
                    <input
                      type="text"
                      value={formData.trackingCode}
                      onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                      placeholder="مثال: CMR-9820 یا بلیت GT-110"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#07191F] border border-white/10 text-white placeholder:text-[#718085] text-xs focus:outline-none focus:border-[#12B8B0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E2C98C] mb-1.5">
                    امتیاز شما به کیفیت خدمات
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
                              ? 'fill-[#E2C98C] text-[#C6A15B]'
                              : 'text-[#718085]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#E2C98C] mr-2">
                      ({formData.rating} از ۵ ستاره)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E2C98C] mb-1.5">
                    متن تجربه و میزان رضایت شما *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="لطفاً جزییات تجربه سفر یا ترخیص و همکاری خود با گیتی پیما را بنویسید..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#07191F] border border-white/10 text-white placeholder:text-[#718085] text-xs focus:outline-none focus:border-[#12B8B0] resize-none"
                  ></textarea>
                </div>

                {reviewError && (
                  <p role="alert" className="text-xs leading-relaxed text-[#F58B8B]">
                    {reviewError}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A2B6BC] text-xs font-bold transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#12B8B0] to-[#087F7B] hover:brightness-110 disabled:opacity-70 disabled:cursor-wait text-[#07191F] text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#12B8B0]/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'در حال ثبت...' : 'ثبت بازخورد'}</span>
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
