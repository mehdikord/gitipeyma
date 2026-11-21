'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, PackageCheck, ShieldCheck } from 'lucide-react';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';
// Where "get a cargo quote" leads: the request form of the cargo service
const CARGO_REQUEST = '/services/cargo-express-postal#request';
// The figures of the example at the bottom of the section, drawn in the one-third bar
const EXAMPLE_COVERAGE = 300_000;

const stagger = (i: number) => ({ '--i': i }) as React.CSSProperties;

/** The example drawn: the coverage as a bar of three equal parts, the first one (the premium) in gold. */
const OneThirdBar: React.FC = () => {
  const { t: { home: { cargoInsurance: t } }, num, fill } = useI18n();
  const lira = (amount: number) => fill(t.lira, { amount: num(amount) });
  return (
    <div aria-hidden="true" className="ins-in relative flex items-center gap-6 sm:gap-8 rounded-2xl border border-ink/10 bg-surface/80 p-6 sm:p-8 shadow-2xl shadow-black/20" style={stagger(2)}>
      {/* A stacked fraction: 1 over 3 */}
      <div className="flex shrink-0 flex-col items-center font-black leading-none text-gold">
        <span className="text-5xl sm:text-6xl">{num(1)}</span>
        <span className="my-2.5 h-1 w-12 sm:w-14 rounded-full bg-gold-fill" />
        <span className="text-5xl sm:text-6xl">{num(3)}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xl sm:text-2xl font-black text-gold whitespace-nowrap">{lira(EXAMPLE_COVERAGE / 3)}</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <span className="relative h-4 overflow-hidden rounded-s-full bg-gold-fill/15">
            <span className="ins-fill absolute inset-0 rounded-s-full bg-gradient-to-l from-gold-deep-fill via-gold-fill to-gold-fill ltr:bg-gradient-to-r" />
          </span>
          <span className="h-4 bg-brand-fill/30" />
          <span className="h-4 rounded-e-full bg-brand-fill/30" />
        </div>
        {/* A bracket under the whole bar: the coverage */}
        <div className="mt-2.5 h-2 border-x border-b border-ink/25 rounded-b-md" />
        <p className="mt-2 text-center text-sm font-bold text-ink-muted">{lira(EXAMPLE_COVERAGE)}</p>
      </div>
    </div>
  );
};

const CostLine: React.FC<{ label: string; value: string; tone: 'onBrand' | 'surface' }> = ({ label, value, tone }) => (
  <div
    className={`mt-auto rounded-xl p-4 ${
      tone === 'onBrand' ? 'bg-on-accent/25 border border-on-brand/15' : 'bg-surface-2 border border-ink/10'
    }`}
  >
    <p className={`flex items-center gap-2 text-xs font-bold ${tone === 'onBrand' ? 'text-on-brand/75' : 'text-ink-muted'}`}>
      {label}
      <span aria-hidden="true" className={`text-lg leading-none font-black ${tone === 'onBrand' ? 'text-gold-fill' : 'text-brand'}`}>=</span>
      <span className="sr-only">=</span>
    </p>
    <p className={`mt-1.5 text-[15px] sm:text-base font-extrabold leading-relaxed ${tone === 'onBrand' ? 'text-on-brand' : 'text-ink-strong'}`}>{value}</p>
  </div>
);

export const CargoInsuranceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useRevealOnce(sectionRef);
  const { t: { home: { cargoInsurance: t } }, num, path } = useI18n();

  return (
    <section
      ref={sectionRef}
      data-reveal={reveal}
      aria-labelledby="cargo-insurance-title"
      className="ins-section relative overflow-hidden bg-canvas-deep border-b border-brand/20 py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* The pitch, and the one-third rule drawn */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <p className="ins-in flex items-center gap-3 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-extrabold tracking-[0.32em] text-gold" style={stagger(0)}>
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              <span lang="en">{t.eyebrow}</span>
              <span aria-hidden="true" className="h-px w-12 bg-gold-line/60" />
            </p>
            <h2 id="cargo-insurance-title" className="ins-in mt-5 text-[1.9rem] sm:text-[2.5rem] xl:text-[2.85rem] font-black leading-[1.4] text-ink-strong [text-wrap:balance]" style={stagger(1)}>
              {t.title}
            </h2>
            <p className="ins-in mt-5 max-w-2xl text-[15px] sm:text-lg leading-[2] text-ink-soft" style={stagger(1)}>
              {t.lead}
            </p>
          </div>
          <div className="lg:col-span-5">
            <OneThirdBar />
          </div>
        </div>

        {/* The two ways to ship */}
        <div className="mt-12 lg:mt-16">
          <Link
            href={path(CARGO_REQUEST)}
            className={`ins-in group flex items-center justify-between gap-4 rounded-2xl border border-gold-line/30 bg-surface/60 px-5 sm:px-6 py-4 transition-colors hover:border-gold-line/70 hover:bg-surface ${FOCUS}`}
            style={stagger(3)}
          >
            <h3 className="flex items-center gap-3 text-lg sm:text-xl font-black text-ink-strong">
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-gold-fill/15 text-gold">
                <PackageCheck className="h-5 w-5" />
              </span>
              {t.inquiry}
            </h3>
            <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-fill text-on-accent transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1">
              <ArrowLeft className="h-4 w-4 ltr:-scale-x-100" />
            </span>
          </Link>

          <ol className="mt-5 grid gap-5 md:grid-cols-2">
            {/* With insurance: the featured option */}
            <li className="ins-in relative flex flex-col overflow-hidden rounded-2xl bg-brand-fill p-6 sm:p-8 text-on-brand shadow-2xl shadow-brand-fill/30" style={stagger(4)}>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_srgb,var(--on-brand)_16%,transparent),transparent_55%)]" />
              <ShieldCheck aria-hidden="true" strokeWidth={1.2} className="pointer-events-none absolute -end-6 -top-6 h-40 w-40 text-on-brand/10" />
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gold-fill text-on-accent text-lg font-black shadow-lg shadow-black/25">
                {num(1)}
              </span>
              <h4 className="relative mt-5 text-xl sm:text-[1.4rem] font-black leading-snug">{t.insured.title}</h4>
              <p className="relative mt-3 mb-6 max-w-xl text-sm sm:text-[15px] leading-[1.95] text-on-brand/85">{t.insured.text}</p>
              <div className="relative mt-auto">
                <CostLine label={t.costLabel} value={t.insured.cost} tone="onBrand" />
              </div>
            </li>

            {/* Without insurance */}
            <li className="ins-in relative flex flex-col rounded-2xl border border-ink/10 bg-surface p-6 sm:p-8" style={stagger(5)}>
              <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-brand text-brand text-lg font-black">
                {num(2)}
              </span>
              <h4 className="mt-5 text-xl sm:text-[1.4rem] font-black leading-snug text-ink-strong">{t.uninsured.title}</h4>
              <p className="mt-3 mb-6 max-w-xl text-sm sm:text-[15px] leading-[1.95] text-ink-muted">{t.uninsured.text}</p>
              <CostLine label={t.costLabel} value={t.uninsured.cost} tone="surface" />
            </li>
          </ol>
        </div>

        {/* The worked example */}
        <div className="ins-in mt-5 flex items-start gap-4 rounded-2xl border border-dashed border-gold-line/45 bg-gold-fill/[0.06] p-5 sm:p-6" style={stagger(6)}>
          <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-fill text-on-accent">
            <Calculator className="h-5 w-5" />
          </span>
          <p className="self-center text-sm sm:text-[15px] leading-[2] text-ink-soft">{t.example}</p>
        </div>
      </div>
    </section>
  );
};
