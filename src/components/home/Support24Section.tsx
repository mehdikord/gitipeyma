'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, MessageCircle, Moon, PhoneCall, Sun } from 'lucide-react';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { Office, clockText, hourText, localParts, officeStatus, telHref } from '../../utils/contact';
import { useSite } from '../site/SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';
import type { Dictionary } from '../../i18n/dictionaries';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

// ---- What the visitor needs, and the fastest way to get it --------------------

type Answer = {
  id: string;
  need: string;
  advice: string;
  primary: { href: string; label: string; note?: string; kind: 'call' | 'chat' | 'form' };
  secondary: { href: string; label: string; kind: 'call' | 'chat' | 'form' };
};

type SupportText = Dictionary['home']['support'];

// The numbers and the WhatsApp line come from the site settings.
const buildAnswers = (t: SupportText, HOTLINE: string, CALL_CENTER: string, whatsappNumber: string, path: (to: string) => string): Answer[] => {
  const whatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const { answers, actions } = t;
  return [
    {
      id: 'on-route',
      ...answers.onRoute,
      primary: { href: telHref(HOTLINE), label: actions.callSupport, note: HOTLINE, kind: 'call' },
      secondary: { href: whatsappLink(answers.onRoute.message), label: actions.whatsapp, kind: 'chat' },
    },
    {
      id: 'ticket',
      ...answers.ticket,
      primary: { href: telHref(CALL_CENTER), label: actions.callIstanbul, note: CALL_CENTER, kind: 'call' },
      secondary: { href: whatsappLink(answers.ticket.message), label: actions.whatsapp, kind: 'chat' },
    },
    {
      id: 'cargo',
      ...answers.cargo,
      primary: { href: whatsappLink(answers.cargo.message), label: actions.sendWaybill, kind: 'chat' },
      secondary: { href: telHref(CALL_CENTER), label: actions.callIstanbul, kind: 'call' },
    },
    {
      id: 'documents',
      ...answers.documents,
      primary: { href: whatsappLink(answers.documents.message), label: actions.sendDocuments, kind: 'chat' },
      secondary: { href: path('/consultation'), label: actions.consultation, kind: 'form' },
    },
    {
      id: 'consult',
      ...answers.consult,
      primary: { href: path('/consultation'), label: actions.consultation, kind: 'form' },
      secondary: { href: telHref(CALL_CENTER), label: actions.callIstanbul, kind: 'call' },
    },
  ];
};

const KIND_ICON = { call: PhoneCall, chat: MessageCircle, form: FileText };

