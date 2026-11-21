'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PhoneCall, Menu, X, ArrowUpRight, ChevronDown, MapPin, Navigation } from 'lucide-react';
import { useSite } from '../site/SiteProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '../../i18n/I18nProvider';
import { stripLocale } from '../../i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { BrandEmblem } from './BrandEmblem';
import { MobileServicesList, ServicesMegaMenu } from './ServicesMegaMenu';
import { officeMap } from '../../lib/maps';

const MEGA_MENU_ID = 'services-mega-menu';
const MOBILE_SERVICES_ID = 'mobile-services-list';

export const Header: React.FC = () => {
  // Without the language, so it compares with the nav paths
  const currentPath = stripLocale(usePathname());
  const router = useRouter();
  const { t: { layout: { header: t }, common: { brand, location } }, path, locale } = useI18n();
  const { settings, serviceMenu, offices } = useSite();
  const supportPhone = settings.support_phone;
  const map = officeMap(settings, locale);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  // The mega menu closes on a click outside it, on Escape and when the page changes
  useEffect(() => {
    if (!isServicesOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key !== 'Escape') return;
        setIsServicesOpen(false);
        servicesRef.current?.querySelector<HTMLButtonElement>('button[aria-controls]')?.focus();
      } else if (!servicesRef.current?.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isServicesOpen]);

  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.services, path: '/services' },
    { label: t.nav.blog, path: '/blog' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
  ];

  // Keep page switches instant, as they were with client-side routing
  useEffect(() => {
    [...navLinks.map((link) => link.path), '/consultation'].forEach((to) => router.prefetch(path(to)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, locale]);

  // Real links, so crawlers can follow the menu; the scroll to the top stays smooth as before
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top emergency bar */}
      <div className="bg-canvas-deep border-b border-brand/15 py-1.5 px-4 text-xs text-ink-muted">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-fill animate-pulse"></span>
            <span className="text-gold font-medium">{t.officialAgent}</span>
            <span className="hidden sm:inline text-ink-dim">|</span>
            <span className="hidden md:inline text-ink/80">{t.dailyVip}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`tel:${supportPhone.replace(/[\s()-]/g, '')}`}
              className="flex items-center gap-1.5 text-brand hover:text-brand-bright transition-colors"
              dir="ltr"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="font-mono">{supportPhone}</span>
            </a>
            <span className="hidden sm:inline bg-brand/20 text-brand px-2 py-0.5 rounded font-mono">
              {t.support247}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-canvas/90 backdrop-blur-xl border-b border-brand/20 shadow-xl py-3'
            : 'bg-canvas/70 backdrop-blur-md border-b border-ink/5 py-4'
        }`}
      >
        <div ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link
            href={path('/')}
            scroll={false}
            onClick={handleNavClick}
            className="flex items-center gap-3 text-start group focus:outline-none"
            aria-label={t.homeAria}
          >
            {/* Visual Logo Emblem */}
            <BrandEmblem
              variant="plate"
              priority
              className={`shrink-0 transition-all duration-300 group-hover:scale-105 ${
                isScrolled ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-12 h-12 sm:w-14 sm:h-14'
              }`}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-xl sm:text-2xl font-black text-ink tracking-tight">
                  {brand}
                </span>
                {/* The Latin name only adds anything next to the Persian one */}
                {locale === 'fa' && (
                  <span className="hidden xl:inline whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] text-xs font-extrabold tracking-widest text-brand bg-brand/10 px-1.5 py-0.5 rounded border border-brand/30">
                    ROYAL TRAVEL
                  </span>
                )}
              </div>
              <p className="text-[10px] text-ink-muted font-medium tracking-wide">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface/60 p-1 rounded-full border border-brand/15 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              if (link.path === '/services') {
                return (
                  <button
                    key={link.path}
                    type="button"
                    aria-expanded={isServicesOpen}
                    aria-controls={MEGA_MENU_ID}
                    onClick={() => setIsServicesOpen((open) => !open)}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 xl:px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line ${
                      isActive
                        ? 'bg-brand-fill text-on-brand font-bold shadow-md shadow-brand/25'
                        : isServicesOpen
                          ? 'bg-ink/10 text-ink-strong'
                          : 'text-ink/80 hover:text-ink-strong hover:bg-ink/5'
                    }`}
                  >
                    {link.label}
                    <ChevronDown aria-hidden="true" className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                );
              }
              return (
                <Link
                  key={link.path}
                  href={path(link.path)}
                  scroll={false}
                  onClick={handleNavClick}
                  className={`whitespace-nowrap px-2.5 xl:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-fill text-on-brand font-bold shadow-md shadow-brand/25'
                      : 'text-ink/80 hover:text-ink-strong hover:bg-ink/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Primary Consultation Button */}
          <div className="hidden sm:flex items-center gap-1.5 xl:gap-3">
            <ThemeToggle />
            {map.placeUrl && (
              <a
                href={map.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={location.buttonAria}
                title={location.buttonAria}
                className="header-location group relative grid place-items-center h-[34px] w-[34px] shrink-0 rounded-full border border-gold-line/40 bg-surface/70 text-sm font-bold text-ink transition-colors hover:border-gold-line hover:bg-surface hover:text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line"
              >
                <span className="header-location-pin relative grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-gold-fill to-gold-deep-fill text-on-accent shadow-md shadow-gold-deep-fill/30">
                  <MapPin aria-hidden="true" className="header-location-icon h-4 w-4" />
                </span>
              </a>
            )}
            <LanguageSwitcher />
            <Link
              href={path('/consultation')}
              scroll={false}
              onClick={handleNavClick}
              className="relative group overflow-hidden whitespace-nowrap px-4 xl:px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-deep-fill via-gold-fill to-gold-deep-fill text-on-accent font-bold text-sm shadow-lg shadow-gold-deep-fill/20 hover:shadow-gold-deep-fill/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <span className="hidden xl:inline">{t.consultation}</span>
              <span className="xl:hidden">{t.consultationShort}</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle className="sm:hidden" />
            <Link
              href={path('/consultation')}
              scroll={false}
              onClick={handleNavClick}
              className="sm:hidden px-3 py-1.5 rounded-full bg-gold-deep-fill text-on-accent text-xs font-bold"
            >
              {t.consultationShort}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-surface border border-brand/30 text-ink hover:text-brand transition-colors"
              aria-label={isMobileMenuOpen ? t.closeMenu : t.openMenu}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <ServicesMegaMenu id={MEGA_MENU_ID} open={isServicesOpen} groups={serviceMenu} onNavigate={handleNavClick} />
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-canvas/98 border-b border-brand/20 px-4 pt-3 pb-6 mt-3 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              if (link.path === '/services') {
                return (
                  <div key={link.path}>
                    <button
                      type="button"
                      aria-expanded={isMobileServicesOpen}
                      aria-controls={MOBILE_SERVICES_ID}
                      onClick={() => setIsMobileServicesOpen((open) => !open)}
                      className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive ? 'bg-brand-fill text-on-brand font-bold' : 'text-ink hover:bg-surface'
                      }`}
                    >
                      {link.label}
                      <ChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileServicesOpen && <MobileServicesList id={MOBILE_SERVICES_ID} groups={serviceMenu} onNavigate={handleNavClick} />}
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  href={path(link.path)}
                  scroll={false}
                  onClick={handleNavClick}
                  className={`block w-full text-start px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-fill text-on-brand font-bold'
                      : 'text-ink hover:bg-surface'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {map.placeUrl && (
              <div className="flex items-stretch gap-2 pt-2">
                <a
                  href={map.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={location.buttonAria}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gold-line/30 bg-surface px-3 py-2.5"
                >
                  <span className="header-location-pin relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-fill to-gold-deep-fill text-on-accent">
                    <MapPin aria-hidden="true" className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold text-ink-strong">{location.menuTitle}</span>
                    {offices[0] && <span className="block truncate text-xs text-ink-muted">{offices[0].address}</span>}
                  </span>
                </a>
                <a
                  href={map.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={location.directions}
                  className="grid w-12 shrink-0 place-items-center rounded-xl bg-brand-fill text-on-brand"
                >
                  <Navigation aria-hidden="true" className="h-5 w-5" />
                </a>
              </div>
            )}

            <div className="pt-3 border-t border-ink/10 space-y-3">
              <LanguageSwitcher variant="list" />
              <Link
                href={path('/consultation')}
                scroll={false}
                onClick={handleNavClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-deep-fill to-gold-fill text-on-accent font-bold text-center block shadow-lg shadow-gold-deep-fill/30"
              >
                {t.consultationFull}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
