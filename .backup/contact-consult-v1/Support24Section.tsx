'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, MessageCircle, Moon, PhoneCall, Sun } from 'lucide-react';
import { COMPANY_CONFIG } from '../../data/company';
import { useRevealOnce } from '../../hooks/useRevealOnce';

const WHATSAPP_NUMBER = '905367008090';
const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Numbers in the data are for reading and may use Persian digits; dialing needs Latin ones.
const telHref = (phone: string) =>
  `tel:${phone.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[^\d+]/g, '')}`;

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

// ---- What the visitor needs, and the fastest way to get it --------------------

type Answer = {
  id: string;
  need: string;
  advice: string;
  primary: { href: string; label: string; note?: string; kind: 'call' | 'chat' | 'form' };
  secondary: { href: string; label: string; kind: 'call' | 'chat' | 'form' };
};

const HOTLINE = COMPANY_CONFIG.offices[0].phones[1];
const CALL_CENTER = COMPANY_CONFIG.emergencySupportPhone;

const ANSWERS: Answer[] = [
  {
    id: 'on-route',
    need: 'در مسیر هستم و کمک فوری می‌خواهم',
    advice: 'در پایانه، مرز یا بین راه، با شماره همراه پشتیبانی مستقیم صحبت کنید. این خط شبانه‌روز پاسخگوست.',
    primary: { href: telHref(HOTLINE), label: 'تماس با پشتیبانی ۲۴ ساعته', note: HOTLINE, kind: 'call' },
    secondary: { href: whatsappLink('سلام، در مسیر هستم و به کمک فوری نیاز دارم.'), label: 'پیام در واتس‌اپ', kind: 'chat' },
  },
  {
    id: 'ticket',
    need: 'سؤال درباره بلیت و حرکت اتوبوس دارم',
    advice: 'مرکز تماس پایانه آکسارای وضعیت اتوبوس، بلیت و ترانزیت را همان لحظه پیگیری می‌کند.',
    primary: { href: telHref(CALL_CENTER), label: 'تماس با مرکز استانبول', note: CALL_CENTER, kind: 'call' },
    secondary: { href: whatsappLink('سلام، درباره بلیت و حرکت اتوبوس تهران–استانبول سؤال دارم.'), label: 'پیام در واتس‌اپ', kind: 'chat' },
  },
  {
    id: 'cargo',
    need: 'بار یا بارنامه‌ام را پیگیری می‌کنم',
    advice: 'شماره بارنامه CMR را در واتس‌اپ بفرستید تا وضعیت ترخیص در گمرکات ایران و ترکیه را به شما اعلام کنیم.',
    primary: { href: whatsappLink('سلام، وضعیت این بارنامه را پیگیری می‌کنم. شماره بارنامه: '), label: 'ارسال شماره بارنامه', kind: 'chat' },
    secondary: { href: telHref(CALL_CENTER), label: 'تماس با مرکز استانبول', kind: 'call' },
  },
  {
    id: 'documents',
    need: 'می‌خواهم مدارکم را بفرستم',
    advice: 'پاسپورت، مدارک هویتی و فاکتورها را در واتس‌اپ بفرستید تا کارشناسان بررسی کنند. پیام صوتی و متنی ۲۴ ساعته پذیرفته می‌شود.',
    primary: { href: whatsappLink('سلام، می‌خواهم مدارکم را برای بررسی بفرستم. موضوع پرونده: '), label: 'ارسال مدارک در واتس‌اپ', kind: 'chat' },
    secondary: { href: '/consultation', label: 'ثبت درخواست مشاوره', kind: 'form' },
  },
  {
    id: 'consult',
    need: 'برای پرونده تجاری یا حقوقی مشاوره می‌خواهم',
    advice: 'فرم کوتاه را پر کنید و زمان دلخواه‌تان را بگویید. کارشناس حقوقی یا بازرگانی در همان روز تماس می‌گیرد.',
    primary: { href: '/consultation', label: 'ثبت درخواست مشاوره', kind: 'form' },
    secondary: { href: telHref(CALL_CENTER), label: 'تماس با مرکز استانبول', kind: 'call' },
  },
];

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
        <ArrowLeft className="w-4 h-4 shrink-0" />
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
  const [selectedId, setSelectedId] = useState(ANSWERS[0].id);
  const selected = ANSWERS.find((answer) => answer.id === selectedId) as Answer;

  return (
    <div>
      <fieldset>
        <legend className="font-extrabold text-lg sm:text-xl text-white mb-3">الان به چه کمکی نیاز دارید؟</legend>
        <div className="border-t border-white/10">
          {ANSWERS.map((answer) => {
            const isSelected = answer.id === selectedId;
            return (
              <label
                key={answer.id}
                className={`flex items-center gap-3 min-h-[52px] px-3 py-2 border-b border-white/10 cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-[#E2C98C] ${
                  isSelected ? 'bg-[#0C252B]' : 'hover:bg-white/[0.03]'
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
                    isSelected ? 'border-[#E2C98C]' : 'border-[#7FA2AA]'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#E2C98C]" />}
                </span>
                <span className={`text-[15px] font-bold leading-snug ${isSelected ? 'text-white' : 'text-[#D5E0E3]'}`}>{answer.need}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Announced as it changes, so choosing a need also reads out the answer */}
      <div aria-live="polite" className="bg-[#0C252B] px-4 sm:px-5 py-5 rounded-b-xl">
        <div key={selected.id} className="sup-answer">
          <p className="text-sm sm:text-[15px] leading-[1.95] text-[#C9D7DB] max-w-[36rem]">{selected.advice}</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <ActionLink
              href={selected.primary.href}
              kind={selected.primary.kind}
              className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-sm sm:text-[15px] transition-colors ${FOCUS}`}
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
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[#E2C98C] hover:text-white font-bold text-sm transition-colors ${FOCUS}`}
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

type Office = (typeof COMPANY_CONFIG.offices)[number];

const OFFICE_ROWS: { office: Office; name: string; color: string; radius: number }[] = [
  { office: COMPANY_CONFIG.offices[0], name: 'دفتر استانبول', color: '#12B8B0', radius: 146 },
  { office: COMPANY_CONFIG.offices[1], name: 'دفتر تهران', color: '#7CF3EC', radius: 128 },
  { office: COMPANY_CONFIG.offices[2], name: 'دفتر تبریز', color: '#7FA2AA', radius: 110 },
];

const DIAL_ZONE = 'Asia/Tehran';
const ISTANBUL_ZONE = 'Europe/Istanbul';
const CENTER = 200;
const RING_RADIUS = 168;

const localParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    minutes: Number(read('hour')) * 60 + Number(read('minute')),
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(read('weekday')),
  };
};

const clockText = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('fa-IR', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);

const hourText = (hour: number) => `${String(hour).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}:۰۰`;

const officeStatus = (office: Office, now: Date): { isOpen: boolean; text: string } => {
  const { timeZone, openHour, closeHour, closedWeekdays } = office.schedule;
  const { minutes, weekday } = localParts(now, timeZone);
  const tomorrowClosed = closedWeekdays.includes((weekday + 1) % 7);
  const nextOpen = tomorrowClosed ? 'در روز کاری بعدی باز می‌شود' : `فردا ساعت ${hourText(openHour)} باز می‌شود`;
  if (closedWeekdays.includes(weekday)) return { isOpen: false, text: `امروز تعطیل است؛ ${nextOpen}` };
  if (minutes < openHour * 60) return { isOpen: false, text: `ساعت ${hourText(openHour)} باز می‌شود` };
  if (minutes >= closeHour * 60) return { isOpen: false, text: nextOpen };
  return { isOpen: true, text: `باز است تا ${hourText(closeHour)}` };
};

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

// Office hours are local; the dial runs on Tehran time, half an hour ahead of Istanbul.
const onDial = (office: Office, hour: number) => hour * 60 + (office.schedule.timeZone === ISTANBUL_ZONE ? 30 : 0);

const HOUR_LABELS = [
  { hour: 12, text: '۱۲' },
  { hour: 18, text: '۱۸' },
  { hour: 0, text: '۰۰' },
  { hour: 6, text: '۶' },
];

const CoverageDial: React.FC = () => {
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
        <svg viewBox="0 0 400 400" className="w-full h-auto" role="img" aria-label="ساعت کاری دفترها در شبانه‌روز؛ خط پشتیبانی در تمام ۲۴ ساعت فعال است">
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
              className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#7FA2AA]"
              style={{ left: `${(point.x / 400) * 100}%`, top: `${(point.y / 400) * 100}%` }}
            >
              {hour === 12 ? <Sun className="w-4 h-4 text-[#E2C98C]" /> : hour === 0 ? <Moon className="w-4 h-4 text-[#7FA2AA]" /> : text}
            </span>
          );
        })}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] sm:text-xs text-[#A2B6BC]">به وقت تهران</span>
          <span className="block font-black text-[1.9rem] sm:text-[2.4rem] leading-tight text-white min-h-[1.25em]">
            {now ? clockText(now, DIAL_ZONE) : ''}
          </span>
          <span className="text-[11px] sm:text-xs text-[#A2B6BC] min-h-[1.5em]">{now ? `استانبول ${clockText(now, ISTANBUL_ZONE)}` : ''}</span>
        </div>
      </div>

      {/* Dial legend, which is also the live status and the way to call each office */}
      <ul className="mt-5 border-t border-white/10">
        <li className="flex items-center gap-3 min-h-[60px] py-2 border-b border-white/10">
          <span aria-hidden="true" className="w-1 self-stretch my-1 rounded-full bg-[#E2C98C]" />
          <span className="flex-1 min-w-0">
            <span className="block font-bold text-[15px] text-white">خط پشتیبانی شبانه‌روزی</span>
            <span className="block text-xs text-[#E2C98C] mt-0.5">همیشه پاسخگو؛ ۲۴ ساعت در ۷ روز هفته</span>
          </span>
          <a dir="ltr" href={telHref(HOTLINE)} className={`shrink-0 py-3 text-[13px] sm:text-sm font-bold text-[#D5E0E3] hover:text-white transition-colors rounded ${FOCUS}`}>
            {HOTLINE}
          </a>
        </li>
        {OFFICE_ROWS.map((row) => {
          const status = now ? officeStatus(row.office, now) : null;
          const { openHour, closeHour } = row.office.schedule;
          return (
            <li key={row.name} className="flex items-center gap-3 min-h-[60px] py-2 border-b border-white/10">
              <span aria-hidden="true" className="w-1 self-stretch my-1 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-[15px] text-white">{row.name}</span>
                <span className={`block text-xs mt-0.5 ${status?.isOpen ? 'text-[#3ED0C8]' : 'text-[#A2B6BC]'}`}>
                  {status ? status.text : `${hourText(openHour)} تا ${hourText(closeHour)}`}
                </span>
              </span>
              <a dir="ltr" href={telHref(row.office.phones[0])} className={`shrink-0 py-3 text-[13px] sm:text-sm font-bold text-[#D5E0E3] hover:text-white transition-colors rounded ${FOCUS}`}>
                {row.office.phones[0]}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ---- Section -----------------------------------------------------------------

const JOURNEY = [
  { title: 'حضور میدانی در مبدأ و مقصد', text: 'دفاتر فعال در پایانه غرب تهران و پایانه اختصاصی آکسارای استانبول.' },
  { title: 'همراهی در گیت‌های مرزی', text: 'راهنمایی و تشریفات مسافری و ترانزیت در مرز بازرگان، رازی و سرو.' },
  { title: 'پیگیری بارنامه CMR', text: 'اطلاع‌رسانی وضعیت ترخیص کالا از گمرکات ایران و ترکیه.' },
  { title: 'مترجم رسمی و همراه حقوقی', text: 'همراهی در دفاتر نوتر، ثبت اسناد، اتاق بازرگانی و بانک زراعت.' },
];

export const Support24Section: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useRevealOnce(sectionRef);

  return (
    <section ref={sectionRef} data-reveal={reveal} className="relative bg-[#07191F] border-y border-[#12B8B0]/20 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 text-right">
            <h2 className="text-[1.9rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.35] text-[#F7F7F3] [text-wrap:balance]">
              مرکز پاسخگویی و همراهی شبانه‌روزی
            </h2>
            <p className="mt-4 mb-8 lg:mb-10 max-w-2xl text-[15px] sm:text-lg leading-[1.95] text-[#B7C8CD]">
              در تمام مسیر، تنها نخواهید بود. از رزرو بلیت و ترخیص کارگو تا تشریفات قانونی، از پایانه‌های ایران تا استانبول و اروپا همراه شما هستیم.
            </p>
            <NeedPicker />
          </div>

          <div className="lg:col-span-5">
            <CoverageDial />
          </div>
        </div>

        {/* Where the team stands along the way, in the order a journey meets them */}
        <div className="mt-14 lg:mt-20 text-right">
          <h3 className="font-extrabold text-lg sm:text-xl text-white mb-6">همراه شما در هر نقطه از مسیر</h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
            {JOURNEY.map((stop, index) => (
              <li key={stop.title} className="relative pr-7 lg:pr-0 lg:pt-6 pb-7 lg:pb-0">
                {index < JOURNEY.length - 1 && (
                  <span aria-hidden="true" className="sm:hidden lg:block absolute bg-[#C6A15B]/45 top-2 bottom-0 right-[5px] w-px lg:top-[5px] lg:bottom-auto lg:right-0 lg:-left-6 lg:w-auto lg:h-px" />
                )}
                <span aria-hidden="true" className="absolute top-1.5 right-0 lg:top-0 w-[11px] h-[11px] rounded-full bg-[#C6A15B]" />
                <h4 className="font-bold text-[15px] text-[#F7F7F3]">{stop.title}</h4>
                <p className="mt-1.5 text-[13px] leading-[1.85] text-[#A2B6BC] max-w-[19rem]">{stop.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
