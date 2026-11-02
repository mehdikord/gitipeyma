'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import { ServiceGroupItem, ServiceItem, Tone } from '../../types';
import { serviceIcon } from '../../modules/services/icons';
import { ServiceImage } from '../ui/ServiceImage';
import { useRevealOnce } from '../../hooks/useRevealOnce';

// The lines of the map, and the services on them.
type MapProps = { services: ServiceItem[]; lines: ServiceGroupItem[] };

const useMapData = ({ services, lines }: MapProps) => {
  const LINES = lines;
  const serviceBySlug = (slug: string) => services.find((service) => service.slug === slug) as ServiceItem;
  // Row index across all lines, used to stagger the first draw of the map.
  const ORDER = LINES.flatMap((line) => line.slugs);
  return { LINES, ORDER, serviceBySlug };
};

// Distance from a row's top to its station; the rail segments in globals.css use the same value.
const STATION_Y = 30;
const TONE_RAIL: Record<Tone, string> = { teal: 'bg-[#12B8B0]', gold: 'bg-[#C6A15B]' };
const TONE_TEXT: Record<Tone, string> = { teal: 'text-[#3ED0C8]', gold: 'text-[#E2C98C]' };
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

const Rail: React.FC<{ tone: Tone; isLast: boolean; order: number }> = ({ tone, isLast, order }) => (
  <span
    aria-hidden="true"
    data-last={isLast}
    className={`svc-rail ${TONE_RAIL[tone]}`}
    style={{ '--i': order } as React.CSSProperties}
  />
);

const LineHeading: React.FC<{ title: string; tone: Tone; count: number; order: number }> = ({ title, tone, count, order }) => (
  <div className="svc-row relative pr-10 pt-6 pb-2" style={{ '--i': order } as React.CSSProperties}>
    <span aria-hidden="true" className={`svc-rail svc-rail-head ${TONE_RAIL[tone]}`} style={{ '--i': order } as React.CSSProperties} />
    <span
      aria-hidden="true"
      className={`absolute right-[5px] top-[27px] w-3.5 h-3.5 rounded-full bg-[#07191F] border-[3px] ${tone === 'teal' ? 'border-[#12B8B0]' : 'border-[#C6A15B]'}`}
    />
    <h3 className={`font-bold text-sm ${TONE_TEXT[tone]}`}>
      {title}
      <span className="sr-only"> ({count} خدمت)</span>
    </h3>
  </div>
);

// ---- Desktop: rows preview on hover or focus, the panel holds the detail ------

