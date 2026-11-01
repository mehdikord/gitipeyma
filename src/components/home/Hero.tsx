'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Boxes, Building2, CircleDollarSign, Pause, Play, Truck } from 'lucide-react';
import { HeroLayer, RouteCanvas } from './hero/RouteCanvas';
import { CITIES, LonLat, STAGE, project } from './hero/geo';

const SERVICES: {
  layer: HeroLayer;
  href: string;
  icon: React.ElementType;
  title: string;
  fact: string;
  detail: string;
}[] = [
  {
    layer: 'bus',
    href: '/services/bus-vip-tehran-istanbul',
    icon: Truck,
    title: 'ناوگان روزانه VIP',
    fact: 'تهران ⇄ استانبول',
    detail: 'حرکت همه‌روزه از پایانه آزادی و بیهقی',
  },
  {
    layer: 'cargo',
    href: '/services/cargo-customs-clearance',
    icon: Boxes,
    title: 'کارگو و ترخیص رسمی',
    fact: '۳ الی ۵ روز اکسپرس',
    detail: 'بیمه‌نامه CMR و ترخیص گمرکات',
  },
  {
    layer: 'currency',
    href: '/services/currency-exchange-swift',
    icon: CircleDollarSign,
    title: 'تسویه ارزی و سوئیفت',
    fact: 'زیر ۳۰ دقیقه',
    detail: 'واریز به بانک‌های ترکیه و اروپا',
  },
  {
    layer: 'offices',
    href: '/contact',
    icon: Building2,
    title: 'دفاتر فیزیکی معتبر',
    fact: 'استانبول، تهران، تبریز',
    detail: 'پاسخگویی مستقیم ۲۴/۷',
  },
];

const LABELS: {
  id: string;
  at: LonLat;
  name: string;
  note?: string;
  // Which side of the marker the label sits on, in stage terms.
  place: 'above' | 'below' | 'left' | 'right';
  delay: number;
  layers: HeroLayer[];
  // Too crowded next to Bazargan on a small stage unless its layer is showing.
  compactOnlyWhenActive?: boolean;
}[] = [
  { id: 'tehran', at: CITIES.tehran, name: 'تهران', note: 'پایانه آزادی و گمرک غرب', place: 'below', delay: 0.1, layers: ['bus', 'cargo', 'currency', 'offices'] },
  { id: 'tabriz', at: CITIES.tabriz, name: 'تبریز', place: 'below', delay: 0.8, layers: ['offices'], compactOnlyWhenActive: true },
  { id: 'bazargan', at: CITIES.bazargan, name: 'مرز بازرگان', note: 'ترخیص رسمی و گیت مرزی', place: 'above', delay: 1.1, layers: ['bus', 'cargo'] },
  { id: 'istanbul', at: CITIES.istanbul, name: 'استانبول', note: 'پایانه آکسارای و هالکالی', place: 'below', delay: 2.4, layers: ['bus', 'cargo', 'currency', 'offices'] },
  { id: 'europe', at: CITIES.frankfurt, name: 'اروپا', note: 'کریدور شنگن', place: 'below', delay: 3.4, layers: ['cargo', 'currency'] },
];

const OPENING_MS = 5000;
const SERVICE_MS = 6500;

