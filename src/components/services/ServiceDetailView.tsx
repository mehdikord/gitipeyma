'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, ChevronDown, ChevronLeft, Coffee, PhoneCall, Tv, Wifi } from 'lucide-react';
import type { CurrencyRate, ServiceItem } from '../../types';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { telHref } from '../../utils/contact';
import { useSite } from '../site/SiteProvider';
import { ServiceImage } from '../ui/ServiceImage';
import { ServiceRequestForm } from './ServiceRequestForm';
import { CurrencyCalculator } from './CurrencyCalculator';
import { useI18n } from '../../i18n/I18nProvider';

interface ServiceDetailViewProps {
  service: ServiceItem;
  relatedServices: ServiceItem[];
  // Only the currency service shows the calculator, with these rates.
  currencies?: { rates: CurrencyRate[]; feePercent: number };
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';
const SECTION_TITLE = 'text-2xl sm:text-3xl font-black text-[#F7F7F3] leading-snug';

// The page's sections in order; their labels are in the dictionary under detail.sections.
const SECTIONS = ['about', 'benefits', 'steps', 'faq', 'request'] as const;

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ service, relatedServices, currencies }) => {
  const SUPPORT_TEL = telHref(useSite().settings.support_phone);
  const { t: { services: { detail: t } }, num, path } = useI18n();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0]);
  const [requestReached, setRequestReached] = useState(false);

  const stepsRef = useRef<HTMLElement>(null);
  const stepsReveal = useRevealOnce(stepsRef);

  const sections = SECTIONS.filter((id) => id !== 'faq' || service.faqs.length > 0).map((id) => ({ id, label: t.sections[id] }));

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    // Once the form has been reached the bar stays away, so it never covers the footer
    const requestWatcher = new IntersectionObserver(([entry]) => setRequestReached(entry.isIntersecting || entry.boundingClientRect.top < 0));
    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) spy.observe(element);
      if (element && id === 'request') requestWatcher.observe(element);
    });
    return () => {
      spy.disconnect();
      requestWatcher.disconnect();
    };
  }, [service.slug]);

  return (
    <main className="bg-[#07191F] text-[#F7F7F3]">
      {/* Hero: the photo fades into the page behind the text */}
      <header className="relative overflow-hidden">
        <div className="relative h-[52vw] max-h-[420px] sm:h-[44vw] lg:absolute lg:inset-y-0 lg:end-0 lg:start-auto lg:w-[66%] lg:h-auto lg:max-h-none">
          <ServiceImage src={service.image} alt="" category={service.category} slug={service.slug} isHero className="service-hero-photo" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07191F] via-transparent to-[#07191F]/20 lg:bg-gradient-to-l ltr:lg:bg-gradient-to-r lg:from-[#07191F] lg:via-[#07191F]/35 lg:to-[#07191F]/10" />
          <div aria-hidden="true" className="hidden lg:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07191F] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 lg:mt-0 lg:min-h-[500px] lg:flex lg:flex-col lg:justify-center pb-8 lg:py-14">
          <nav aria-label={t.breadcrumb} className="flex flex-wrap items-center gap-1 text-[13px] text-[#A2B6BC]">
            <Link href={path('/')} className={`py-1 hover:text-white transition-colors rounded ${FOCUS}`}>
              {t.home}
            </Link>
            <ChevronLeft aria-hidden="true" className="w-3.5 h-3.5 ltr:rotate-180" />
            <Link href={path('/services')} className={`py-1 hover:text-white transition-colors rounded ${FOCUS}`}>
              {t.services}
            </Link>
            <ChevronLeft aria-hidden="true" className="w-3.5 h-3.5 ltr:rotate-180" />
            <span className="py-1 text-[#D5E0E3]">{service.categoryLabel}</span>
          </nav>

          <div className="max-w-[40rem]">
            {service.badge && <p className="mt-5 text-sm font-bold text-[#E2C98C]">{service.badge}</p>}
            <h1 className="mt-2 text-[2rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.3] text-[#F7F7F3] [text-wrap:balance]">{service.title}</h1>
            <p className="mt-4 text-[15px] sm:text-lg leading-[1.95] text-[#C9D7DB]">{service.summary}</p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="#request"
                className={`group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-[15px] transition-colors ${FOCUS}`}
              >
                <span>{t.requestThis}</span>
                <ArrowLeft className="w-4 h-4 transition-transform ltr:rotate-180 group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
              </a>
              <a
                href={SUPPORT_TEL}
                className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg text-[#E2C98C] border border-[#C6A15B]/50 hover:border-[#E2C98C] hover:bg-[#C6A15B]/10 font-bold text-[15px] transition-colors ${FOCUS}`}
              >
                <PhoneCall className="w-[18px] h-[18px]" />
                <span>{t.callSupport}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Where you are on this page, and a quick way to the part you came for */}
      <nav aria-label={t.pageSections} className="sticky top-[68px] lg:top-[72px] z-30 bg-[#07191F] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`relative shrink-0 px-3 sm:px-4 py-3.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C] ${
                  isActive ? 'text-white' : 'text-[#A2B6BC] hover:text-white'
                }`}
              >
                {section.label}
                {isActive && <span aria-hidden="true" className="absolute inset-x-3 sm:inset-x-4 -bottom-px h-0.5 bg-[#E2C98C]" />}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section id="about" className="service-anchor pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
          <h2 className={`${SECTION_TITLE} lg:col-span-3`}>{t.aboutTitle}</h2>
          <div className="lg:col-span-9">
            <p className="max-w-3xl text-lg sm:text-xl leading-[2] text-[#E4ECEE]">{service.description}</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl">
              {service.detailedContent.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-[2] text-[#A2B6BC]">
                  {paragraph}
                </p>
              ))}
            </div>

            {currencies && currencies.rates.length > 0 && (
              <div className="mt-10">
                <CurrencyCalculator rates={currencies.rates} feePercent={currencies.feePercent} />
              </div>
            )}

            {service.slug === 'bus-vip-tehran-istanbul' && (
              <div className="mt-10 rounded-2xl bg-[#0C252B] p-5 sm:p-7">
                <h3 className="flex items-center gap-2.5 text-lg font-extrabold text-white">
                  <Calendar aria-hidden="true" className="w-5 h-5 text-[#E2C98C]" />
                  <span>{t.bus.title}</span>
                </h3>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm leading-[1.9]">
                  <div>
                    <p className="font-bold text-[#E2C98C]">{t.bus.route}</p>
                    <p className="mt-1 text-white">{t.bus.departures}</p>
                    <p className="text-[#A2B6BC]">{t.bus.origin}</p>
                    <p className="text-[#A2B6BC]">{t.bus.destination}</p>
                  </div>
                  <ul className="space-y-2 text-[#E4ECEE]">
                    <li className="flex items-center gap-2.5">
                      <Wifi aria-hidden="true" className="w-4 h-4 text-[#12B8B0] shrink-0" />
                      <span>{t.bus.wifi}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Tv aria-hidden="true" className="w-4 h-4 text-[#12B8B0] shrink-0" />
                      <span>{t.bus.screen}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Coffee aria-hidden="true" className="w-4 h-4 text-[#12B8B0] shrink-0" />
                      <span>{t.bus.snacks}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="benefits" className="service-anchor pt-14 sm:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
          <h2 className={`${SECTION_TITLE} lg:col-span-3`}>{t.benefitsTitle}</h2>
          <ul className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-white/10">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 py-4 border-b border-white/10 text-[15px] leading-[1.85] text-[#E4ECEE]">
                <CheckCircle2 aria-hidden="true" className="w-5 h-5 mt-0.5 text-[#12B8B0] shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section ref={stepsRef} id="steps" data-reveal={stepsReveal} className="service-anchor pt-14 sm:pt-20">
          <h2 className={SECTION_TITLE}>{t.stepsTitle}</h2>
          <ol className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-x-8">
            {service.steps.map((step, index) => (
              <li key={`${index}-${step.title}`} className="svc-row relative ps-14 lg:ps-0 lg:pt-16 pb-8 lg:pb-0" style={{ '--i': index * 2 } as React.CSSProperties}>
                {index < service.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="service-step-rail absolute bg-[#C6A15B]/60 top-11 bottom-0 start-[21px] w-0.5 lg:top-[21px] lg:bottom-auto lg:start-11 lg:-end-8 lg:w-auto lg:h-0.5"
                    style={{ '--i': index * 2 } as React.CSSProperties}
                  />
                )}
                <span className="absolute top-0 start-0 w-11 h-11 rounded-full bg-[#E2C98C] text-[#07191F] flex items-center justify-center font-black text-base">
                  {num(index + 1)}
                </span>
                <h3 className="pt-1.5 lg:pt-0 text-[17px] font-extrabold leading-snug text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.95] text-[#A2B6BC]">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {service.faqs.length > 0 && (
          <section id="faq" className="service-anchor pt-14 sm:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
            <h2 className={`${SECTION_TITLE} lg:col-span-3`}>{t.faqTitle}</h2>
            <div className="lg:col-span-9 border-t border-white/10">
              {service.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.question} className="border-b border-white/10">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`service-faq-${index}`}
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between gap-4 min-h-[60px] py-3 text-start text-[15px] sm:text-base font-bold text-white hover:text-[#E2C98C] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E2C98C]"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown aria-hidden="true" className={`w-5 h-5 shrink-0 text-[#7FA2AA] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </h3>
                    <div id={`service-faq-${index}`} data-open={isOpen} className="svc-fold">
                      <div className="overflow-hidden">
                        <p className="pb-5 max-w-3xl text-[15px] leading-[2] text-[#A2B6BC]">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section id="request" className="service-anchor pt-14 sm:pt-20">
          <div className="max-w-2xl mb-8">
            <h2 className={SECTION_TITLE}>{t.requestTitle}</h2>
            <p className="mt-3 text-[15px] sm:text-base leading-[1.95] text-[#A2B6BC]">
              {t.requestIntro}
            </p>
          </div>
          <ServiceRequestForm key={service.slug} serviceId={service.id} serviceShortTitle={service.shortTitle} />
        </section>

        <section className="pt-16 sm:pt-24 pb-16 sm:pb-24">
          <h2 className="text-xl sm:text-2xl font-black text-[#F7F7F3]">{t.related}</h2>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedServices.map((related) => (
              <li key={related.slug}>
                <Link href={path(`/services/${related.slug}`)} className={`group flex md:block items-center gap-4 rounded-xl ${FOCUS}`}>
                  <span className="relative block w-24 h-20 md:w-full md:h-auto md:aspect-[16/9] shrink-0 rounded-lg overflow-hidden bg-[#0C252B]">
                    <ServiceImage src={related.image} alt="" category={related.category} slug={related.slug} className="service-hero-photo" />
                  </span>
                  <span className="block md:mt-3">
                    <span className="block font-extrabold text-[15px] sm:text-base text-white group-hover:text-[#E2C98C] transition-colors">{related.shortTitle}</span>
                    <span className="block mt-1 text-[13px] text-[#A2B6BC]">{related.categoryLabel}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Phones: the request stays one tap away until the form itself is on screen */}
      <div
        data-hidden={requestReached}
        className="service-request-bar lg:hidden fixed inset-x-0 bottom-0 z-30 flex gap-2 px-4 pt-3 bg-[#07191F] border-t border-white/15"
      >
        <a href="#request" className={`flex-1 inline-flex items-center justify-center min-h-12 rounded-lg bg-[#12B8B0] text-[#07191F] font-extrabold text-[15px] ${FOCUS}`}>
          {t.request}
        </a>
        <a
          href={SUPPORT_TEL}
          aria-label={t.callSupport}
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-[#E2C98C] border border-[#C6A15B]/50 ${FOCUS}`}
        >
          <PhoneCall className="w-5 h-5" />
        </a>
      </div>
    </main>
  );
};
