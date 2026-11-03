'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { AlertCircle, Clock, Mail, MapPin, MessageCircle, Navigation, PhoneCall, Send, ShieldCheck } from 'lucide-react';
import { CITIES, LonLat, STAGE, project, roadPathTo } from '../home/hero/geo';
import { Office, hourText, officeStatus, telHref } from '../../utils/contact';
import { validateFullName, validateMessage, validatePhoneNumber } from '../../utils/validation';
import { CONTACT_TOPICS, CONTACT_TOPIC_LABELS } from '../../modules/contactMessages/topics';
import { submitContactMessage } from '../../modules/site/actions';
import { RequestReceived } from '../ui/RequestReceived';
import { TextField } from '../ui/TextField';
import { useSite } from '../site/SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

type OfficeStop = { office: Office; at: LonLat; name: string; role: string };

const ROUTE_TO_ISTANBUL = roadPathTo(CITIES.istanbul);
const ZOOM = 1.35;

// ---- The map: a camera that flies to the chosen office ------------------------

const OfficeMap: React.FC<{ offices: OfficeStop[]; active: number; onSelect: (index: number) => void }> = ({ offices: OFFICES, active, onSelect }) => {
  const { dir } = useI18n();
  const bandRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<{ width: number; x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const aim = () => {
      const { width: bandWidth, height: bandHeight } = band.getBoundingClientRect();
      const isDesktop = window.innerWidth >= 1024;
      const width = isDesktop ? Math.max(bandWidth, 1200) : 1000;
      const point = project(OFFICES[active].at);
      const k = (width / STAGE.width) * ZOOM;
      // On desktop the text covers the reading side (right in Persian), so the office lands in the clear other part.
      setCamera({
        width,
        x: bandWidth * (isDesktop ? (dir === 'rtl' ? 0.3 : 0.7) : 0.5) - point.x * k,
        y: bandHeight * (isDesktop ? 0.6 : 0.5) - point.y * k,
      });
    };
    aim();
    const observer = new ResizeObserver(aim);
    observer.observe(band);
    return () => observer.disconnect();
  }, [active, OFFICES, dir]);

  return (
    <div ref={bandRef} aria-hidden="true" className="contact-map-band relative order-2 lg:order-none lg:absolute lg:inset-0 lg:-z-10 overflow-hidden">
      {camera && (
        <div
          className="contact-stage"
          style={{ width: camera.width, transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${ZOOM})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/map.svg" alt="" width={STAGE.width} height={STAGE.height} className="map-soft-edges absolute inset-0 w-full h-full" />
          <svg viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} className="absolute inset-0 w-full h-full">
            <path d={ROUTE_TO_ISTANBUL} fill="none" stroke="#E2C98C" strokeOpacity="0.2" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <path d={ROUTE_TO_ISTANBUL} fill="none" stroke="#E2C98C" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {OFFICES.map(({ at, name }, index) => {
            const point = project(at);
            return (
              <button
                key={name}
                type="button"
                tabIndex={-1}
                data-active={index === active}
                onClick={() => onSelect(index)}
                className="contact-pin"
                style={{ left: `${(point.x / STAGE.width) * 100}%`, top: `${(point.y / STAGE.height) * 100}%`, '--zoom': ZOOM } as React.CSSProperties}
              >
                <span className="contact-pin-dot" />
                <span className="contact-pin-name">{name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Quiet the dots behind the text and the office strip */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none rtl:bg-[radial-gradient(ellipse_62%_80%_at_100%_20%,#07191F_40%,rgba(7,25,31,0.8)_62%,transparent_100%)] ltr:bg-[radial-gradient(ellipse_62%_80%_at_0%_20%,#07191F_40%,rgba(7,25,31,0.8)_62%,transparent_100%)]" />
      <div className="hidden lg:block absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-b from-transparent via-[#07191F]/85 to-[#07191F]" />
    </div>
  );
};

// ---- Message form --------------------------------------------------------------

const MessageForm: React.FC = () => {
  const { t: { contact: { form: t } }, locale } = useI18n();
  const topics = CONTACT_TOPIC_LABELS[locale];
  // Holds the Persian label, which is what the panel stores and filters by
  const [topic, setTopic] = useState('');
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true, message: true });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();
    if (!messageCheck.isValid) return messageRef.current?.focus();

    startSubmit(async () => {
      const result = await submitContactMessage({ topic, name: fullName, phone, message }, locale);
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

  const reset = () => {
    setReference(null);
    setTopic('');
    setMessage('');
    setTouched({ fullName: false, phone: false, message: false });
  };

  if (reference) {
    return (
      <RequestReceived
        reference={reference}
        title={t.receivedTitle}
        text={t.receivedText}
        onReset={reset}
        resetLabel={t.another}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 text-start">
      <fieldset>
        <legend className="mb-2.5 text-sm font-bold text-[#F7F7F3]">
          {t.topic} <span className="font-normal text-[#A2B6BC]">{t.optional}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((option, index) => {
            const isSelected = topic === option;
            return (
              <label
                key={option}
                className={`inline-flex items-center min-h-11 px-4 py-2 rounded-lg border text-sm font-bold cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E2C98C] ${
                  isSelected ? 'bg-[#E2C98C] border-[#E2C98C] text-[#07191F]' : 'bg-[#0C252B] border-white/15 text-[#D5E0E3] hover:border-white/40'
                }`}
              >
                <input type="radio" name="contact-topic" value={option} checked={isSelected} onChange={() => setTopic(option)} className="sr-only" />
                {topics[index]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TextField
          id="contact-fullname"
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
          id="contact-phone"
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

      <div>
        <label htmlFor="contact-message" className="block mb-2 text-sm font-bold text-[#F7F7F3]">
          {t.message}
        </label>
        <textarea
          ref={messageRef}
          id="contact-message"
          rows={4}
          maxLength={3000}
          required
          value={message}
          aria-invalid={Boolean(messageError)}
          aria-describedby={messageError ? 'contact-message-error' : undefined}
          onChange={(event) => setMessage(event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, message: message !== '' || current.message }))}
          placeholder={t.messagePlaceholder}
          className={`w-full px-4 py-3.5 rounded-lg bg-[#0C252B] border text-base leading-relaxed text-white placeholder:text-[#7F979E] outline-none transition-colors resize-none focus:border-[#E2C98C] focus:ring-1 focus:ring-[#E2C98C] ${
            messageError ? 'border-[#F58B8B]' : 'border-white/15 hover:border-white/30'
          }`}
        />
        {messageError && (
          <p id="contact-message-error" className="flex items-start gap-1.5 mt-2 text-[13px] leading-relaxed text-[#F58B8B]">
            <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{messageError}</span>
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="flex items-start gap-2 text-sm leading-relaxed text-[#F58B8B]">
          <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{formError}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`shrink-0 inline-flex items-center justify-center gap-2.5 min-h-14 px-8 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] disabled:opacity-70 disabled:cursor-wait text-[#07191F] font-black text-base transition-colors ${FOCUS}`}
        >
          <Send className="w-5 h-5" />
          <span>{isSubmitting ? t.sending : t.send}</span>
        </button>
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-[#A2B6BC]">
          <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-[#12B8B0]" />
          <span>{t.privacy}</span>
        </p>
      </div>
    </form>
  );
};

// ---- Page ----------------------------------------------------------------------

export const ContactPage: React.FC = () => {
  const { settings, offices, socials } = useSite();
  const { t: { contact: t }, locale, path, fill } = useI18n();
  const SUPPORT_PHONE = settings.support_phone;
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp_number}`;
  const TELEGRAM_URL = socials.find((social) => social.platform.toLowerCase() === 'telegram')?.url;
  const OFFICES = useMemo<OfficeStop[]>(() => offices.map((office) => ({ office, at: office.at, name: office.name, role: office.role })), [offices]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Only known in the browser: the page is prerendered, so the first render has no clock.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const current = OFFICES[activeIndex];
  const status = current && now ? officeStatus(current.office, now, locale) : null;

  return (
    <main className="bg-[#07191F] text-[#F7F7F3]">
      <section className="relative isolate overflow-hidden flex flex-col lg:min-h-[max(640px,calc(100svh-7rem))]">
        {OFFICES.length > 0 && <OfficeMap offices={OFFICES} active={activeIndex} onSelect={setActiveIndex} />}

        <div className="order-1 lg:order-none relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-6 lg:flex-1">
          <div className="max-w-[36rem] text-start">
            <h1 className="text-[2rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.3] text-[#F7F7F3] [text-wrap:balance]">{t.title}</h1>
            <p className="mt-4 text-[15px] sm:text-lg leading-[1.95] text-[#C9D7DB]">
              {t.intro}
            </p>

            <a
              href={telHref(SUPPORT_PHONE)}
              className={`mt-7 flex flex-wrap sm:inline-flex items-center justify-center gap-x-3 gap-y-1 px-6 py-3.5 rounded-lg bg-[#E2C98C] hover:bg-[#F0DCA8] text-[#07191F] font-black text-[15px] sm:text-base transition-colors ${FOCUS}`}
            >
              <PhoneCall className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap">{t.support}</span>
              <span dir="ltr" className="font-extrabold whitespace-nowrap">
                {SUPPORT_PHONE}
              </span>
            </a>
            <div className="mt-3 grid grid-cols-2 sm:flex gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-sm sm:text-[15px] transition-colors ${FOCUS}`}
              >
                <MessageCircle className="w-[18px] h-[18px]" />
                <span>{t.whatsapp}</span>
              </a>
              {TELEGRAM_URL && (
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-lg text-[#F7F7F3] border border-white/25 hover:border-[#12B8B0] font-bold text-sm sm:text-[15px] transition-colors ${FOCUS}`}
                >
                  <Send className="w-[18px] h-[18px]" />
                  <span>{t.telegram}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Choosing an office flies the map there and opens its details below */}
        <div className="order-3 lg:order-none relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid border-t border-white/15" style={{ gridTemplateColumns: `repeat(${Math.max(OFFICES.length, 1)}, minmax(0, 1fr))` }}>
            {OFFICES.map((item, index) => {
              const isActive = index === activeIndex;
              const itemStatus = now ? officeStatus(item.office, now, locale) : null;
              return (
                <li key={item.office.id} className="relative border-e last:border-e-0 border-white/10">
                  {isActive && <span aria-hidden="true" className="absolute -top-px inset-x-0 h-0.5 bg-[#E2C98C]" />}
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="contact-office-details"
                    onClick={() => setActiveIndex(index)}
                    className={`block w-full h-full min-h-[76px] px-2.5 sm:px-5 py-3 text-start transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C] ${
                      isActive ? 'bg-[#0C252B]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className={`block font-extrabold text-[15px] sm:text-lg ${isActive ? 'text-white' : 'text-[#D5E0E3]'}`}>{item.name}</span>
                    <span className="hidden sm:block mt-0.5 text-xs text-[#A2B6BC]">{item.role}</span>
                    <span className={`flex items-start gap-1.5 mt-1 text-[11.5px] sm:text-xs leading-snug ${itemStatus?.isOpen ? 'text-[#3ED0C8]' : 'text-[#8FA5AB]'}`}>
                      <span aria-hidden="true" className={`shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full ${itemStatus?.isOpen ? 'bg-[#3ED0C8]' : 'bg-[#7F979E]'}`} />
                      <span>{itemStatus
                          ? itemStatus.isOpen
                            ? t.openNow
                            : t.closedNow
                          : fill(t.hoursRange, { open: hourText(item.office.schedule.openHour, locale), close: hourText(item.office.schedule.closeHour, locale) })}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {current && (
        <section id="contact-office-details" aria-live="polite" aria-label={fill(t.officeDetails, { name: current.name })} className="bg-[#0C252B] rounded-b-2xl">
          <div key={current.name} className="sup-answer grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-6 py-6 sm:py-7">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#E2C98C]">
                <MapPin aria-hidden="true" className="w-4 h-4" />
                <span>
                  {fill(t.address, { name: current.name })}
                  <span className="sr-only">{locale === 'fa' ? '، ' : ', '}{current.role}</span>
                </span>
              </h2>
              <p className="mt-2.5 text-[15px] leading-[1.95] text-[#E4ECEE]">{current.office.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.office.address)}`}
                target="_blank"
                rel="noreferrer"
                className={`mt-1 inline-flex items-center gap-2 py-3 text-sm font-bold text-[#3ED0C8] hover:text-white transition-colors rounded ${FOCUS}`}
              >
                <Navigation aria-hidden="true" className="w-4 h-4" />
                <span>{t.directions}</span>
              </a>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#E2C98C]">
                <Clock aria-hidden="true" className="w-4 h-4" />
                <span>{t.workingHours}</span>
              </h2>
              <p className="mt-2.5 text-[15px] leading-[1.95] text-[#E4ECEE]">{current.office.workingHours}</p>
              {status && <p className={`mt-1 text-sm font-bold ${status.isOpen ? 'text-[#3ED0C8]' : 'text-[#A2B6BC]'}`}>{status.text}</p>}
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#E2C98C]">
                <PhoneCall aria-hidden="true" className="w-4 h-4" />
                <span>{t.phoneEmail}</span>
              </h2>
              <ul className="mt-1.5">
                {current.office.phones.map((phone) => (
                  <li key={phone}>
                    <a dir="ltr" href={telHref(phone)} className={`inline-block py-3 text-base font-bold text-white hover:text-[#E2C98C] transition-colors rounded ${FOCUS}`}>
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
{current.office.email && (
              <a href={`mailto:${current.office.email}`} className={`inline-flex items-center gap-2 py-3 text-[15px] text-[#C9D7DB] hover:text-white transition-colors rounded ${FOCUS}`}>
                <Mail aria-hidden="true" className="w-4 h-4 text-[#12B8B0]" />
                <span dir="ltr">{current.office.email}</span>
              </a>
              )}
            </div>
          </div>
        </section>
        )}

        <section className="py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          <div className="lg:col-span-4 text-start">
            <h2 className="text-2xl sm:text-3xl font-black leading-snug text-[#F7F7F3]">{t.formTitle}</h2>
            <p className="mt-3 text-[15px] sm:text-base leading-[1.95] text-[#A2B6BC]">{t.formIntro}</p>
            <p className="mt-4 text-[15px] leading-[1.95] text-[#A2B6BC]">
              {t.caseBefore}{' '}
              <Link href={path('/consultation')} className={`font-bold text-[#E2C98C] hover:text-white underline underline-offset-4 transition-colors rounded ${FOCUS}`}>
                {t.caseLink}
              </Link>
              {t.caseAfter}
            </p>
          </div>
          <div className="lg:col-span-8">
            <MessageForm />
          </div>
        </section>
      </div>
    </main>
  );
};