const stagePosition = (at: LonLat) => {
  const point = project(at);
  return { left: `${(point.x / STAGE.width) * 100}%`, top: `${(point.y / STAGE.height) * 100}%` };
};

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  const shownIndex = hoverIndex ?? activeIndex;
  const shownLayer = shownIndex === null ? null : SERVICES[shownIndex].layer;
  const cycling = !paused && !still && hoverIndex === null;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const timer = setTimeout(
      () => setActiveIndex((index) => (index === null ? 0 : (index + 1) % SERVICES.length)),
      activeIndex === null ? OPENING_MS : SERVICE_MS,
    );
    return () => clearTimeout(timer);
  }, [cycling, activeIndex]);

  return (
    <section className="relative isolate overflow-hidden bg-[#07191F] border-b border-[#12B8B0]/20 lg:min-h-[max(680px,calc(100svh-7rem))] flex flex-col">
      {/* The map: real geography on desktop behind the text, its own band on small screens */}
      <div className="hero-map-band relative order-2 lg:order-none lg:absolute lg:inset-0 lg:-z-10" aria-hidden="true">
        <div className="hero-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/map.svg" alt="" width={STAGE.width} height={STAGE.height} fetchPriority="high" className="hero-map-image absolute inset-0 z-0 w-full h-full" />
          <RouteCanvas layer={shownLayer} paused={paused} still={still} />

          {LABELS.map((label) => {
            const dimmed = shownLayer !== null && !label.layers.includes(shownLayer);
            return (
              <div
                key={label.id}
                data-place={label.place}
                data-dimmed={dimmed}
                data-compact-hidden={label.compactOnlyWhenActive && shownLayer !== 'offices' ? 'true' : undefined}
                className="hero-map-label"
                style={{ ...stagePosition(label.at), '--label-delay': `${label.delay}s` } as React.CSSProperties}
              >
                <span className="block text-[13px] lg:text-[15px] font-bold text-[#F7F7F3]">{label.name}</span>
                {label.note && <span className="hidden xl:block text-[11px] text-[#A2B6BC]">{label.note}</span>}
              </div>
            );
          })}
        </div>
        {/* Quiet the dots behind the text and the service strip; routes and labels stay on top */}
        <div className="hidden lg:block absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_62%_72%_at_100%_18%,#07191F_38%,rgba(7,25,31,0.82)_62%,transparent_100%)]" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-56 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-[#07191F]/90 to-[#07191F]" />
      </div>

      <div className="order-1 lg:order-none relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-2 lg:pb-8 lg:flex-1">
        <div className="max-w-[38rem] text-right">
          <h1 className="hero-title font-black text-[#F7F7F3] leading-[1.32]">
            <span className="block">مرزها، پایان مسیر نیستند؛</span>
            <span className="hero-line-second block text-[#E2C98C]">آغاز فرصت‌های تازه‌اند.</span>
          </h1>

          <p className="mt-4 lg:mt-6 max-w-[33rem] text-[15px] sm:text-lg leading-[1.95] text-[#B7C8CD]">
            گیتی پیما، همراه مطمئن شما در مسیر خدمات بین‌المللی، تجارت، حمل‌ونقل و راهکارهای فرامرزی؛ از ایران تا ترکیه، اروپا و فراتر از آن.
          </p>

          <div className="mt-6 lg:mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-sm sm:text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]"
            >
              <span>مشاهده ۱۱ خدمت فرامرزی</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/consultation"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3.5 rounded-lg text-[#E2C98C] border border-[#C6A15B]/50 hover:border-[#E2C98C] hover:bg-[#C6A15B]/10 font-bold text-sm sm:text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]"
            >
              درخواست مشاوره ۲۴ ساعته
            </Link>
          </div>
        </div>
      </div>

      {/* Each service lights up its own part of the map */}
      <div className="order-3 lg:order-none relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 lg:pb-7">
        <div className="relative z-10 flex justify-end -mt-9 lg:mt-0 mb-2">
          <button
            type="button"
            onClick={() => {
              if (still) setStill(false);
              else setPaused((value) => !value);
            }}
            aria-label={paused || still ? 'پخش انیمیشن نقشه' : 'توقف انیمیشن نقشه'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#A2B6BC] hover:text-white border border-white/15 hover:border-white/40 bg-[#07191F]/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]"
          >
            {paused || still ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/15">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isActive = shownIndex === index;
            return (
              <li key={service.layer} className="relative border-b lg:border-b-0 border-white/10 odd:border-l lg:border-l lg:last:border-l-0 border-l-white/10">
                {/* Shows how long this service stays on the map before the next one */}
                {isActive && (
                  <span
                    key={`${shownIndex}-${cycling}`}
                    className="hero-service-timer absolute -top-px inset-x-0 h-0.5 bg-[#E2C98C]"
                    data-running={cycling}
                    style={{ '--service-ms': `${SERVICE_MS}ms` } as React.CSSProperties}
                  />
                )}
                <Link
                  href={service.href}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                  className="block h-full px-3 sm:px-5 py-3.5 lg:py-4 text-right transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C]"
                >
                  <span className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isActive ? 'text-[#E2C98C]' : 'text-[#7FA2AA]'}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{service.title}</span>
                  </span>
                  <span className="block mt-1 text-sm sm:text-base font-extrabold text-white">{service.fact}</span>
                  <span className="hidden sm:block mt-0.5 text-xs text-[#8FA5AB]">{service.detail}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
