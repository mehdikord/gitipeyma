'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plane,
  Ship,
  Boxes,
  MapPin,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Navigation,
  Sparkles,
} from 'lucide-react';

type ActiveRoute = 'land' | 'air' | 'sea';

export const InternationalTradeAnimation: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('land');
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);

  // Auto toggle route mode periodically to keep visual motion captivating
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRoute((prev) => (prev === 'land' ? 'air' : prev === 'air' ? 'sea' : 'land'));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[560px] rounded-3xl overflow-hidden bg-radial from-[#0C252B] via-[#07191F] to-[#040E12] border border-[#12B8B0]/30 shadow-2xl p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Background Radar & Coordinate Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {/* Concentric Trade Distance Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-[#12B8B0]/20 border-dashed animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[#C6A15B]/25"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full border border-[#12B8B0]/30"></div>

        {/* Radar Sweep Cone */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-conic from-transparent via-[#12B8B0]/10 to-transparent animate-[spin_12s_linear_infinite]"></div>

        {/* Ambient volumetric glow spots */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#12B8B0]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-[#C6A15B]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header: System Status & Route Mode Selectors */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#12B8B0]/20 border border-[#12B8B0]/40 flex items-center justify-center text-[#12B8B0]">
            <Globe2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#F7F7F3] block">شبکه هوشمند ترانزیت فرامرزی</span>
            <span className="text-[10px] text-[#A2B6BC]">GITI INTERNATIONAL LOGISTICS RADAR</span>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#07191F]/90 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveRoute('land')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeRoute === 'land'
                ? 'bg-[#12B8B0] text-[#07191F] shadow-md shadow-[#12B8B0]/30'
                : 'text-[#A2B6BC] hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>ترانزیت جاده‌ای</span>
          </button>

          <button
            onClick={() => setActiveRoute('air')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeRoute === 'air'
                ? 'bg-[#C6A15B] text-[#07191F] shadow-md shadow-[#C6A15B]/30'
                : 'text-[#A2B6BC] hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>کارگو هوایی</span>
          </button>

          <button
            onClick={() => setActiveRoute('sea')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeRoute === 'sea'
                ? 'bg-[#74FFF7] text-[#07191F] shadow-md shadow-[#74FFF7]/30'
                : 'text-[#A2B6BC] hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>کشتیرانی و بندر</span>
          </button>
        </div>
      </div>

      {/* Main Animated Vector Graphic Area */}
      <div className="relative z-10 flex-1 my-2 flex items-center justify-center">
        <svg
          className="w-full h-full max-h-[360px]"
          viewBox="0 0 600 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="routeGradLand" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#12B8B0" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#E2C98C" stopOpacity="1" />
              <stop offset="100%" stopColor="#12B8B0" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="routeGradAir" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#74FFF7" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="routeGradSea" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#087F7B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#12B8B0" stopOpacity="1" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Iso Terrain Mesh / Continental Network Contours */}
          <path
            d="M 50 240 Q 150 180, 240 210 T 420 180 T 560 120"
            stroke="rgba(18, 184, 176, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M 30 160 Q 160 220, 310 140 T 490 220 T 580 200"
            stroke="rgba(198, 161, 91, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* 1. LAND ROUTE HIGHWAY (Tehran ➔ Tabriz ➔ Bazargan ➔ Istanbul ➔ Europe) */}
          <g opacity={activeRoute === 'land' ? 1 : 0.35} className="transition-opacity duration-500">
            {/* Base Highway Road */}
            <path
              d="M 100 270 C 180 240, 260 220, 330 170 C 400 120, 480 110, 520 80"
              stroke="#0C252B"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Animated Centerline */}
            <path
              d="M 100 270 C 180 240, 260 220, 330 170 C 400 120, 480 110, 520 80"
              stroke="url(#routeGradLand)"
              strokeWidth="3.5"
              strokeDasharray="10 14"
              className="animate-dash-flow"
              filter="url(#glowLight)"
            />

            {/* Moving VIP Transport / Cargo Carrier */}
            <g className="animate-[moveAlongLand_6s_easeInOut_infinite]">
              <circle cx="280" cy="195" r="7" fill="#E2C98C" filter="url(#glowLight)" />
              <rect x="268" y="188" width="24" height="14" rx="3" fill="#12B8B0" stroke="#E2C98C" strokeWidth="1.5" />
              <text x="280" y="198" fill="#07191F" fontSize="8" fontWeight="bold" textAnchor="middle">GITI</text>
            </g>
          </g>

          {/* 2. AIR CARGO SKY CORRIDOR (Flight Curve: Tehran ➔ Istanbul ➔ Frankfurt) */}
          <g opacity={activeRoute === 'air' ? 1 : 0.35} className="transition-opacity duration-500">
            <path
              d="M 100 270 Q 280 40, 520 80"
              stroke="url(#routeGradAir)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className="animate-dash-flow"
              filter="url(#glowLight)"
            />

            {/* Moving Cargo Aircraft */}
            <g transform="translate(300, 110)">
              <circle cx="0" cy="0" r="14" fill="rgba(198, 161, 91, 0.25)" />
              <path
                d="M 0 -8 L 4 0 L 14 3 L 4 5 L 3 10 L 0 8 L -3 10 L -4 5 L -14 3 L -4 0 Z"
                fill="#C6A15B"
                stroke="#FFF"
                strokeWidth="0.8"
              />
            </g>
          </g>

          {/* 3. MARITIME TRADE ROUTE (Black Sea & Mediterranean Ports) */}
          <g opacity={activeRoute === 'sea' ? 1 : 0.35} className="transition-opacity duration-500">
            <path
              d="M 120 300 C 240 320, 340 280, 420 220 C 460 190, 500 160, 520 80"
              stroke="url(#routeGradSea)"
              strokeWidth="2.5"
              strokeDasharray="8 10"
              className="animate-dash-flow"
              filter="url(#glowLight)"
            />

            {/* Moving Container Cargo Vessel */}
            <g transform="translate(360, 255)">
              <path d="M -16 4 L 16 4 L 12 12 L -12 12 Z" fill="#087F7B" stroke="#74FFF7" strokeWidth="1" />
              <rect x="-10" y="-3" width="8" height="7" fill="#C6A15B" />
              <rect x="0" y="-3" width="8" height="7" fill="#12B8B0" />
            </g>
          </g>

          {/* MAJOR STRATEGIC TRADE HUBS (Interactive City Nodes) */}

          {/* Node 1: TEHRAN (Origin Hub) */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredHub('tehran')}
            onMouseLeave={() => setHoveredHub(null)}
          >
            <circle cx="100" cy="270" r="16" fill="rgba(18, 184, 176, 0.2)" />
            <circle cx="100" cy="270" r="7" fill="#12B8B0" stroke="#FFF" strokeWidth="2" />
            <text x="100" y="300" fill="#F7F7F3" fontSize="11" fontWeight="bold" textAnchor="middle">
              تهران (مرکز ناوگان و کارگو)
            </text>
            <text x="100" y="314" fill="#A2B6BC" fontSize="9" textAnchor="middle">
              پایانه آزادی و گمرک غرب
            </text>
          </g>

          {/* Node 2: TABRIZ (Border Coordination) */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredHub('tabriz')}
            onMouseLeave={() => setHoveredHub(null)}
          >
            <circle cx="210" cy="235" r="5" fill="#74FFF7" stroke="#07191F" strokeWidth="1.5" />
            <text x="210" y="222" fill="#E2C98C" fontSize="10" fontWeight="bold" textAnchor="middle">
              تبریز
            </text>
          </g>

          {/* Node 3: BAZARGAN / GURBULAK BORDER (Customs Gate) */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredHub('bazargan')}
            onMouseLeave={() => setHoveredHub(null)}
          >
            <circle cx="280" cy="195" r="14" fill="rgba(198, 161, 91, 0.25)" className="animate-pulse" />
            <circle cx="280" cy="195" r="6" fill="#C6A15B" stroke="#FFF" strokeWidth="1.5" />
            <text x="280" y="175" fill="#C6A15B" fontSize="10" fontWeight="bold" textAnchor="middle">
              گیت اختصاصی مرز بازرگان
            </text>
            <text x="280" y="186" fill="#A2B6BC" fontSize="8" textAnchor="middle">
              ترخیص رسمی و بازرسی سریع
            </text>
          </g>

          {/* Node 4: ISTANBUL (Central Headquarters in Turkey) */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredHub('istanbul')}
            onMouseLeave={() => setHoveredHub(null)}
          >
            <circle cx="430" cy="130" r="20" fill="rgba(18, 184, 176, 0.25)" />
            <circle cx="430" cy="130" r="9" fill="#12B8B0" stroke="#E2C98C" strokeWidth="2.5" />
            <text x="430" y="108" fill="#E2C98C" fontSize="12" fontWeight="black" textAnchor="middle">
              استانبول (دفتر مرکزی ترکیه)
            </text>
            <text x="430" y="122" fill="#A2B6BC" fontSize="9" textAnchor="middle">
              پایانه آکسارای و هالکالی
            </text>
          </g>

          {/* Node 5: EUROPE / FRANKFURT (Gateway to EU) */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredHub('europe')}
            onMouseLeave={() => setHoveredHub(null)}
          >
            <circle cx="520" cy="80" r="12" fill="rgba(116, 255, 247, 0.2)" />
            <circle cx="520" cy="80" r="6" fill="#74FFF7" stroke="#07191F" strokeWidth="1.5" />
            <text x="520" y="60" fill="#F7F7F3" fontSize="10" fontWeight="bold" textAnchor="middle">
              کریدور اروپا (شنگن)
            </text>
          </g>
        </svg>

        {/* Floating Interactive Trade Waybill Card */}
        <div className="absolute top-3 left-3 p-3 rounded-2xl bg-[#07191F]/95 border border-[#12B8B0]/40 shadow-xl backdrop-blur-md max-w-[210px] space-y-1.5 animate-float hidden sm:block">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#12B8B0] font-bold">CMR WAYBILL</span>
            <span className="text-[#E2C98C]">#TR-IR-8090</span>
          </div>
          <div className="text-xs font-bold text-white">ترانزیت تجاری فعال</div>
          <div className="text-[10px] text-[#A2B6BC] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#12B8B0]" />
            <span>پلمپ رسمی گمرک بازرگان تایید شد</span>
          </div>
        </div>

        {/* Floating Swift Currency Settlement Card */}
        <div className="absolute bottom-3 right-3 p-3 rounded-2xl bg-[#07191F]/95 border border-[#C6A15B]/40 shadow-xl backdrop-blur-md max-w-[210px] space-y-1.5 animate-float-delayed hidden sm:block">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#C6A15B] font-bold">SWIFT TRANSFER</span>
            <span className="text-[#74FFF7]">INSTANT</span>
          </div>
          <div className="text-xs font-bold text-white">تسویه مستقیم لیر / یورو</div>
          <div className="text-[10px] text-[#A2B6BC] flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#E2C98C]" />
            <span>واریز آنی به حساب‌های بانکی ترکیه</span>
          </div>
        </div>
      </div>

      {/* Bottom Live Operations Ticker */}
      <div className="relative z-20 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#07191F]/80 border border-white/5 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#12B8B0] shrink-0" />
          <div>
            <span className="text-[10px] text-[#718085] block">حرکت بعدی اتوبوس VIP:</span>
            <span className="font-bold text-[#E2C98C]">ساعت ۱۲:۰۰ و ۱۶:۰۰ هر روز</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#07191F]/80 border border-white/5 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-[#C6A15B] shrink-0" />
          <div>
            <span className="text-[10px] text-[#718085] block">تحویل اکسپرس کارگو:</span>
            <span className="font-bold text-[#F7F7F3]">۳ تا ۵ روزه درب به درب</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#07191F]/80 border border-white/5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#74FFF7] shrink-0" />
          <div>
            <span className="text-[10px] text-[#718085] block">پشتیبانی ترانزیت مرزی:</span>
            <span className="font-bold text-[#12B8B0]">۲۴/۷ شبانه‌روزی</span>
          </div>
        </div>
      </div>
    </div>
  );
};
