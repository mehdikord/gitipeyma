'use client';

import React, { useEffect, useRef } from 'react';
import { COMPANY_CONFIG } from '../../data/company';
import { SERVICES_DATA } from '../../data/services';
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram, Linkedin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export const Footer: React.FC = () => {
  const onNavigate = useNavigate();
  const yearRef = useRef<HTMLSpanElement>(null);

  // The footer is prerendered at build time, so the year is refreshed in the browser
  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.textContent = String(new Date().getFullYear());
    }
  }, []);
  return (
    <footer className="bg-[#051115] text-[#A2B6BC] border-t border-[#12B8B0]/20 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12B8B0] to-[#087F7B] p-0.5 flex items-center justify-center shadow-lg shadow-[#12B8B0]/20">
                <div className="w-full h-full rounded-[10px] bg-[#07191F] flex items-center justify-center border border-[#E2C98C]/40">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-lg text-[#E2C98C]">
                    G
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-[#F7F7F3] block">
                  نمایندگی رسمی گیتی پیما
                </span>
                <span className="text-xs text-[#12B8B0] font-mono tracking-wider">
                  GITI INTERNATIONAL BUSINESS & LOGISTICS
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#718085] max-w-md">
              همراه مطمئن شما در مسیر خدمات فرامرزی، ترانزیت مسافری VIP، کارگو تجاری، خدمات ارزی، حقوقی، ثبت شرکت و اقامت بین‌المللی میان ایران، ترکیه و قاره اروپا.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12B8B0]"></span>
              <span className="text-xs font-semibold text-[#E2C98C]">
                تنها نمایندگی دارای مجوز رسمی شرکت بین‌المللی گیتی پیما در ترکیه
              </span>
            </div>

            {/* Social channels */}
            <div className="pt-3 flex items-center gap-2">
              <a
                href="https://wa.me/905367008090"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0C252B] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0] hover:bg-[#12B8B0] hover:text-[#07191F] transition-all"
                aria-label="واتس‌اپ پشتیبانی گیتی پیما"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/GitiPeymaOfficial"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0C252B] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0] hover:bg-[#12B8B0] hover:text-[#07191F] transition-all"
                aria-label="کانال تلگرام رسمی"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/gitipeyma_official"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0C252B] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0] hover:bg-[#12B8B0] hover:text-[#07191F] transition-all"
                aria-label="صفحه اینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0C252B] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0] hover:bg-[#12B8B0] hover:text-[#07191F] transition-all"
                aria-label="لینکدین امور تجاری"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-[#F7F7F3] mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
              <span>صفحات وب‌سایت</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#12B8B0] transition-colors"
                >
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="hover:text-[#12B8B0] transition-colors"
                >
                  فهرست ۱۱ خدمت فرامرزی
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#12B8B0] transition-colors"
                >
                  درباره نمایندگی گیتی پیما
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#12B8B0] transition-colors"
                >
                  راه‌های تماس و دفاتر رسمی
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/consultation')}
                  className="text-[#E2C98C] hover:underline transition-colors flex items-center gap-1"
                >
                  <span>ثبت درخواست مشاوره</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Key Services Directory */}
          <div>
            <h4 className="text-sm font-bold text-[#F7F7F3] mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12B8B0]"></span>
              <span>خدمات شاخص</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_DATA.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => onNavigate(`/services/${srv.slug}`)}
                    className="hover:text-[#E2C98C] transition-colors text-right line-clamp-1"
                  >
                    {srv.shortTitle}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs text-[#12B8B0] hover:underline"
                >
                  + مشاهده تمام خدمات
                </button>
              </li>
            </ul>
          </div>

          {/* Offices and Emergency Hotline */}
          <div>
            <h4 className="text-sm font-bold text-[#F7F7F3] mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2C98C]"></span>
              <span>پشتیبانی شبانه‌روزی</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0C252B] border border-[#12B8B0]/20">
                <span className="text-[#C6A15B] font-semibold block mb-1">
                  خط ویژه استانبول (ترکیه):
                </span>
                <a
                  href={`tel:${COMPANY_CONFIG.emergencySupportPhone.replace(/[\s()-]/g, '')}`}
                  className="text-[#F7F7F3] font-mono text-sm hover:text-[#12B8B0] transition-colors block"
                  dir="ltr"
                >
                  {COMPANY_CONFIG.emergencySupportPhone}
                </a>
                <span className="text-[11px] text-[#718085] mt-1 block">
                  پاسخگویی ۲۴ ساعته در ۷ روز هفته
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#07191F] border border-white/5">
                <span className="text-[#A2B6BC] font-medium block mb-1">
                  دفتر ترانزیت غرب تهران:
                </span>
                <span className="text-[#F7F7F3] font-mono" dir="ltr">
                  ۰۲۱-۴۴۶۶۸۰۸۰
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Transparent Disclaimer */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#718085]">
          <p>
            © <span ref={yearRef} suppressHydrationWarning>{new Date().getFullYear()}</span> نمایندگی رسمی گیتی پیما (GITI). تمامی حقوق مادی و معنوی محفوظ است.
          </p>
          <div className="flex items-center gap-2 text-center md:text-left text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#12B8B0]" />
            <span>
              کلیه خدمات این مجموعه در چارچوب ضوابط قانونی و استانداردهای ترانزیت بین‌المللی ارائه می‌گردد.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
