'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ServiceMenuItem } from '../../types';
import { serviceIcon } from '../../modules/services/icons';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

type Props = { id: string; services: ServiceMenuItem[]; total: number; onNavigate: () => void };

/**
 * The panel under the header's "services" item: the first services in the display order set in the
 * admin panel, then the way through to all of them on /services. It stays in the page while closed
 * (hidden and inert), so the links are still there for crawlers.
 */
export const ServicesMegaMenu: React.FC<Props & { open: boolean }> = ({ id, open, services, total, onNavigate }) => {
  const { t: { layout: { header: { servicesMenu: t } } }, path, fill, num } = useI18n();

  return (
    <div
      id={id}
      inert={!open}
      aria-hidden={!open}
      className={`hidden lg:block absolute inset-x-0 top-full pt-3 transition-[opacity,transform,visibility] motion-reduce:transition-none ${
        open ? 'visible opacity-100 translate-y-0 duration-200 ease-out' : 'invisible opacity-0 -translate-y-2 duration-150 ease-in'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-ink/10 bg-surface shadow-2xl shadow-black/30 overflow-hidden">
          <ul className="grid grid-cols-3 gap-3 p-4 xl:p-5">
            {services.map((service, index) => {
              const Icon = serviceIcon(service.icon);
              return (
                <li key={service.slug}>
                  <Link
                    href={path(`/services/${service.slug}`)}
                    scroll={false}
                    onClick={onNavigate}
                    className={`group relative flex h-full flex-col rounded-xl border border-transparent p-4 transition-colors hover:border-brand/25 hover:bg-ink/[0.04] ${FOCUS}`}
                  >
                    <span className="flex items-center justify-between">
                      <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand-fill group-hover:text-on-brand">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span aria-hidden="true" className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-extrabold text-ink-dim/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span className="mt-4 block text-[15px] font-extrabold leading-snug text-ink-strong">{service.title}</span>
                    <span className="mt-1.5 text-xs leading-relaxed text-ink-muted line-clamp-2">{service.summary}</span>
                    <ArrowLeft aria-hidden="true" className="mt-3 h-4 w-4 text-gold opacity-0 transition-all group-hover:opacity-100 rtl:group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-4 border-t border-ink/10 bg-surface-2/60 px-5 xl:px-6 py-4">
            <p className="text-xs text-ink-muted">
              <span className="font-bold text-ink">{t.label}</span>
              <span className="mx-2 text-ink-dim">·</span>
              {t.intro}
            </p>
            <Link
              href={path('/services')}
              scroll={false}
              onClick={onNavigate}
              className={`group inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-fill px-5 py-2.5 text-sm font-extrabold text-on-brand transition-colors hover:bg-brand-bright-fill ${FOCUS}`}
            >
              {t.viewAll}
              <span className="rounded-full bg-on-brand/15 px-2 py-0.5 text-[11px] font-bold">{fill(t.count, { count: num(total) })}</span>
              <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 ltr:rotate-180 ltr:group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/** The same in the mobile menu, opened under the "services" item. */
export const MobileServicesList: React.FC<Props> = ({ id, services, onNavigate }) => {
  const { t: { layout: { header: { servicesMenu: t } } }, path } = useI18n();
  return (
    <div id={id} className="mt-1 mb-2 rounded-xl border border-ink/10 bg-surface/70 p-3 space-y-2">
      <ul>
        {services.map((service) => {
          const Icon = serviceIcon(service.icon);
          return (
            <li key={service.slug}>
              <Link
                href={path(`/services/${service.slug}`)}
                scroll={false}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 ${FOCUS}`}
              >
                <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                {service.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={path('/services')}
        scroll={false}
        onClick={onNavigate}
        className={`flex items-center justify-center gap-2 rounded-lg bg-brand-fill py-3 text-sm font-extrabold text-on-brand ${FOCUS}`}
      >
        {t.viewAll}
        <ArrowLeft aria-hidden="true" className="h-4 w-4 ltr:rotate-180" />
      </Link>
    </div>
  );
};