const ServicePanel: React.FC<{ service: ServiceItem }> = ({ service }) => (
  <div key={service.slug} className="svc-panel-content flex flex-col flex-none">
    <div className="relative z-10 px-7 -mt-20">
      <span className="inline-block mb-2.5 px-2.5 py-1 rounded-md bg-[#07191F]/80 text-[#E2C98C] text-xs font-bold">{service.badge}</span>
      <h3 className="text-[1.65rem] leading-[1.45] font-black text-white max-w-[30rem]">{service.title}</h3>
    </div>

    <div className="px-7 pt-3 pb-6">
      <p className="text-sm leading-[1.9] text-[#B7C8CD] max-w-[36rem]">{service.summary}</p>

      <ul className="mt-3.5 space-y-1.5">
        {service.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[13px] leading-relaxed text-[#E4ECEE]">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#12B8B0] shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* The real steps of this service, drawn as a short line of its own */}
      <ol className="mt-5 grid grid-cols-4 gap-3" aria-label="مراحل انجام خدمت">
        {service.steps.slice(0, 4).map((step, index) => (
          <li key={`${index}-${step.title}`} className="relative pt-4 text-[11.5px] leading-[1.6] text-[#A2B6BC]">
            {index < 3 && <span aria-hidden="true" className="absolute top-[4px] right-0 -left-3 h-px bg-[#C6A15B]/45" />}
            <span aria-hidden="true" className="absolute top-0 right-0 w-[9px] h-[9px] rounded-full bg-[#C6A15B]" />
            {step.title}
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/services/${service.slug}`}
          className={`group inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-sm transition-colors ${FOCUS}`}
        >
          <span>جزئیات کامل و مدارک</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </Link>
        <Link
          href={`/consultation?service=${service.slug}`}
          className={`inline-flex items-center px-4 py-3 rounded-lg text-[#E2C98C] hover:text-white font-bold text-sm transition-colors ${FOCUS}`}
        >
          مشاوره درباره این خدمت
        </Link>
      </div>
    </div>
  </div>
);

const DesktopMap: React.FC<MapProps> = (props) => {
  const { LINES, ORDER, serviceBySlug } = useMapData(props);
  const [activeSlug, setActiveSlug] = useState(ORDER[0]);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [markerY, setMarkerY] = useState<number | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A short delay so crossing several rows on the way to one doesn't flash every photo.
  const previewSoon = (slug: string) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveSlug(slug), 70);
  };

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const row = rowRefs.current[activeSlug];
      if (row) setMarkerY(row.getBoundingClientRect().top - list.getBoundingClientRect().top + STATION_Y);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeSlug]);

  const active = serviceBySlug(activeSlug);

  return (
    <div className="hidden lg:grid grid-cols-12 items-start">
      <div ref={listRef} className="col-span-5 relative" onMouseLeave={() => clearTimeout(hoverTimer.current)}>
        {LINES.map((line) => (
          <div key={line.id}>
            <LineHeading title={line.title} tone={line.tone} count={line.slugs.length} order={ORDER.indexOf(line.slugs[0])} />
            <ul>
              {line.slugs.map((slug, index) => {
                const service = serviceBySlug(slug);
                const Icon = serviceIcon(service.icon);
                const isActive = slug === activeSlug;
                const order = ORDER.indexOf(slug);
                return (
                  <li
                    key={slug}
                    ref={(element) => {
                      rowRefs.current[slug] = element;
                    }}
                    className="svc-row relative"
                    style={{ '--i': order } as React.CSSProperties}
                  >
                    <Rail tone={line.tone} isLast={index === line.slugs.length - 1} order={order} />
                    <span aria-hidden="true" className={`absolute right-[7px] top-[25px] w-2.5 h-2.5 rounded-full border-2 border-[#07191F] ${TONE_RAIL[line.tone]}`} />
                    <Link
                      href={`/services/${slug}`}
                      aria-current={isActive ? 'true' : undefined}
                      onMouseEnter={() => previewSoon(slug)}
                      onFocus={() => setActiveSlug(slug)}
                      className={`mr-8 flex items-center gap-3 min-h-[60px] pr-3 pl-5 rounded-r-xl transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C] ${
                        isActive ? 'bg-[#0C252B]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#E2C98C]' : 'text-[#7FA2AA]'}`} />
                      <span className={`font-bold text-[15.5px] transition-colors ${isActive ? 'text-white' : 'text-[#D5E0E3]'}`}>{service.shortTitle}</span>
                      <span className={`hidden xl:block mr-auto text-xs text-left whitespace-nowrap transition-colors ${isActive ? 'text-[#E2C98C]' : 'text-[#7F979E]'}`}>{service.badge}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* The marker that travels the line to the chosen service */}
        {markerY !== null && (
          <span
            aria-hidden="true"
            className="svc-marker absolute right-0 top-0 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ transform: `translateY(${markerY - 12}px)` }}
          >
            <span className="absolute inset-0 rounded-full bg-[#E2C98C]/25" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#E2C98C] border-[3px] border-[#07191F] outline-1 outline-[#E2C98C]" />
          </span>
        )}
      </div>

      <aside
        aria-label={active.title}
        className="col-span-7 sticky top-24 flex flex-col h-[calc(100svh-7rem)] min-h-[560px] max-h-[780px] rounded-2xl rounded-tr-none overflow-hidden bg-[#0C252B]"
      >
        <div className="relative flex-1 min-h-0 overflow-hidden bg-[#07191F]">
          {props.services.map((service) => (
            <div key={service.slug} data-active={service.slug === activeSlug} className="svc-photo absolute inset-0">
              <ServiceImage src={service.image} alt="" category={service.category} slug={service.slug} />
            </div>
          ))}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0C252B] via-[#0C252B]/30 to-[#07191F]/10" />
        </div>
        <ServicePanel service={active} />
      </aside>
    </div>
  );
};

// ---- Small screens: the same line, with each stop opening where it stands -----

const MobileMap: React.FC<MapProps> = (props) => {
  const { LINES, ORDER, serviceBySlug } = useMapData(props);
  const [openSlug, setOpenSlug] = useState<string | null>(ORDER[0]);
  // Photos load only once a stop has been opened, and stay for a smooth close.
  const [visited, setVisited] = useState<string[]>([ORDER[0]]);
  const anchorFrame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(anchorFrame.current), []);

  const toggle = (slug: string, button: HTMLButtonElement) => {
    setVisited((list) => (list.includes(slug) ? list : [...list, slug]));
    setOpenSlug((current) => (current === slug ? null : slug));

    // Closing the stop above would otherwise pull the tapped row out from under the finger.
    cancelAnimationFrame(anchorFrame.current);
    const startTop = button.getBoundingClientRect().top;
    const startedAt = performance.now();
    const hold = (now: number) => {
      const drift = button.getBoundingClientRect().top - startTop;
      if (Math.abs(drift) > 0.5) window.scrollBy({ top: drift, behavior: 'instant' });
      if (now - startedAt < 450) anchorFrame.current = requestAnimationFrame(hold);
    };
    anchorFrame.current = requestAnimationFrame(hold);
  };

  return (
    <div className="lg:hidden">
      {LINES.map((line) => (
        <div key={line.id}>
          <LineHeading title={line.title} tone={line.tone} count={line.slugs.length} order={ORDER.indexOf(line.slugs[0])} />
          <ul>
            {line.slugs.map((slug, index) => {
              const service = serviceBySlug(slug);
              const Icon = serviceIcon(service.icon);
              const isOpen = openSlug === slug;
              const order = ORDER.indexOf(slug);
              const panelId = `service-stop-${slug}`;
              return (
                <li key={slug} className="svc-row relative" style={{ '--i': order } as React.CSSProperties}>
                  <Rail tone={line.tone} isLast={index === line.slugs.length - 1} order={order} />
                  <span
                    aria-hidden="true"
                    className={`absolute top-[23px] rounded-full transition-all ${
                      isOpen ? 'right-[4px] w-4 h-4 bg-[#E2C98C] border-[3px] border-[#07191F] outline-1 outline-[#E2C98C]' : `right-[7px] w-2.5 h-2.5 border-2 border-[#07191F] mt-[3px] ${TONE_RAIL[line.tone]}`
                    }`}
                  />
                  <div className={`mr-8 rounded-xl transition-colors ${isOpen ? 'bg-[#0C252B]' : ''}`}>
                    <h4>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={(event) => toggle(slug, event.currentTarget)}
                        className="w-full min-h-[60px] flex items-center gap-3 px-3 py-2 text-right rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C]"
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[#E2C98C]' : 'text-[#7FA2AA]'}`} />
                        <span className="flex-1 min-w-0">
                          <span className="block font-bold text-[15px] leading-snug text-white">{service.shortTitle}</span>
                          <span className={`block mt-0.5 text-xs ${isOpen ? 'text-[#E2C98C]' : 'text-[#8FA5AB]'}`}>{service.badge}</span>
                        </span>
                        <ChevronDown className={`w-5 h-5 shrink-0 text-[#7FA2AA] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </h4>

                    <div id={panelId} data-open={isOpen} className="svc-fold">
                      <div className="overflow-hidden">
                        {visited.includes(slug) && (
                          <div className="px-3 pb-4">
                            <div className="svc-photo relative aspect-[16/9] rounded-lg overflow-hidden bg-[#07191F]" data-active="true">
                              <ServiceImage src={service.image} alt="" category={service.category} slug={slug} />
                            </div>
                            <p className="mt-3 text-sm leading-[1.9] text-[#B7C8CD]">{service.summary}</p>
                            <ul className="mt-3 space-y-1.5">
                              {service.features.slice(0, 2).map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-[13px] leading-relaxed text-[#E4ECEE]">
                                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#12B8B0] shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Link
                              href={`/services/${slug}`}
                              className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#12B8B0] text-[#07191F] font-extrabold text-sm ${FOCUS}`}
                            >
                              <span>جزئیات کامل و مدارک</span>
                              <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/consultation?service=${slug}`}
                              className={`mt-2 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-[#E2C98C] font-bold text-sm ${FOCUS}`}
                            >
                              مشاوره درباره این خدمت
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

// ---- Section -----------------------------------------------------------------

export const ServicesHighlight: React.FC<MapProps> = ({ services, lines }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useRevealOnce(sectionRef);

  return (
    <section ref={sectionRef} data-reveal={reveal} className="relative bg-[#07191F] border-y border-[#12B8B0]/20 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-6 lg:mb-8 text-right">
          <h2 className="text-[1.9rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.35] text-[#F7F7F3] [text-wrap:balance]">
            خدمات تخصصی و بین‌المللی گیتی پیما
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] sm:text-lg leading-[1.95] text-[#B7C8CD]">
            ارائه زنجیره‌ای هماهنگ و بدون واسطه از خدمات حمل‌ونقل مسافری، کارگو گمرکی، ثبت شرکت و صرافی رسمی میان ایران، ترکیه و اتحادیه اروپا.
          </p>
        </header>

        {lines.length > 0 && (
          <>
            <DesktopMap services={services} lines={lines} />
            <MobileMap services={services} lines={lines} />
          </>
        )}

        <div className="mt-10 lg:mt-14 pt-7 border-t border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-right">
          <div>
            <p className="font-extrabold text-lg sm:text-xl text-white">نمی‌دانید کدام خدمت مناسب شماست؟</p>
            <p className="mt-1 text-sm text-[#A2B6BC]">شرایط‌تان را بگویید؛ کارشناسان دفاتر استانبول و تهران مسیر درست را پیشنهاد می‌دهند.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/consultation"
              className={`inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-[#E2C98C] hover:bg-[#F0DCA8] text-[#07191F] font-extrabold text-sm transition-colors ${FOCUS}`}
            >
              درخواست مشاوره
            </Link>
            <Link
              href="/services"
              className={`inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-[#F7F7F3] border border-white/25 hover:border-[#12B8B0] font-bold text-sm transition-colors ${FOCUS}`}
            >
              جستجو در فهرست خدمات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
