'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, Menu, X, ArrowUpRight, ShieldCheck, ChevronDown, Compass } from 'lucide-react';
import { useSite } from '../site/SiteProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigate } from '../../hooks/useNavigate';
import { useI18n } from '../../i18n/I18nProvider';
import { stripLocale } from '../../i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  // Without the language, so it compares with the nav paths
  const currentPath = stripLocale(usePathname());
  const router = useRouter();
  const { t: { layout: { header: t }, common: { brand } }, path, locale } = useI18n();
  const onNavigate = useNavigate();
  const supportPhone = useSite().settings.support_phone;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
  ];

  // Keep page switches instant, as they were with client-side routing
  useEffect(() => {
    [...navLinks.map((link) => link.path), '/consultation'].forEach((to) => router.prefetch(path(to)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, locale]);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top emergency bar */}
      <div className="bg-[#051115] border-b border-[#12B8B0]/15 py-1.5 px-4 text-xs text-[#A2B6BC]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#12B8B0] animate-pulse"></span>
            <span className="text-[#E2C98C] font-medium">{t.officialAgent}</span>
            <span className="hidden sm:inline text-[#718085]">|</span>
            <span className="hidden md:inline text-[#F7F7F3]/80">{t.dailyVip}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`tel:${supportPhone.replace(/[\s()-]/g, '')}`}
              className="flex items-center gap-1.5 text-[#12B8B0] hover:text-[#74FFF7] transition-colors"
              dir="ltr"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="font-mono">{supportPhone}</span>
            </a>
            <span className="hidden sm:inline bg-[#12B8B0]/20 text-[#12B8B0] px-2 py-0.5 rounded font-mono">
              {t.support247}
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#07191F]/90 backdrop-blur-xl border-b border-[#12B8B0]/20 shadow-xl py-3'
            : 'bg-[#07191F]/70 backdrop-blur-md border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 text-start group focus:outline-none"
            aria-label={t.homeAria}
          >
            {/* Visual Logo Emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#12B8B0] via-[#087F7B] to-[#052B29] p-0.5 shadow-lg shadow-[#12B8B0]/20 flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-[#07191F] flex items-center justify-center border border-[#E2C98C]/40">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-lg tracking-wider text-[#E2C98C] group-hover:text-white transition-colors">
                  G
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#F7F7F3] tracking-tight">
                  {brand}
                </span>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-extrabold tracking-widest text-[#12B8B0] bg-[#12B8B0]/10 px-1.5 py-0.5 rounded border border-[#12B8B0]/30">
                  GITI
                </span>
              </div>
              <p className="text-[10px] text-[#A2B6BC] font-medium tracking-wide">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0C252B]/60 p-1 rounded-full border border-[#12B8B0]/15 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#12B8B0] text-[#07191F] font-bold shadow-md shadow-[#12B8B0]/25'
                      : 'text-[#F7F7F3]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Primary Consultation Button */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => handleNavClick('/consultation')}
              className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C6A15B] via-[#E2C98C] to-[#C6A15B] text-[#07191F] font-bold text-sm shadow-lg shadow-[#C6A15B]/20 hover:shadow-[#C6A15B]/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <span>{t.consultation}</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('/consultation')}
              className="sm:hidden px-3 py-1.5 rounded-full bg-[#C6A15B] text-[#07191F] text-xs font-bold"
            >
              {t.consultationShort}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0C252B] border border-[#12B8B0]/30 text-[#F7F7F3] hover:text-[#12B8B0] transition-colors"
              aria-label={isMobileMenuOpen ? t.closeMenu : t.openMenu}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#07191F]/98 border-b border-[#12B8B0]/20 px-4 pt-3 pb-6 mt-3 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-start px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#12B8B0] text-[#07191F] font-bold'
                      : 'text-[#F7F7F3] hover:bg-[#0C252B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-3 border-t border-white/10 space-y-3">
              <LanguageSwitcher variant="list" />
              <button
                onClick={() => handleNavClick('/consultation')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#E2C98C] text-[#07191F] font-bold text-center block shadow-lg shadow-[#C6A15B]/30"
              >
                {t.consultationFull}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
