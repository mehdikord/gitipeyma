'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CloudSun, HelpCircle, MessageCircle, PhoneCall, ShieldCheck, Sun, Zap } from 'lucide-react';
import { COMPANY_CONFIG } from '../../data/company';
import { LINES } from '../../data/serviceGroups';
import { SERVICES_DATA } from '../../data/services';
import { CITIES, LonLat, ROAD_PATH, STAGE, project, roadFraction } from '../home/hero/geo';
import { telHref } from '../../utils/contact';
import { REQUEST_WHATSAPP_NUMBER, buildRequestMessage } from '../../utils/serviceRequest';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { RequestSent } from '../ui/RequestSent';
import { TextField } from '../ui/TextField';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';
const SUPPORT_PHONE = COMPANY_CONFIG.emergencySupportPhone;

const GENERAL_TOPIC = 'مشاوره عمومی';
const STEP_NAMES = ['موضوع', 'زمان تماس', 'اطلاعات تماس'];

const TIMES = [
  { value: 'صبح تا ظهر (۰۹:۰۰ تا ۱۴:۰۰)', title: 'صبح تا ظهر', hours: '۰۹:۰۰ تا ۱۴:۰۰', icon: Sun },
  { value: 'عصر (۱۴:۰۰ تا ۱۹:۰۰)', title: 'عصر', hours: '۱۴:۰۰ تا ۱۹:۰۰', icon: CloudSun },
  { value: 'فوری و در اولین فرصت', title: 'فوری', hours: 'در اولین فرصت', icon: Zap },
];

// Each finished step carries the route one stop further: three steps, Tehran to Europe.
const STOPS: { at: LonLat; name: string; above?: boolean }[] = [
  { at: CITIES.tehran, name: 'تهران' },
  { at: CITIES.bazargan, name: 'مرز بازرگان', above: true },
  { at: CITIES.istanbul, name: 'استانبول' },
  { at: CITIES.frankfurt, name: 'اروپا' },
];
const STOP_FRACTIONS = STOPS.map((stop) => roadFraction(stop.at));

// ---- The route that grows as the visitor moves through the form -----------------

const ProgressMap: React.FC<{ reached: number; bandRef: React.RefObject<HTMLDivElement | null> }> = ({ reached, bandRef }) => (
  <div ref={bandRef} aria-hidden="true" className="consult-band">
    <div className="consult-stage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/map.svg" alt="" width={STAGE.width} height={STAGE.height} className="hero-map-image map-soft-edges absolute inset-0 w-full h-full" />
      <svg viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} className="absolute inset-0 w-full h-full">
        <path d={ROAD_PATH} fill="none" stroke="#7FA2AA" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 14" />
        <path
          className="consult-route"
          d={ROAD_PATH}
          fill="none"
          stroke="#E2C98C"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{ strokeDashoffset: 1 - STOP_FRACTIONS[reached] }}
        />
      </svg>
      {STOPS.map((stop, index) => {
        const point = project(stop.at);
        return (
          <span
            key={stop.name}
            data-state={index === reached ? 'current' : index < reached ? 'passed' : 'ahead'}
            data-above={stop.above}
            className="consult-stop"
            style={{ left: `${(point.x / STAGE.width) * 100}%`, top: `${(point.y / STAGE.height) * 100}%` }}
          >
            <span className="consult-stop-dot" />
            <span className="consult-stop-name">{stop.name}</span>
          </span>
        );
      })}
    </div>
  </div>
);

// ---- Page ----------------------------------------------------------------------

