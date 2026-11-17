'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { AlertCircle, PhoneCall, Plane, Send, ShieldCheck, X } from 'lucide-react';
import { CITIES, LonLat, ROAD_PATH, STAGE, project, roadFraction } from '../home/hero/geo';
import { telHref } from '../../utils/contact';
import { validateFullName, validateMessage, validatePhoneNumber } from '../../utils/validation';
import { submitConsultationRequest } from '../../modules/site/actions';
import { RequestReceived } from '../ui/RequestReceived';
import { TextField } from '../ui/TextField';
import { useSite } from '../site/SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';
const MESSAGE_MAX = 3000;

type TopicService = { id: number; slug: string; shortTitle: string };

// Every field that is filled in carries the route one stop further: three fields, Tehran to Istanbul.
const STOPS: { at: LonLat; name: 'tehran' | 'bazargan' | 'ankara' | 'istanbul'; above?: boolean }[] = [
  { at: CITIES.tehran, name: 'tehran', above: true },
  { at: CITIES.bazargan, name: 'bazargan', above: true },
  { at: CITIES.ankara, name: 'ankara', above: true },
  { at: CITIES.istanbul, name: 'istanbul', above: true },
];
const STOP_FRACTIONS = STOPS.map((stop) => roadFraction(stop.at));
const LEGS = STOPS.length - 1;

// ---- The map the form is docked under ----------------------------------------------

