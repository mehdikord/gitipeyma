'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, PhoneCall } from 'lucide-react';
import { socialIcon } from '../../modules/socialLinks/icons';
import { useSite } from '../site/SiteProvider';
import { CITIES, LonLat, ROAD_PATH, STAGE, project } from '../home/hero/geo';
import { telHref } from '../../utils/contact';
import { useI18n } from '../../i18n/I18nProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';
const LINK = `inline-block py-1 text-[15px] text-ink-soft hover:text-ink-strong transition-colors rounded ${FOCUS}`;

const PAGES = [
  { href: '/', key: 'home' },
  { href: '/services', key: 'services' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
  { href: '/consultation', key: 'consultation' },
] as const;

// ---- The sky behind the footer: the brand map, drifting, with the corridor lit ----

const stagePosition = (at: LonLat) => {
  const point = project(at);
  return { left: `${(point.x / STAGE.width) * 100}%`, top: `${(point.y / STAGE.height) * 100}%` };
};

const LIT_CITIES: LonLat[] = [CITIES.tehran, CITIES.ankara, CITIES.istanbul];

const FooterSky: React.FC = () => (
  <div aria-hidden="true" className="footer-sky">
    <div className="footer-stage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/map.svg" alt="" width={STAGE.width} height={STAGE.height} loading="lazy" className="footer-map absolute inset-0 w-full h-full" />
      <svg viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} className="absolute inset-0 w-full h-full">
        <path d={ROAD_PATH} fill="none" stroke="#E2C98C" strokeOpacity="0.22" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROAD_PATH} fill="none" stroke="#E2C98C" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="footer-route" />
      </svg>
      {LIT_CITIES.map((city, index) => (
        <span key={index} className="footer-city" style={{ ...stagePosition(city), '--i': index } as React.CSSProperties} />
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/55 to-canvas-deep/85" />
  </div>
);

// ---- Footer -------------------------------------------------------------------

export const Footer: React.FC = () => {
  const yearRef = useRef<HTMLSpanElement>(null);

  // The footer is prerendered at build time, so the year is refreshed in the browser
  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.textContent = String(new Date().getFullYear());
    }
  }, []);

  const { settings, offices, socials, serviceLinks } = useSite();
  const { t: { layout: { footer: t }, common: { brand } }, path, num, fill, locale, digits } = useI18n();
  const headOffice = offices[0];

  return (
    <footer className="relative overflow-hidden bg-canvas-deep text-ink-soft border-t border-brand/20">
      <FooterSky />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10 pb-12 border-b border-ink/10">
          {/* Who we are */}
          <div className="col-span-2 lg:col-span-4">
            <Link href={path('/')} className={`inline-flex items-center gap-3 rounded ${FOCUS}`} aria-label={t.homeAria}>
              <span className="w-11 h-11 rounded-xl bg-canvas border border-gold-line/50 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] font-black text-lg text-gold">
                RT
              </span>
              <span>
                <span className="block text-xl font-black text-ink">{brand}</span>
                <span className="block text-xs text-ink-muted">{t.tagline}</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-[15px] leading-[1.95] text-ink-soft">
              {t.about}
            </p>
            <p className="mt-4 text-sm font-bold text-gold">{settings.brand_tagline}</p>

            <ul className="mt-6 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcon(social.iconName);
                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className={`flex items-center justify-center w-11 h-11 rounded-lg border border-ink/15 text-ink-soft hover:text-on-accent hover:bg-brand-fill hover:border-brand transition-colors ${FOCUS}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav aria-label={t.pagesAria} className="col-span-1 lg:col-span-2">
            <h3 className="mb-3 text-sm font-extrabold text-ink">{t.pages}</h3>
            <ul className="space-y-1.5">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={path(page.href)} className={LINK}>
                    {t.nav[page.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.services} className="col-span-1 lg:col-span-3">
            <h3 className="mb-3 text-sm font-extrabold text-ink">{t.services}</h3>
            <ul className="space-y-1.5">
              {serviceLinks.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link href={path(`/services/${service.slug}`)} className={LINK}>
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={path('/services')} className={`inline-block py-1 text-[15px] font-bold text-gold hover:text-ink-strong transition-colors rounded ${FOCUS}`}>
                  {fill(t.allServices, { count: num(serviceLinks.length) })}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Where to reach us: the line that never closes first, then each office */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="mb-3 text-sm font-extrabold text-ink">{t.contact}</h3>
            <a href={telHref(settings.support_phone)} className={`group block py-1 rounded ${FOCUS}`}>
              <span className="flex items-center gap-2 text-sm text-gold">
                <PhoneCall className="w-4 h-4" />
                <span>{t.support}</span>
              </span>
              <span dir="ltr" className="block mt-0.5 text-lg font-extrabold text-ink group-hover:text-ink-strong rtl:text-right">
                {settings.support_phone}
              </span>
            </a>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {offices.map((office) => (
                <li key={office.id}>
                  <span className="block text-sm font-bold text-ink">{office.name}</span>
                  {office.phones[0] && (
                    <a dir="ltr" href={telHref(office.phones[0])} className={`inline-block mt-0.5 text-[15px] text-ink-soft hover:text-ink-strong transition-colors rounded ${FOCUS}`}>
                      {locale === 'fa' ? office.phones[0] : digits(office.phones[0])}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-5 max-w-60">
              <h4 className="mb-2 text-xs font-bold text-ink-dim">{t.language}</h4>
              <LanguageSwitcher variant="list" />
            </div>
            {headOffice?.email && (
              <a href={`mailto:${headOffice.email}`} className={`mt-4 inline-flex items-center gap-2 py-1 text-[15px] text-ink-soft hover:text-ink-strong transition-colors rounded ${FOCUS}`}>
                <Mail className="w-4 h-4 text-brand" />
                <span dir="ltr">{headOffice.email}</span>
              </a>
            )}
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[13px] leading-relaxed text-ink-dim">
          <p>
            © <span ref={yearRef} suppressHydrationWarning>{new Date().getFullYear()}</span> {t.rights}
          </p>
          <p>{t.legal}</p>
        </div>
      </div>
    </footer>
  );
};