export const ConsultationPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState({ fullName: false, phone: false });
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const bandRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const hasMoved = useRef(false);

  const nameCheck = validateFullName(fullName);
  const phoneCheck = validatePhoneNumber(phone);

  // Arriving from a service's "consult about this" link means the first step is already done
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service');
    const service = SERVICES_DATA.find((s) => s.slug === slug);
    if (service) {
      setTopic(service.shortTitle);
      setStep(1);
    }
  }, []);

  const goTo = (next: number) => {
    hasMoved.current = true;
    setStep(next);
  };

  // On phones the map sits above the form, so return to it: seeing the route move is the point
  const showProgress = () => {
    if (window.innerWidth < 1024) bandRef.current?.scrollIntoView({ block: 'start' });
  };

  // Moving between steps replaces the content, so keyboard and screen reader users go with it
  useEffect(() => {
    if (!hasMoved.current) return;
    headingRef.current?.focus({ preventScroll: true });
    showProgress();
  }, [step]);

  useEffect(() => {
    if (sentUrl) showProgress();
  }, [sentUrl]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();

    const text = buildRequestMessage({
      intro: 'سلام، درخواست مشاوره دارم.',
      answers: [
        { label: 'موضوع', value: topic },
        { label: 'زمان تماس', value: time },
      ].filter((answer) => answer.value),
      fullName,
      phone,
      details: notes,
    });
    const url = `https://wa.me/${REQUEST_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    setSentUrl(url);
  };

  const canReach = (index: number) => index === 0 || (index === 1 && Boolean(topic)) || (index === 2 && Boolean(topic && time));

  const topicButton = (value: string, label: string) => {
    const isSelected = topic === value;
    return (
      <button
        key={value}
        type="button"
        aria-pressed={isSelected}
        onClick={() => {
          setTopic(value);
          goTo(1);
        }}
        className={`inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-lg border text-sm font-bold text-right transition-colors ${FOCUS} ${
          isSelected ? 'bg-[#E2C98C] border-[#E2C98C] text-[#07191F]' : 'bg-[#0C252B] border-white/15 text-[#D5E0E3] hover:border-[#E2C98C]/70 hover:text-white'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="bg-[#07191F] text-[#F7F7F3]">
      <section className="relative isolate overflow-hidden lg:min-h-[calc(100svh-7rem)]">
        <ProgressMap reached={sentUrl ? 3 : step} bandRef={bandRef} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 lg:py-14 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 text-right">
            <h1 className={`${step > 0 || sentUrl ? 'sr-only lg:not-sr-only' : ''} mt-2 lg:mt-0 text-[1.9rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.3] text-[#F7F7F3] [text-wrap:balance]`}>برای دریافت مشاوره، اولین قدم را بردارید.</h1>
            <p className={`${step > 0 || sentUrl ? 'hidden lg:block' : ''} mt-4 max-w-2xl text-[15px] sm:text-lg leading-[1.95] text-[#C9D7DB]`}>
              اطلاعات تماس خود را وارد کنید تا کارشناسان گیتی پیما برای راهنمایی و بررسی درخواست شما با شما در ارتباط باشند.
            </p>

            {sentUrl ? (
              <div className="mt-8">
                <RequestSent url={sentUrl} onEdit={() => setSentUrl(null)} />
              </div>
            ) : (
              <>
                <ol className="mt-3 lg:mt-8 grid grid-cols-3 border-t border-white/15" aria-label="مراحل درخواست مشاوره">
                  {STEP_NAMES.map((name, index) => {
                    const isCurrent = index === step;
                    const isDone = canReach(index + 1) || (index === 0 && Boolean(topic));
                    const reachable = canReach(index);
                    return (
                      <li key={name} className="relative">
                        {isCurrent && <span aria-hidden="true" className="absolute -top-px inset-x-0 h-0.5 bg-[#E2C98C]" />}
                        <button
                          type="button"
                          disabled={!reachable}
                          aria-current={isCurrent ? 'step' : undefined}
                          onClick={() => goTo(index)}
                          className={`flex items-center gap-2 w-full min-h-12 py-2.5 pl-2 text-right text-[13px] sm:text-sm font-bold transition-colors rounded-b disabled:cursor-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C] ${
                            isCurrent ? 'text-white' : reachable ? 'text-[#D5E0E3] hover:text-white' : 'text-[#7F979E]'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                              isDone && !isCurrent ? 'bg-[#12B8B0] text-[#07191F]' : isCurrent ? 'bg-[#E2C98C] text-[#07191F]' : 'border border-white/25 text-[#A2B6BC]'
                            }`}
                          >
                            {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : (index + 1).toLocaleString('fa-IR')}
                          </span>
                          <span>{name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div key={step} className="sup-answer mt-6">
                  {step === 0 && (
                    <div>
                      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-black text-white outline-none">
                        درباره چه موضوعی مشاوره می‌خواهید؟
                      </h2>
                      <button
                        type="button"
                        aria-pressed={topic === GENERAL_TOPIC}
                        onClick={() => {
                          setTopic(GENERAL_TOPIC);
                          goTo(1);
                        }}
                        className={`group mt-4 w-full flex items-center gap-3 min-h-14 px-4 py-3 rounded-lg border text-right transition-colors ${FOCUS} ${
                          topic === GENERAL_TOPIC ? 'bg-[#E2C98C] border-[#E2C98C] text-[#07191F]' : 'border-[#E2C98C]/50 text-[#E2C98C] hover:bg-[#C6A15B]/10'
                        }`}
                      >
                        <HelpCircle aria-hidden="true" className="w-5 h-5 shrink-0" />
                        <span className="font-extrabold text-[15px]">هنوز نمی‌دانم؛ راهنمایی‌ام کنید</span>
                        <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-auto shrink-0 transition-transform group-hover:-translate-x-1" />
                      </button>
                      <div className="mt-5 space-y-4">
                        {LINES.map((line) => (
                          <div key={line.title}>
                            <h3 className={`mb-2 text-[13px] font-bold ${line.tone === 'teal' ? 'text-[#3ED0C8]' : 'text-[#E2C98C]'}`}>{line.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              {line.slugs.map((slug) => {
                                const service = SERVICES_DATA.find((s) => s.slug === slug);
                                return service ? topicButton(service.shortTitle, service.shortTitle) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-black text-white outline-none">
                        چه زمانی با شما تماس بگیریم؟
                      </h2>
                      <p className="mt-2 text-sm text-[#A2B6BC]">
                        موضوع: <span className="font-bold text-[#E2C98C]">{topic}</span>
                      </p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {TIMES.map((option) => {
                          const Icon = option.icon;
                          const isSelected = time === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => {
                                setTime(option.value);
                                goTo(2);
                              }}
                              className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 min-h-16 p-4 rounded-lg border text-right transition-colors ${FOCUS} ${
                                isSelected ? 'bg-[#E2C98C] border-[#E2C98C] text-[#07191F]' : 'bg-[#0C252B] border-white/15 text-white hover:border-[#E2C98C]/70'
                              }`}
                            >
                              <Icon aria-hidden="true" className={`w-5 h-5 shrink-0 ${isSelected ? '' : 'text-[#E2C98C]'}`} />
                              <span>
                                <span className="block font-extrabold text-[15px]">{option.title}</span>
                                <span className={`block mt-0.5 text-[13px] ${isSelected ? 'text-[#07191F]/75' : 'text-[#A2B6BC]'}`}>{option.hours}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo(0)}
                        className={`mt-4 inline-flex items-center gap-2 py-2 text-sm font-bold text-[#A2B6BC] hover:text-white transition-colors rounded ${FOCUS}`}
                      >
                        <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        <span>تغییر موضوع</span>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleSubmit} noValidate>
                      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-black text-white outline-none">
                        با چه نام و شماره‌ای تماس بگیریم؟
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#A2B6BC]">
                        موضوع: <span className="font-bold text-[#E2C98C]">{topic}</span>، زمان تماس: <span className="font-bold text-[#E2C98C]">{time}</span>
                      </p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <TextField
                          id="consult-fullname"
                          label="نام و نام خانوادگی"
                          value={fullName}
                          inputRef={nameRef}
                          autoComplete="name"
                          placeholder="مثال: محمد امینی"
                          valid={nameCheck.isValid}
                          error={touched.fullName ? nameCheck.error : undefined}
                          onChange={setFullName}
                          onBlur={() => setTouched((current) => ({ ...current, fullName: fullName !== '' || current.fullName }))}
                        />
                        <TextField
                          id="consult-phone"
                          label="شماره موبایل یا واتس‌اپ"
                          value={phone}
                          inputRef={phoneRef}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          ltr
                          valid={phoneCheck.isValid}
                          error={touched.phone ? phoneCheck.error : undefined}
                          onChange={setPhone}
                          onBlur={() => setTouched((current) => ({ ...current, phone: phone !== '' || current.phone }))}
                        />
                      </div>

                      <div className="mt-5">
                        <label htmlFor="consult-notes" className="block mb-2 text-sm font-bold text-[#F7F7F3]">
                          توضیحات <span className="font-normal text-[#A2B6BC]">(اختیاری)</span>
                        </label>
                        <textarea
                          id="consult-notes"
                          rows={3}
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder="خلاصه‌ای از شرایط پرونده، حجم بار یا زمان سفر."
                          className="w-full px-4 py-3.5 rounded-lg bg-[#0C252B] border border-white/15 hover:border-white/30 text-base leading-relaxed text-white placeholder:text-[#7F979E] outline-none transition-colors resize-none focus:border-[#E2C98C] focus:ring-1 focus:ring-[#E2C98C]"
                        />
                      </div>

                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="submit"
                          className={`inline-flex items-center justify-center gap-2.5 min-h-14 px-8 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-black text-base transition-colors ${FOCUS}`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>ارسال درخواست در واتس‌اپ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => goTo(1)}
                          className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-bold text-[#A2B6BC] hover:text-white transition-colors rounded ${FOCUS}`}
                        >
                          <ArrowRight aria-hidden="true" className="w-4 h-4" />
                          <span>تغییر زمان تماس</span>
                        </button>
                      </div>
                      <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-[#A2B6BC]">
                        <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-[#12B8B0]" />
                        <span>اطلاعات شما محرمانه می‌ماند و فقط برای تماس کارشناس استفاده می‌شود.</span>
                      </p>
                    </form>
                  )}
                </div>
              </>
            )}

            {/* For anyone who can't wait for a call back */}
            <a
              href={telHref(SUPPORT_PHONE)}
              className={`mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 pt-5 border-t border-white/10 text-sm text-[#A2B6BC] hover:text-white transition-colors ${FOCUS}`}
            >
              <PhoneCall aria-hidden="true" className="w-4 h-4 text-[#12B8B0]" />
              <span>کارتان فوری است؟ پشتیبانی شبانه‌روزی:</span>
              <span dir="ltr" className="font-bold text-[#F7F7F3] whitespace-nowrap">
                {SUPPORT_PHONE}
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
