'use client';

import React, { useState } from 'react';
import { Clock, ExternalLink, MapPin, Navigation, PhoneCall } from 'lucide-react';
import { useSite } from './SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';
import { officeMap } from '../../lib/maps';
import { BrandEmblem } from '../layout/BrandEmblem';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';
const telHref = (phone: string) => `tel:${phone.replace(/[\s()-]/g, '')}`;

/**
 * The head office on a live Google map, with directions. Used on the about and contact pages, inside
 * their own page container. The details come from the first office in the admin panel; the
 * position and links from the "map" settings.
 */
export const LocationSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { settings, offices } = useSite();
  const { t: { common: { location: t } }, locale } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const map = officeMap(settings, locale);
  const office = offices[0];
  if (!map.placeUrl) return null;

  const details = [
    office?.address && { icon: MapPin, label: t.address, value: <span>{office.address}</span> },
    office?.workingHours && { icon: Clock, label: t.hours, value: <span>{office.workingHours}</span> },
    office?.phones[0] && {
      icon: PhoneCall,
      label: t.phone,
      value: (
        <a dir="ltr" href={telHref(office.phones[0])} className={`font-bold text-ink-strong hover:text-gold transition-colors rounded ${FOCUS}`}>
          {office.phones[0]}
        </a>
      ),
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: React.ReactNode }[];

  return (
    <section aria-labelledby="office-location-title" className={`loc-section relative ${className}`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-stretch">
        {/* The office, and the ways to get there */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col text-start">
          <p className="flex items-center gap-2 text-xs font-extrabold text-gold">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-gold-fill/70 animate-ping motion-reduce:animate-none" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-gold-fill" />
            </span>
            {t.eyebrow}
          </p>
          <h2 id="office-location-title" className="mt-3 text-2xl sm:text-3xl xl:text-[2.1rem] font-black leading-[1.4] text-ink-strong [text-wrap:balance]">
            {t.title}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.95] text-ink-muted">{t.lead}</p>

          {details.length > 0 && (
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3.5 py-4">
                  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-bold text-ink-dim">{label}</dt>
                    <dd className="mt-1 text-sm leading-[1.85] text-ink-soft">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 lg:mt-auto lg:pt-6 flex flex-wrap gap-3">
            <a
              href={map.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex flex-1 basis-40 whitespace-nowrap items-center justify-center gap-2.5 rounded-xl bg-brand-fill px-5 py-3.5 text-[15px] font-extrabold text-on-brand shadow-lg shadow-brand-fill/30 transition-colors hover:bg-brand-bright-fill ${FOCUS}`}
            >
              <Navigation aria-hidden="true" className="h-[18px] w-[18px] transition-transform group-hover:-rotate-12" />
              {t.directions}
            </a>
            <a
              href={map.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex flex-1 basis-40 whitespace-nowrap items-center justify-center gap-2 rounded-xl border border-ink/20 px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:border-gold-line hover:text-gold ${FOCUS}`}
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              {t.openMap}
            </a>
          </div>
        </div>

        {/* The live map, in a gold-to-blue frame */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="relative h-full rounded-3xl bg-gradient-to-br from-gold-line/70 via-ink/10 to-brand-fill p-[1.5px] shadow-2xl shadow-black/25">
            <div className="relative h-[360px] sm:h-[440px] lg:h-full lg:min-h-[480px] overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-surface-2">
              {/* While the map loads */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero/map.svg" alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-60'}`} />
              {map.embedUrl && (
                <iframe
                  src={map.embedUrl}
                  title={t.mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                  className={`loc-map absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />
              )}

              {/* Who's at the pin */}
              <div className="pointer-events-none absolute top-3 start-3 end-[4.5rem] sm:end-auto sm:top-5 sm:start-5 flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface/90 py-2.5 ps-2.5 pe-5 shadow-xl backdrop-blur-md">
                <BrandEmblem variant="plate" className="h-11 w-11 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-ink-strong truncate">{office?.name ?? t.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-gold" />
                    <span className="truncate">{office?.role ?? t.eyebrow}</span>
                  </p>
                </div>
              </div>

              <a
                href={map.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.directions}
                className={`loc-fab absolute top-3 end-3 sm:top-5 sm:end-5 grid h-12 w-12 place-items-center rounded-full bg-gold-fill text-on-accent shadow-xl transition-transform hover:scale-105 ${FOCUS}`}
              >
                <Navigation aria-hidden="true" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
