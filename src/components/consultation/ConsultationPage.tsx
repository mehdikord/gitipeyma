'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, CloudSun, HelpCircle, PhoneCall, Send, ShieldCheck, Sun, Zap } from 'lucide-react';
import type { ServiceGroupItem } from '../../types';
import { CITIES, LonLat, ROAD_PATH, STAGE, project, roadFraction } from '../home/hero/geo';
import { telHref } from '../../utils/contact';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { CALL_TIMES, CallTimeKey, callTimeLabel, callTimeText } from '../../modules/consultations/callTimes';
import { submitConsultationRequest } from '../../modules/site/actions';
import { RequestReceived } from '../ui/RequestReceived';
import { TextField } from '../ui/TextField';
import { useSite } from '../site/SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

const TIME_ICONS: Record<CallTimeKey, React.ElementType> = { morning: Sun, afternoon: CloudSun, asap: Zap };
const TIMES = CALL_TIMES.map((time) => ({ value: time.key, icon: TIME_ICONS[time.key] }));

type TopicService = { id: number; slug: string; shortTitle: string };

// Each finished step carries the route one stop further: three steps, Tehran to Istanbul.
const STOPS: { at: LonLat; name: 'tehran' | 'bazargan' | 'ankara' | 'istanbul'; above?: boolean }[] = [
  { at: CITIES.tehran, name: 'tehran' },
  { at: CITIES.bazargan, name: 'bazargan', above: true },
  { at: CITIES.ankara, name: 'ankara', above: true },
  { at: CITIES.istanbul, name: 'istanbul' },
];
const STOP_FRACTIONS = STOPS.map((stop) => roadFraction(stop.at));

// ---- The route that grows as the visitor moves through the form -----------------

