'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bus,
  Package,
  Boxes,
  Building2,
  FileText,
  Heart,
  Scale,
  Languages,
  CircleDollarSign,
  GraduationCap,
  Users,
} from 'lucide-react';

interface ServiceImageProps {
  src: string;
  alt: string;
  category: string;
  slug: string;
  className?: string;
  isHero?: boolean;
  imageWidth?: number;
}

export const ServiceImage: React.FC<ServiceImageProps> = ({
  src,
  alt,
  category,
  slug,
  className = '',
  isHero = false,
  imageWidth = 1200,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A server-rendered image can finish loading before hydration, when onLoad/onError are not attached yet
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth > 0) {
        setIsLoaded(true);
      } else {
        setHasError(true);
      }
    }
  }, []);

  // Reliable, high-availability curated Unsplash imagery with direct keywords
  const getOptimizedSrc = (url: string) => {
    // If it's already an unsplash URL, ensure standard webp formatting
    if (url.includes('unsplash.com')) {
      const cleanUrl = url.split('?')[0];
      return `${cleanUrl}?auto=format&fit=crop&w=${imageWidth}&q=${imageWidth < 1200 ? 72 : 80}`;
    }
    return url;
  };

  // Render a bespoke luxury illustrated vector artwork matching the service theme
  const renderFallbackIllustration = () => {
    switch (slug) {
      case 'bus-vip-tehran-istanbul':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#05151A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#12B8B0_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#12B8B0]/20 border border-[#12B8B0]/40 flex items-center justify-center text-[#12B8B0] mb-3 shadow-lg shadow-[#12B8B0]/20">
              <Bus className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">سرویس VIP اتوبوس تهران ⇄ استانبول</span>
            <span className="text-xs text-[#E2C98C] font-mono mt-1">GITI LUXURY EXPRESS COACH</span>
          </div>
        );
      case 'cargo-express-postal':
      case 'cargo-customs-clearance':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#0A1A20] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#C6A15B]/20 border border-[#C6A15B]/40 flex items-center justify-center text-[#E2C98C] mb-3 shadow-lg shadow-[#C6A15B]/20">
              <Boxes className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">کارگو تجاری و ترخیص گمرکی</span>
            <span className="text-xs text-[#12B8B0] font-mono mt-1">INTERNATIONAL CARGO & CMR</span>
          </div>
        );
      case 'company-registration':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#041014] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#12B8B0]/20 border border-[#12B8B0]/40 flex items-center justify-center text-[#12B8B0] mb-3">
              <Building2 className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">ثبت شرکت بین‌المللی</span>
            <span className="text-xs text-[#E2C98C] font-mono mt-1">MERSİS & CORPORATE BANKING</span>
          </div>
        );
      case 'currency-exchange-swift':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#051115] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#C6A15B]/20 border border-[#C6A15B]/40 flex items-center justify-center text-[#E2C98C] mb-3">
              <CircleDollarSign className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">حواله ارزی و تسویه سوئیفت</span>
            <span className="text-xs text-[#74FFF7] font-mono mt-1">FAST / EFT / SWIFT SETTLEMENT</span>
          </div>
        );
      case 'international-visa':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#041115] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#12B8B0]/20 border border-[#12B8B0]/40 flex items-center justify-center text-[#12B8B0] mb-3">
              <FileText className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">ویزای بین‌المللی (شنگن و کانادا)</span>
            <span className="text-xs text-[#E2C98C] font-mono mt-1">VISA CONSULTING & APPOINTMENT</span>
          </div>
        );
      case 'legal-power-of-attorney':
      case 'official-translation':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#041115] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#C6A15B]/20 border border-[#C6A15B]/40 flex items-center justify-center text-[#E2C98C] mb-3">
              <Scale className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">خدمات حقوقی، وکالتنامه و ترجمه</span>
            <span className="text-xs text-[#12B8B0] font-mono mt-1">NOTER & OFFICIAL APOSTILLE</span>
          </div>
        );
      case 'turkey-weddings':
      case 'international-marriage':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#041115] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#E2C98C]/20 border border-[#E2C98C]/40 flex items-center justify-center text-[#E2C98C] mb-3">
              <Heart className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">تشریفات ازدواج بین‌المللی در ترکیه</span>
            <span className="text-xs text-[#E2C98C] font-mono mt-1">AİLE CÜZDANI & BOSPHORUS CELEBRATION</span>
          </div>
        );
      case 'education-residence-permit':
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0C252B] via-[#07191F] to-[#041115] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#12B8B0]/20 border border-[#12B8B0]/40 flex items-center justify-center text-[#12B8B0] mb-3">
              <GraduationCap className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-white text-center">پذیرش دانشگاهی و کارت اقامت</span>
            <span className="text-xs text-[#E2C98C] font-mono mt-1">IKAMET & STUDY PERMIT</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#07191F] ${className}`}>
      {/* If error occurred, show the bespoke luxury SVG illustration; a page hero already names the service, so it gets the plain brand map */}
      {hasError ? (
        isHero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/map.svg" alt="" className="w-full h-full object-cover" style={{ opacity: 0.75 }} />
        ) : (
          renderFallbackIllustration()
        )
      ) : (
        <>
          {/* Subtle loading placeholder skeleton while image loads */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#0C252B] animate-pulse" />
          )}
          <img
            ref={imgRef}
            src={getOptimizedSrc(src)}
            alt={alt}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        </>
      )}
    </div>
  );
};
