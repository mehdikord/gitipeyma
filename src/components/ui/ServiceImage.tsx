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
import { useI18n } from '../../i18n/I18nProvider';

interface ServiceImageProps {
  // A service without a photo shows the illustrated fallback.
  src: string | null;
  alt: string;
  category: string;
  slug: string;
  className?: string;
  isHero?: boolean;
}

export const ServiceImage: React.FC<ServiceImageProps> = ({
  src,
  alt,
  category,
  slug,
  className = '',
  isHero = false,
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const t = useI18n().t.forms.serviceImage;

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

  // Render a bespoke luxury illustrated vector artwork matching the service theme
  const renderFallbackIllustration = () => {
    switch (slug) {
      case 'bus-vip-tehran-istanbul':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(var(--brand)_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
            <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3 shadow-lg shadow-brand/20">
              <Bus className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.bus}</span>
            <span className="text-xs text-gold font-mono mt-1">ROYAL TRAVEL EXPRESS COACH</span>
          </div>
        );
      case 'cargo-express-postal':
      case 'cargo-customs-clearance':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(var(--gold-deep)_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
            <div className="w-16 h-16 rounded-2xl bg-gold-deep/20 border border-gold-deep-line/40 flex items-center justify-center text-gold mb-3 shadow-lg shadow-gold-deep-fill/20">
              <Boxes className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.cargo}</span>
            <span className="text-xs text-brand font-mono mt-1">INTERNATIONAL CARGO & CMR</span>
          </div>
        );
      case 'company-registration':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3">
              <Building2 className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.company}</span>
            <span className="text-xs text-gold font-mono mt-1">MERSİS & CORPORATE BANKING</span>
          </div>
        );
      case 'currency-exchange-swift':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gold-deep/20 border border-gold-deep-line/40 flex items-center justify-center text-gold mb-3">
              <CircleDollarSign className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.currency}</span>
            <span className="text-xs text-brand-bright font-mono mt-1">FAST / EFT / SWIFT SETTLEMENT</span>
          </div>
        );
      case 'international-visa':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3">
              <FileText className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.visa}</span>
            <span className="text-xs text-gold font-mono mt-1">VISA CONSULTING & APPOINTMENT</span>
          </div>
        );
      case 'legal-power-of-attorney':
      case 'official-translation':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gold-deep/20 border border-gold-deep-line/40 flex items-center justify-center text-gold mb-3">
              <Scale className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.legal}</span>
            <span className="text-xs text-brand font-mono mt-1">NOTER & OFFICIAL APOSTILLE</span>
          </div>
        );
      case 'turkey-weddings':
      case 'international-marriage':
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 border border-gold-line/40 flex items-center justify-center text-gold mb-3">
              <Heart className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.wedding}</span>
            <span className="text-xs text-gold font-mono mt-1">AİLE CÜZDANI & BOSPHORUS CELEBRATION</span>
          </div>
        );
      case 'education-residence-permit':
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-surface via-canvas to-canvas-deep flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3">
              <GraduationCap className="w-9 h-9" />
            </div>
            <span className="text-base font-black text-ink-strong text-center">{t.education}</span>
            <span className="text-xs text-gold font-mono mt-1">IKAMET & STUDY PERMIT</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-canvas ${className}`}>
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
            <div className="absolute inset-0 bg-surface animate-pulse" />
          )}
          <img
            ref={imgRef}
            src={src ?? undefined}
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