const RouteMap: React.FC<{ reached: number; arrived: boolean }> = ({ reached, arrived }) => {
  const names = useI18n().t.consultation.stops;
  return (
    <div aria-hidden="true" data-arrived={arrived} className="consult-band">
      <div className="consult-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/map.svg" alt="" width={STAGE.width} height={STAGE.height} className="hero-map-image absolute inset-0 w-full h-full" />
        <svg viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} className="absolute inset-0 w-full h-full overflow-visible">
          <path d={ROAD_PATH} className="consult-road" />
          <path d={ROAD_PATH} className="consult-route-glow" pathLength={1} style={{ strokeDashoffset: 1 - STOP_FRACTIONS[reached] }} />
          <path d={ROAD_PATH} className="consult-route" pathLength={1} style={{ strokeDashoffset: 1 - STOP_FRACTIONS[reached] }} />
        </svg>
        {STOPS.map((stop, index) => {
          const point = project(stop.at);
          return (
            <span
              key={stop.name}
              data-state={arrived || index < reached ? 'passed' : index === reached ? 'current' : 'ahead'}
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

// ---- The same journey in small, at the top of the card where the visitor is typing ----

const TicketRoute: React.FC<{ done: number }> = ({ done }) => {
  const { t: { consultation: t }, num, fill } = useI18n();
  const percent = (done / LEGS) * 100;
  const count = fill(t.routeCount, { done: num(done), total: num(LEGS) });
  return (
    <div role="img" aria-label={`${t.routeAria}: ${count}`} className="flex items-center gap-3 sm:gap-4">
      <span className="flex items-center gap-2 text-sm font-extrabold text-ink-strong">
        <span className="w-2.5 h-2.5 rounded-full bg-gold-fill ring-4 ring-gold-line/20" />
        {t.routeFrom}
      </span>
      <span className="relative flex-1 h-8">
        <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-ink/20" />
        <span className="consult-ticket-fill absolute start-0 top-1/2 -mt-px h-0.5 rounded-full" style={{ width: `${percent}%` }} />
        <span className="consult-ticket-plane absolute top-1/2 -translate-y-1/2 ltr:-scale-x-100" style={{ insetInlineStart: `calc(${percent}% - ${(percent / 100) * 1.5}rem)` }}>
          <Plane className="w-6 h-6 rotate-45 text-gold fill-gold/25" strokeWidth={1.75} />
        </span>
      </span>
      <span className="flex items-center gap-2 text-sm font-extrabold text-ink-muted data-[done=true]:text-ink-strong" data-done={done === LEGS}>
        {t.routeTo}
        <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${done === LEGS ? 'bg-gold-fill ring-4 ring-gold-line/20' : 'border-2 border-ink/30'}`} />
      </span>
      <span className="hidden sm:inline-flex shrink-0 items-center px-2.5 py-1 rounded-full bg-ink/5 text-xs font-bold tabular-nums text-ink-muted">{count}</span>
    </div>
  );
};

// ---- Page ----------------------------------------------------------------------

export const ConsultationPage: React.FC<{ services: TopicService[] }> = ({ services }) => {
  const SUPPORT_PHONE = useSite().settings.support_phone;
  const { t: { consultation: t }, locale, num } = useI18n();
  // Set only when the visitor came from a service's "consult about this" link
  const [service, setService] = useState<TopicService | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({ fullName: false, phone: false, message: false });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<number | null>(null);
  const [isSubmitting, startSubmit] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const nameCheck = validateFullName(fullName, locale);
  const phoneCheck = validatePhoneNumber(phone, locale);
  const messageCheck = validateMessage(message, true, locale);
  const messageError = touched.message ? messageCheck.error ?? serverErrors.message : undefined;
  const done = reference ? LEGS : [nameCheck.isValid, phoneCheck.isValid, messageCheck.isValid].filter(Boolean).length;

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service');
    setService(services.find((s) => s.slug === slug) ?? null);
  }, [services]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true, message: true });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();
    if (!messageCheck.isValid) return messageRef.current?.focus();

    startSubmit(async () => {
      const result = await submitConsultationRequest({ serviceId: service?.id ?? null, name: fullName, phone, message }, locale);
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
    setMessage('');
    setTouched({ fullName: false, phone: false, message: false });
  };

  return (
    <main className="bg-canvas text-ink">
      <section className="consult-section relative isolate overflow-hidden pb-16 sm:pb-24">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 text-center">
          <p className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-gold-line/30 bg-gold-deep/10 text-[13px] font-bold text-gold">
            <span className="relative flex w-2 h-2">
              <span className="consult-live absolute inset-0 rounded-full bg-gold-fill" />
              <span className="relative w-2 h-2 rounded-full bg-gold-fill" />
            </span>
            {t.eyebrow}
          </p>
          <h1 className="mt-5 text-[2rem] sm:text-5xl lg:text-[3.6rem] font-black leading-[1.25] text-ink-strong [text-wrap:balance]">{t.title}</h1>
          <p className="mt-5 mx-auto max-w-2xl text-[15px] sm:text-lg leading-[1.95] text-ink-soft [text-wrap:pretty]">{t.intro}</p>
        </div>

        <RouteMap reached={done} arrived={Boolean(reference)} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-28 lg:-mt-36">
          <div className="consult-card rounded-[1.4rem] p-px">
            <div className="rounded-[calc(1.4rem-1px)] bg-surface/90 backdrop-blur-xl">
              <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-6">
                <TicketRoute done={done} />
              </div>

              {/* The perforation between the ticket's stub and its body */}
              <div aria-hidden="true" className="relative">
                <span className="absolute -start-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-canvas" />
                <span className="absolute -end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-canvas" />
                <span className="block mx-5 sm:mx-8 border-t-2 border-dashed border-ink/10" />
              </div>

              <div className="px-5 sm:px-8 pt-7 pb-7 sm:pb-8 text-start">
                {reference ? (
                  <RequestReceived reference={reference} title={t.receivedTitle} text={t.receivedText} onReset={startOver} resetLabel={t.another} />
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-xl sm:text-2xl font-black text-ink-strong">{t.formTitle}</h2>
                      {service && (
                        <span className="inline-flex items-center gap-1.5 ps-3 pe-1 py-1 rounded-full bg-brand/10 border border-brand/25 text-[13px] text-ink-soft">
                          {t.about} <span className="font-bold text-brand-bright">{service.shortTitle}</span>
                          <button
                            type="button"
                            onClick={() => setService(null)}
                            aria-label={t.removeAbout}
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-ink-muted hover:text-ink-strong hover:bg-ink/10 transition-colors ${FOCUS}`}
                          >
                            <X aria-hidden="true" className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <label htmlFor="consult-message" className="block mb-2 text-sm font-bold text-ink">
                        {t.message}
                      </label>
                      <div className="relative">
                        <textarea
                          ref={messageRef}
                          id="consult-message"
                          rows={5}
                          required
                          maxLength={MESSAGE_MAX}
                          value={message}
                          aria-invalid={Boolean(messageError)}
                          aria-describedby={messageError ? 'consult-message-error' : undefined}
                          onChange={(event) => setMessage(event.target.value)}
                          onBlur={() => setTouched((current) => ({ ...current, message: message !== '' || current.message }))}
                          placeholder={t.messagePlaceholder}
                          className={`block w-full min-h-36 px-4 pt-3.5 pb-8 rounded-lg bg-surface border text-base leading-relaxed text-ink-strong placeholder:text-ink-dim outline-none transition-colors resize-y focus:border-gold-line focus:ring-1 focus:ring-gold-line ${
                            messageError ? 'border-danger' : 'border-ink/15 hover:border-ink/30'
                          }`}
                        />
                        <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 end-4 text-xs tabular-nums text-ink-dim">
                          {num(message.length)} / {num(MESSAGE_MAX)}
                        </span>
                      </div>
                      {messageError && (
                        <p id="consult-message-error" className="flex items-start gap-1.5 mt-2 text-[13px] leading-relaxed text-danger">
                          <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{messageError}</span>
                        </p>
                      )}
                    </div>

                    {formError && (
                      <p role="alert" className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-danger">
                        <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{formError}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`consult-submit group relative mt-6 w-full inline-flex items-center justify-center gap-3 min-h-14 px-8 rounded-xl overflow-hidden bg-gold-fill text-on-accent font-black text-base sm:text-[17px] disabled:opacity-70 disabled:cursor-wait transition-[transform,box-shadow] active:scale-[0.985] ${FOCUS}`}
                    >
                      <span>{isSubmitting ? t.submitting : t.submit}</span>
                      <Send aria-hidden="true" className="w-5 h-5 transition-transform ltr:group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </button>

                    <p className="mt-4 flex items-start justify-center gap-2 text-[13px] leading-relaxed text-ink-muted">
                      <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                      <span>{t.privacy}</span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* For anyone who can't wait for a call back */}
          <a
            href={telHref(SUPPORT_PHONE)}
            className={`mt-8 mx-auto flex w-fit flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 rounded-full text-sm text-ink-muted hover:text-ink-strong transition-colors ${FOCUS}`}
          >
            <PhoneCall aria-hidden="true" className="w-4 h-4 text-brand" />
            <span>{t.urgent}</span>
            <span dir="ltr" className="font-bold text-ink whitespace-nowrap">
              {SUPPORT_PHONE}
            </span>
          </a>
        </div>
      </section>
    </main>
  );
};
