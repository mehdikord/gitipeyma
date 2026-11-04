'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, PencilLine, PhoneCall } from 'lucide-react';
import { telHref } from '../../utils/contact';
import { useSite } from '../site/SiteProvider';
import { useI18n } from '../../i18n/I18nProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

// Shown once a form is saved: the request number to quote, and the line for anyone who can't wait.
export const RequestReceived: React.FC<{ reference: number; title?: string; text?: string; onReset: () => void; resetLabel?: string }> = ({
  reference,
  title,
  text,
  onReset,
  resetLabel,
}) => {
  const { t: { forms: { received: t } }, num } = useI18n();
  const supportPhone = useSite().settings.support_phone;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status">
      <h3 ref={headingRef} tabIndex={-1} className="scroll-mt-28 flex items-center gap-3 text-2xl sm:text-3xl font-black leading-snug text-ink-strong outline-none">
        <CheckCircle2 aria-hidden="true" className="w-8 h-8 shrink-0 text-brand-bright" />
        <span>{title ?? t.title}</span>
      </h3>
      <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-[1.95] text-ink-soft">{text ?? t.text}</p>
      <p className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface text-sm text-ink-muted">
        <span>{t.reference}</span>
        <span className="text-lg font-black text-gold">{num(reference, { useGrouping: false })}</span>
      </p>
      <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
        <a
          href={telHref(supportPhone)}
          className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg text-ink border border-ink/25 hover:border-brand font-bold text-[15px] transition-colors ${FOCUS}`}
        >
          <PhoneCall className="w-[18px] h-[18px]" />
          <span>{t.urgent}</span>
          <span dir="ltr">{supportPhone}</span>
        </a>
        <button
          type="button"
          onClick={onReset}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-gold hover:text-ink-strong font-bold text-[15px] transition-colors ${FOCUS}`}
        >
          <PencilLine className="w-[18px] h-[18px]" />
          <span>{resetLabel ?? t.reset}</span>
        </button>
      </div>
    </div>
  );
};
