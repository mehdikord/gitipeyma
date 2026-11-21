'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ServiceMenuGroup, Tone } from '../../types';
import { serviceIcon } from '../../modules/services/icons';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

const TONE: Record<Tone, { rail: string; tile: string; heading: string }> = {
  teal: { rail: 'bg-brand-fill', tile: 'bg-brand/10 text-brand group-hover:bg-brand-fill group-hover:text-on-brand', heading: 'text-brand' },
  gold: { rail: 'bg-gold-deep-fill', tile: 'bg-gold/10 text-gold group-hover:bg-gold-fill group-hover:text-on-accent', heading: 'text-gold' },
};

const countOf = (groups: ServiceMenuGroup[]) => groups.reduce((sum, group) => sum + group.services.length, 0);

/**
 * The panel under the header's "services" item: every active service, under its group, with a way
 * through to the full /services page at the bottom. It stays in the page while closed (hidden and
 * inert), so the links are still there for crawlers.
 */
export const ServicesMegaMenu: React.FC<{ id: string; open: boolean; groups: ServiceMenuGroup[]; onNavigate: () => void }> = ({ id, open, groups, onNavigate }) => {
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
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto p-6 xl:p-7">
            <div className="grid gap-x-6 gap-y-7 grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))]">
              {groups.map((group, index) => (
                <section key={group.title ?? `other-${index}`} aria-labelledby={`${id}-group-${index}`}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span aria-hidden="true" className={`h-4 w-1 rounded-full ${TONE[group.tone].rail}`} />
                    <h2 id={`${id}-group-${index}`} className={`text-xs font-extrabold ${TONE[group.tone].heading}`}>
                      {group.title ?? t.other}
                    </h2>
                  </div>
                  <ul className="space-y-1">
                    {group.services.map((service) => {
                      const Icon = serviceIcon(service.icon);
                      return (
                        <li key={service.slug}>
                          <Link
                            href={path(`/services/${service.slug}`)}
                            scroll={false}
                            onClick={onNavigate}
                            className={`group -mx-2.5 flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-ink/5 ${FOCUS}`}
                          >
                            <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors ${TONE[group.tone].tile}`}>
                              <Icon className="h-[18px] w-[18px]" />
                            </span>
                            <span className="min-w-0 pt-0.5">
                              <span className="block text-sm font-bold leading-snug text-ink-strong">{service.title}</span>
                              <span className="mt-0.5 text-xs leading-relaxed text-ink-muted line-clamp-2">{service.summary}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-ink/10 bg-surface-2/60 px-6 xl:px-7 py-4">
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
              <span className="rounded-full bg-on-brand/15 px-2 py-0.5 text-[11px] font-bold">{fill(t.count, { count: num(countOf(groups)) })}</span>
              <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 ltr:rotate-180 ltr:group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/** The same list in the mobile menu, opened under the "services" item. */
export const MobileServicesList: React.FC<{ id: string; groups: ServiceMenuGroup[]; onNavigate: () => void }> = ({ id, groups, onNavigate }) => {
  const { t: { layout: { header: { servicesMenu: t } } }, path } = useI18n();
  return (
    <div id={id} className="mt-1 mb-2 rounded-xl border border-ink/10 bg-surface/70 p-3 space-y-4">
      {groups.map((group, index) => (
        <div key={group.title ?? `other-${index}`}>
          <p className={`px-2 mb-1 text-[11px] font-extrabold ${TONE[group.tone].heading}`}>{group.title ?? t.other}</p>
          <ul>
            {group.services.map((service) => {
              const Icon = serviceIcon(service.icon);
              return (
                <li key={service.slug}>
                  <Link
                    href={path(`/services/${service.slug}`)}
                    scroll={false}
                    onClick={onNavigate}
                    className={`group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-ink hover:bg-ink/5 ${FOCUS}`}
                  >
                    <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${TONE[group.tone].tile}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {service.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
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