const ProgressMap: React.FC<{ reached: number; bandRef: React.RefObject<HTMLDivElement | null> }> = ({ reached, bandRef }) => {
  const names = useI18n().t.consultation.stops;
  // On desktop the map sits beside the text: on the left in Persian, on the right in English and Turkish
  return (
    <div
      ref={bandRef}
      aria-hidden="true"
      className="consult-band lg:ltr:left-auto! lg:ltr:right-0! lg:ltr:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_12%)]! lg:ltr:[mask-image:linear-gradient(to_right,transparent,#000_12%)]!"
    >
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
              <span className="consult-stop-name">{names[stop.name]}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---- Page ----------------------------------------------------------------------

export const ConsultationPage: React.FC<{ services: TopicService[]; groups: ServiceGroupItem[] }> = ({ services, groups }) => {
  const SUPPORT_PHONE = useSite().settings.support_phone;
  const { t: { consultation: t }, locale, num, fill } = useI18n();
  const GENERAL_TOPIC = t.generalTopic;
  const [step, setStep] = useState(0);
  // The topic as shown, and the service it is about (null for general guidance).
  const [topic, setTopic] = useState('');
  const [topicServiceId, setTopicServiceId] = useState<number | null>(null);
  const [time, setTime] = useState<CallTimeKey | ''>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState({ fullName: false, phone: false });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<number | null>(null);
  const [isSubmitting, startSubmit] = useTransition();

  const bandRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const hasMoved = useRef(false);

  const nameCheck = validateFullName(fullName, locale);
  const phoneCheck = validatePhoneNumber(phone, locale);

  // Arriving from a service's "consult about this" link means the first step is already done
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service');
    const service = services.find((s) => s.slug === slug);
    if (service) {
      setTopic(service.shortTitle);
      setTopicServiceId(service.id);
      setStep(1);
    }
  }, [services]);

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
    if (reference) showProgress();
  }, [reference]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();

    if (!time) return goTo(1);

    startSubmit(async () => {
      const result = await submitConsultationRequest({ serviceId: topicServiceId, callTime: time, name: fullName, phone, description: notes }, locale);
      if (result.ok) {
        setReference(result.data!.reference);
        setServerErrors({});
        setFormError(null);
      } else {
        setServerErrors(result.errors ?? {});
        setFormError(result.message ?? null);
      }
    });
  };

  const startOver = () => {
    setReference(null);
    setTopic('');
    setTopicServiceId(null);
    setTime('');
    setNotes('');
    hasMoved.current = true;
    setStep(0);
  };

  const canReach = (index: number) => index === 0 || (index === 1 && Boolean(topic)) || (index === 2 && Boolean(topic && time));

  const topicButton = (service: TopicService) => {
    const isSelected = topicServiceId === service.id;
    return (
      <button
        key={service.id}
        type="button"
        aria-pressed={isSelected}
        onClick={() => {
          setTopic(service.shortTitle);
          setTopicServiceId(service.id);
          goTo(1);
        }}
        className={`inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-lg border text-sm font-bold text-start transition-colors ${FOCUS} ${
          isSelected ? 'bg-gold-fill border-gold-line text-on-accent' : 'bg-surface border-ink/15 text-ink-soft hover:border-gold-line/70 hover:text-ink-strong'
        }`}
      >
        {service.shortTitle}
      </button>
    );
  };

  return (
    <main className="bg-canvas text-ink">
      <section className="relative isolate overflow-hidden lg:min-h-[calc(100svh-7rem)]">
        <ProgressMap reached={reference ? 3 : step} bandRef={bandRef} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 lg:py-14 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 text-start lg:ltr:col-start-6">
            <h1 className={`${step > 0 || reference ? 'sr-only lg:not-sr-only' : ''} mt-2 lg:mt-0 text-[1.9rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.3] text-ink [text-wrap:balance]`}>{t.title}</h1>
            <p className={`${step > 0 || reference ? 'hidden lg:block' : ''} mt-4 max-w-2xl text-[15px] sm:text-lg leading-[1.95] text-ink-soft`}>
              {t.intro}
            </p>

            {reference ? (
              <div className="mt-8">
                <RequestReceived
                  reference={reference}
                  title={t.receivedTitle}
                  text={fill(t.receivedText, { time: callTimeText(time, locale) })}
                  onReset={startOver}
                  resetLabel={t.another}
                />
              </div>
            ) : (
              <>
                <ol className="mt-3 lg:mt-8 grid grid-cols-3 border-t border-ink/15" aria-label={t.stepsAria}>
                  {t.steps.map((name, index) => {
                    const isCurrent = index === step;
                    const isDone = canReach(index + 1) || (index === 0 && Boolean(topic));
                    const reachable = canReach(index);
                    return (
                      <li key={name} className="relative">
                        {isCurrent && <span aria-hidden="true" className="absolute -top-px inset-x-0 h-0.5 bg-gold-fill" />}
                        <button
                          type="button"
                          disabled={!reachable}
                          aria-current={isCurrent ? 'step' : undefined}
                          onClick={() => goTo(index)}
                          className={`flex items-center gap-2 w-full min-h-12 py-2.5 pe-2 text-start text-[13px] sm:text-sm font-bold transition-colors rounded-b disabled:cursor-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-line ${
                            isCurrent ? 'text-ink-strong' : reachable ? 'text-ink-soft hover:text-ink-strong' : 'text-ink-dim'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                              isDone && !isCurrent ? 'bg-brand-fill text-on-accent' : isCurrent ? 'bg-gold-fill text-on-accent' : 'border border-ink/25 text-ink-muted'
                            }`}
                          >
                            {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : num(index + 1)}
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
                      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-black text-ink-strong outline-none">
                        {t.topicQuestion}
                      </h2>
                      <button
                        type="button"
                        aria-pressed={topic === GENERAL_TOPIC}
                        onClick={() => {
                          setTopic(GENERAL_TOPIC);
                          setTopicServiceId(null);
                          goTo(1);
                        }}
                        className={`group mt-4 w-full flex items-center gap-3 min-h-14 px-4 py-3 rounded-lg border text-start transition-colors ${FOCUS} ${
                          topic === GENERAL_TOPIC ? 'bg-gold-fill border-gold-line text-on-accent' : 'border-gold-line/50 text-gold hover:bg-gold-deep/10'
                        }`}
                      >
                        <HelpCircle aria-hidden="true" className="w-5 h-5 shrink-0" />
                        <span className="font-extrabold text-[15px]">{t.notSure}</span>
                        <ArrowLeft aria-hidden="true" className="w-4 h-4 ms-auto shrink-0 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
                      </button>
                      <div className="mt-5 space-y-4">
                        {groups.map((line) => (
                          <div key={line.id}>
                            <h3 className={`mb-2 text-[13px] font-bold ${line.tone === 'teal' ? 'text-brand-bright' : 'text-gold'}`}>{line.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              {line.slugs.map((slug) => {
                                const service = services.find((s) => s.slug === slug);
                                return service ? topicButton(service) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-black text-ink-strong outline-none">
                        {t.timeQuestion}
                      </h2>
                      <p className="mt-2 text-sm text-ink-muted">
                        {t.topicLabel} <span className="font-bold text-gold">{topic}</span>
                      </p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {TIMES.map((option) => {
                          const Icon = option.icon;
                          const isSelected = time === option.value;
                          const label = callTimeLabel(option.value, locale);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => {
                                setTime(option.value);
                                goTo(2);
                              }}
                              className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 min-h-16 p-4 rounded-lg border text-start transition-colors ${FOCUS} ${
                                isSelected ? 'bg-gold-fill border-gold-line text-on-accent' : 'bg-surface border-ink/15 text-ink-strong hover:border-gold-line/70'
                              }`}
                            >
                              <Icon aria-hidden="true" className={`w-5 h-5 shrink-0 ${isSelected ? '' : 'text-gold'}`} />
                              <span>
                                <span className="block font-extrabold text-[15px]">{label.title}</span>
                                <span className={`block mt-0.5 text-[13px] ${isSelected ? 'text-on-accent/75' : 'text-ink-muted'}`}>{label.hours}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo(0)}
                        className={`mt-4 inline-flex items-center gap-2 py-2 text-sm font-bold text-ink-muted hover:text-ink-strong transition-colors rounded ${FOCUS}`}
                      >
                        <ArrowRight aria-hidden="true" className="w-4 h-4 ltr:rotate-180" />
                        <span>{t.changeTopic}</span>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleSubmit} noValidate>
                      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-black text-ink-strong outline-none">
                        {t.contactQuestion}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {t.topicLabel} <span className="font-bold text-gold">{topic}</span>
                        {t.separator} {t.timeLabel} <span className="font-bold text-gold">{time && callTimeText(time, locale)}</span>
                      </p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <TextField
                          id="consult-fullname"
                          label={t.name}
                          value={fullName}
                          inputRef={nameRef}
                          autoComplete="name"
                          placeholder={t.namePlaceholder}
                          valid={nameCheck.isValid}
                          error={touched.fullName ? nameCheck.error ?? serverErrors.name : undefined}
                          onChange={setFullName}
                          onBlur={() => setTouched((current) => ({ ...current, fullName: fullName !== '' || current.fullName }))}
                        />
                        <TextField
                          id="consult-phone"
                          label={t.phone}
                          value={phone}
                          inputRef={phoneRef}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={t.phonePlaceholder}
                          ltr
                          valid={phoneCheck.isValid}
                          error={touched.phone ? phoneCheck.error ?? serverErrors.phone : undefined}
                          onChange={setPhone}
                          onBlur={() => setTouched((current) => ({ ...current, phone: phone !== '' || current.phone }))}
                        />
                      </div>

                      <div className="mt-5">
                        <label htmlFor="consult-notes" className="block mb-2 text-sm font-bold text-ink">
                          {t.notes} <span className="font-normal text-ink-muted">{t.optional}</span>
                        </label>
                        <textarea
                          id="consult-notes"
                          rows={3}
                          value={notes}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder={t.notesPlaceholder}
                          className="w-full px-4 py-3.5 rounded-lg bg-surface border border-ink/15 hover:border-ink/30 text-base leading-relaxed text-ink-strong placeholder:text-ink-dim outline-none transition-colors resize-none focus:border-gold-line focus:ring-1 focus:ring-gold-line"
                        />
                      </div>

                      {formError && (
                        <p role="alert" className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-danger">
                          <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{serverErrors.description ?? formError}</span>
                        </p>
                      )}

                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`inline-flex items-center justify-center gap-2.5 min-h-14 px-8 rounded-lg bg-brand-fill hover:bg-brand-bright-fill disabled:opacity-70 disabled:cursor-wait text-on-accent font-black text-base transition-colors ${FOCUS}`}
                        >
                          <Send className="w-5 h-5" />
                          <span>{isSubmitting ? t.submitting : t.submit}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => goTo(1)}
                          className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-bold text-ink-muted hover:text-ink-strong transition-colors rounded ${FOCUS}`}
                        >
                          <ArrowRight aria-hidden="true" className="w-4 h-4 ltr:rotate-180" />
                          <span>{t.changeTime}</span>
                        </button>
                      </div>
                      <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
                        <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                        <span>{t.privacy}</span>
                      </p>
                    </form>
                  )}
                </div>
              </>
            )}

            {/* For anyone who can't wait for a call back */}
            <a
              href={telHref(SUPPORT_PHONE)}
              className={`mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 pt-5 border-t border-ink/10 text-sm text-ink-muted hover:text-ink-strong transition-colors ${FOCUS}`}
            >
              <PhoneCall aria-hidden="true" className="w-4 h-4 text-brand" />
              <span>{t.urgent}</span>
              <span dir="ltr" className="font-bold text-ink whitespace-nowrap">
                {SUPPORT_PHONE}
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
