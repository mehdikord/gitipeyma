'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, PhoneCall } from 'lucide-react';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { telHref } from '../../utils/contact';
import { useSite } from '../site/SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

// The route starts right under the buttons, where the visitor is, and leaves for the horizon.
// The SVG is anchored to the section's bottom edge, so the start stays put on every screen.
// It swings wide below the text and climbs the left margin, so it never crosses the words.
const START = { x: 600, y: 790 };
const END = { x: 40, y: 420 };
const ROUTE = `M${START.x} ${START.y} C600 760, 520 745, 380 735 S120 650, ${END.x} ${END.y}`;

export const FinalCTA: React.FC = () => {
  const { settings } = useSite();
  const { t: { home: { cta: t } }, path } = useI18n();
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(t.whatsappText)}`;
  const SUPPORT_PHONE = settings.support_phone;
  const SUPPORT_TEL = telHref(SUPPORT_PHONE);
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useRevealOnce(sectionRef);

  return (
    <section ref={sectionRef} data-reveal={reveal} className="relative overflow-hidden bg-[#07191F] py-20 sm:py-24 lg:py-28">
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="cta-route" gradientUnits="userSpaceOnUse" x1={START.x} y1={START.y} x2={END.x} y2={END.y}>
            <stop offset="0" stopColor="#E2C98C" stopOpacity="1" />
            <stop offset="1" stopColor="#E2C98C" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="cta-horizon">
            <stop offset="0" stopColor="#12B8B0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#12B8B0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cta-comet">
            <stop offset="0" stopColor="#FFF7E0" stopOpacity="1" />
            <stop offset="0.35" stopColor="#E2C98C" stopOpacity="0.8" />
            <stop offset="1" stopColor="#E2C98C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Where the route is headed */}
        <circle cx={END.x} cy={END.y} r="190" fill="url(#cta-horizon)" />

        {/* The road bed, then the lit line on top */}
        <path d={ROUTE} fill="none" stroke="#E2C98C" strokeOpacity="0.12" strokeWidth="16" strokeLinecap="round" pathLength={1} className="cta-draw" />
        <path id="cta-path" d={ROUTE} fill="none" stroke="url(#cta-route)" strokeWidth="3" strokeLinecap="round" pathLength={1} className="cta-draw" />

        {/* A shipment leaving on it, over and over */}
        <circle r="26" fill="url(#cta-comet)" className="cta-comet">
          <animateMotion dur="5s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1">
            <mpath href="#cta-path" />
          </animateMotion>
        </circle>

        {/* The start: here, now */}
        <circle cx={START.x} cy={START.y} r="22" fill="#E2C98C" fillOpacity="0.25" className="cta-start-pulse" />
        <circle cx={START.x} cy={START.y} r="7" fill="#E2C98C" stroke="#07191F" strokeWidth="3" />
      </svg>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="cta-fade text-[2rem] sm:text-[2.6rem] xl:text-5xl font-black leading-[1.35] text-[#F7F7F3] [text-wrap:balance]">
          {t.title}
        </h2>
        <p className="cta-fade mt-4 max-w-xl mx-auto text-[15px] sm:text-lg leading-[1.95] text-[#B7C8CD]" style={{ '--cta-delay': '0.12s' } as React.CSSProperties}>
          {t.lead}
        </p>

        <div className="cta-fade mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3" style={{ '--cta-delay': '0.24s' } as React.CSSProperties}>
          <Link
            href={path('/consultation')}
            className={`group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-[#E2C98C] hover:bg-[#F0DCA8] text-[#07191F] font-black text-base transition-colors ${FOCUS}`}
          >
            <span>{t.consultation}</span>
            <ArrowLeft className="w-[18px] h-[18px] transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 ltr:-scale-x-100" />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-black text-base transition-colors ${FOCUS}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.whatsapp}</span>
          </a>
        </div>

        <a
          href={SUPPORT_TEL}
          className={`cta-fade mt-6 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1 text-sm text-[#A2B6BC] hover:text-white transition-colors rounded ${FOCUS}`}
          style={{ '--cta-delay': '0.36s' } as React.CSSProperties}
        >
          <PhoneCall className="w-4 h-4 text-[#12B8B0]" />
          <span>{t.callDirect}</span>
          <span dir="ltr" className="font-bold text-[#F7F7F3] whitespace-nowrap">
            {SUPPORT_PHONE}
          </span>
        </a>
      </div>
    </section>
  );
};