const ActionLink: React.FC<{ href: string; kind: Answer['primary']['kind']; className: string; children: React.ReactNode }> = ({ href, kind, className, children }) => {
  const Icon = KIND_ICON[kind];
  const content = (
    <>
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {children}
    </>
  );
  if (kind === 'form') {
    return (
      <Link href={href} className={className}>
        {content}
        <ArrowLeft className="w-4 h-4 shrink-0 ltr:-scale-x-100" />
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...(kind === 'chat' ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {content}
    </a>
  );
};

const NeedPicker: React.FC = () => {
  const { settings } = useSite();
  const { t: { home: { support: t } }, path } = useI18n();
  const ANSWERS = useMemo(
    () => buildAnswers(t, settings.support_hotline, settings.support_phone, settings.whatsapp_number, path),
    // path only changes with t (the language)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, settings.support_hotline, settings.support_phone, settings.whatsapp_number],
  );
  const [selectedId, setSelectedId] = useState(ANSWERS[0].id);
  const selected = ANSWERS.find((answer) => answer.id === selectedId) as Answer;

  return (
    <div>
      <fieldset>
        <legend className="font-extrabold text-lg sm:text-xl text-ink-strong mb-3">{t.needLegend}</legend>
        <div className="border-t border-ink/10">
          {ANSWERS.map((answer) => {
            const isSelected = answer.id === selectedId;
            return (
              <label
                key={answer.id}
                className={`flex items-center gap-3 min-h-[52px] px-3 py-2 border-b border-ink/10 cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-gold-line ${
                  isSelected ? 'bg-surface' : 'hover:bg-ink/[0.03]'
                }`}
              >
                <input
                  type="radio"
                  name="support-need"
                  value={answer.id}
                  checked={isSelected}
                  onChange={() => setSelectedId(answer.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`w-[18px] h-[18px] shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-gold-line' : 'border-ink-dim'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-gold-fill" />}
                </span>
                <span className={`text-[15px] font-bold leading-snug ${isSelected ? 'text-ink-strong' : 'text-ink-soft'}`}>{answer.need}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Announced as it changes, so choosing a need also reads out the answer */}
      <div aria-live="polite" className="bg-surface px-4 sm:px-5 py-5 rounded-b-xl">
        <div key={selected.id} className="sup-answer">
          <p className="text-sm sm:text-[15px] leading-[1.95] text-ink-soft max-w-[36rem]">{selected.advice}</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <ActionLink
              href={selected.primary.href}
              kind={selected.primary.kind}
              className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg bg-brand-fill hover:bg-brand-bright-fill text-on-accent font-extrabold text-sm sm:text-[15px] transition-colors ${FOCUS}`}
            >
              <span>{selected.primary.label}</span>
              {selected.primary.note && (
                <span dir="ltr" className="hidden sm:inline font-bold text-[13px] opacity-80">
                  {selected.primary.note}
                </span>
              )}
            </ActionLink>
            <ActionLink
              href={selected.secondary.href}
              kind={selected.secondary.kind}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gold hover:text-ink-strong font-bold text-sm transition-colors ${FOCUS}`}
            >
              <span>{selected.secondary.label}</span>
            </ActionLink>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- The 24-hour dial: when each office is open, and the line that never closes -

// The dial has room for three office rings, drawn from the outside in.
const RINGS = [
  { color: '#12B8B0', radius: 146 },
  { color: '#7CF3EC', radius: 128 },
  { color: '#7FA2AA', radius: 110 },
];

type OfficeRow = { office: Office; name: string; color: string; radius: number };

const DIAL_ZONE = 'Asia/Tehran';
const CENTER = 200;
const RING_RADIUS = 168;

// Noon sits at the top and midnight at the bottom, so the dial reads as day above, night below.
const dialPoint = (minutes: number, radius: number) => {
  const angle = (minutes / 1440) * 2 * Math.PI + Math.PI;
  return {
    x: +(CENTER + radius * Math.sin(angle)).toFixed(2),
    y: +(CENTER - radius * Math.cos(angle)).toFixed(2),
  };
};

const arcPath = (fromMinutes: number, toMinutes: number, radius: number) => {
  const from = dialPoint(fromMinutes, radius);
  const to = dialPoint(toMinutes, radius);
  const large = toMinutes - fromMinutes > 720 ? 1 : 0;
  return `M${from.x} ${from.y}A${radius} ${radius} 0 ${large} 1 ${to.x} ${to.y}`;
};

// Office hours are local; the dial runs on Tehran time, so each office is shifted by how far its clock is behind Tehran's.
const zoneShift = (timeZone: string) => {
  const reference = new Date(Date.UTC(2026, 0, 15, 12));
  return (localParts(reference, DIAL_ZONE).minutes - localParts(reference, timeZone).minutes + 1440) % 1440;
};
const onDial = (office: Office, hour: number) => (hour * 60 + zoneShift(office.schedule.timeZone)) % 1440;

const HOUR_LABELS = [
  { hour: 12, text: '12' },
  { hour: 18, text: '18' },
  { hour: 0, text: '00' },
  { hour: 6, text: '6' },
];

const CoverageDial: React.FC = () => {
  const { settings, offices } = useSite();
  const { t: { home: { support: t } }, locale, digits, fill } = useI18n();
  const HOTLINE = settings.support_hotline;
  // The second clock shows the head office's time, when it differs from Tehran's.
  const headOffice = offices[0];
  const OFFICE_ROWS: OfficeRow[] = offices.slice(0, RINGS.length).map((office, index) => ({ office, name: fill(t.officeName, { name: office.name }), ...RINGS[index] }));
  // Only known in the browser: the page is prerendered, so the first render has no clock.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(timer);
  }, []);

  const dialMinutes = now ? localParts(now, DIAL_ZONE).minutes : null;
  const tip = dialMinutes === null ? null : dialPoint(dialMinutes, RING_RADIUS);

  return (
    <div>
      <div className="relative max-w-[420px] mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-auto" role="img" aria-label={t.dialLabel}>
          {/* Hour ticks */}
          {Array.from({ length: 96 }, (_, index) => {
            const major = index % 4 === 0;
            const a = dialPoint(index * 15, major ? 178 : 180);
            const b = dialPoint(index * 15, 186);
            return <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={major ? '#7FA2AA' : '#2C4A52'} strokeWidth={major ? 1.5 : 1} />;
          })}

          {/* Unlit tracks */}
          {OFFICE_ROWS.map((row) => (
            <circle key={row.name} cx={CENTER} cy={CENTER} r={row.radius} fill="none" stroke="#14323A" strokeWidth="7" />
          ))}

          {/* The support line: a closed gold ring, 24 hours with no gap */}
          <circle
            className="sup-draw"
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke="#E2C98C"
            strokeWidth="5"
            pathLength={1}
            transform={`rotate(180 ${CENTER} ${CENTER})`}
          />

          {/* Each office's open hours */}
          {OFFICE_ROWS.map((row, index) => (
            <path
              key={row.name}
              className="sup-draw"
              style={{ '--draw-delay': `${0.25 + index * 0.15}s` } as React.CSSProperties}
              d={arcPath(onDial(row.office, row.office.schedule.openHour), onDial(row.office, row.office.schedule.closeHour), row.radius)}
              fill="none"
              stroke={row.color}
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
            />
          ))}

          {/* Current time */}
          {dialMinutes !== null && tip && (
            <>
              <g className="sup-needle" style={{ transform: `rotate(${(dialMinutes / 1440) * 360 + 180}deg)` }}>
                <line x1={CENTER} y1={CENTER - 92} x2={CENTER} y2={CENTER - RING_RADIUS} stroke="#F7F7F3" strokeWidth="2" />
              </g>
              <circle className="sup-pulse" cx={tip.x} cy={tip.y} r="9" fill="#F7F7F3" />
              <circle cx={tip.x} cy={tip.y} r="6.5" fill="#F7F7F3" stroke="#07191F" strokeWidth="2" />
            </>
          )}
        </svg>

        {/* Text and icons sit outside the SVG so they keep readable sizes on small screens */}
        {HOUR_LABELS.map(({ hour, text }) => {
          const point = dialPoint(hour * 60, 92);
          return (
            <span
              key={hour}
              aria-hidden="true"
              className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-ink-dim"
              style={{ left: `${(point.x / 400) * 100}%`, top: `${(point.y / 400) * 100}%` }}
            >
              {hour === 12 ? <Sun className="w-4 h-4 text-gold" /> : hour === 0 ? <Moon className="w-4 h-4 text-ink-dim" /> : digits(text)}
            </span>
          );
        })}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] sm:text-xs text-ink-muted">{t.tehranTime}</span>
          <span className="block font-black text-[1.9rem] sm:text-[2.4rem] leading-tight text-ink-strong min-h-[1.25em]">
            {now ? clockText(now, DIAL_ZONE, locale) : ''}
          </span>
          <span className="text-[11px] sm:text-xs text-ink-muted min-h-[1.5em]">{now && headOffice && headOffice.schedule.timeZone !== DIAL_ZONE ? `${headOffice.name} ${clockText(now, headOffice.schedule.timeZone, locale)}` : ''}</span>
        </div>
      </div>

      {/* Dial legend, which is also the live status and the way to call each office */}
      <ul className="mt-5 border-t border-ink/10">
        <li className="flex items-center gap-3 min-h-[60px] py-2 border-b border-ink/10">
          <span aria-hidden="true" className="w-1 self-stretch my-1 rounded-full bg-gold-fill" />
          <span className="flex-1 min-w-0">
            <span className="block font-bold text-[15px] text-ink-strong">{t.supportLine}</span>
            <span className="block text-xs text-gold mt-0.5">{t.supportAlways}</span>
          </span>
          <a dir="ltr" href={telHref(HOTLINE)} className={`shrink-0 py-3 text-[13px] sm:text-sm font-bold text-ink-soft hover:text-ink-strong transition-colors rounded ${FOCUS}`}>
            {HOTLINE}
          </a>
        </li>
        {OFFICE_ROWS.map((row) => {
          const status = now ? officeStatus(row.office, now, locale) : null;
          const { openHour, closeHour } = row.office.schedule;
          return (
            <li key={row.name} className="flex items-center gap-3 min-h-[60px] py-2 border-b border-ink/10">
              <span aria-hidden="true" className="w-1 self-stretch my-1 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-[15px] text-ink-strong">{row.name}</span>
                <span className={`block text-xs mt-0.5 ${status?.isOpen ? 'text-brand-bright' : 'text-ink-muted'}`}>
                  {status ? status.text : fill(t.hoursRange, { from: hourText(openHour, locale), to: hourText(closeHour, locale) })}
                </span>
              </span>
              <a dir="ltr" href={telHref(row.office.phones[0])} className={`shrink-0 py-3 text-[13px] sm:text-sm font-bold text-ink-soft hover:text-ink-strong transition-colors rounded ${FOCUS}`}>
                {/* Numbers may be stored with Persian digits; other languages read them in Latin ones */}
                {locale === 'fa' ? row.office.phones[0] : digits(row.office.phones[0])}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ---- Section -----------------------------------------------------------------

export const Support24Section: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useRevealOnce(sectionRef);
  const { t: { home: { support: t } } } = useI18n();
  const JOURNEY = t.journey;

  return (
    <section ref={sectionRef} data-reveal={reveal} className="relative bg-canvas border-y border-brand/20 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 text-start">
            <h2 className="text-[1.9rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.35] text-ink [text-wrap:balance]">
              {t.title}
            </h2>
            <p className="mt-4 mb-8 lg:mb-10 max-w-2xl text-[15px] sm:text-lg leading-[1.95] text-ink-soft">
              {t.lead}
            </p>
            <NeedPicker />
          </div>

          <div className="lg:col-span-5">
            <CoverageDial />
          </div>
        </div>

        {/* Where the team stands along the way, in the order a journey meets them */}
        <div className="mt-14 lg:mt-20 text-start">
          <h3 className="font-extrabold text-lg sm:text-xl text-ink-strong mb-6">{t.journeyTitle}</h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
            {JOURNEY.map((stop, index) => (
              <li key={stop.title} className="relative ps-7 lg:ps-0 lg:pt-6 pb-7 lg:pb-0">
                {index < JOURNEY.length - 1 && (
                  <span aria-hidden="true" className="sm:hidden lg:block absolute bg-gold-deep/45 top-2 bottom-0 start-[5px] w-px lg:top-[5px] lg:bottom-auto lg:start-0 lg:-end-6 lg:w-auto lg:h-px" />
                )}
                <span aria-hidden="true" className="absolute top-1.5 start-0 lg:top-0 w-[11px] h-[11px] rounded-full bg-gold-deep-fill" />
                <h4 className="font-bold text-[15px] text-ink">{stop.title}</h4>
                <p className="mt-1.5 text-[13px] leading-[1.85] text-ink-muted max-w-[19rem]">{stop.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
