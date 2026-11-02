'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, PencilLine, PhoneCall } from 'lucide-react';
import { telHref } from '../../utils/contact';
import { useSite } from '../site/SiteProvider';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

// Shown once a form is saved: the request number to quote, and the line for anyone who can't wait.
export const RequestReceived: React.FC<{ reference: number; title?: string; text?: string; onReset: () => void; resetLabel?: string }> = ({
  reference,
  title = 'درخواست شما ثبت شد',
  text = 'کارشناسان گیتی پیما درخواست شما را بررسی می‌کنند و به‌زودی با شماره‌ای که وارد کردید تماس می‌گیرند.',
  onReset,
  resetLabel = 'ثبت درخواست دیگر',
}) => {
  const supportPhone = useSite().settings.support_phone;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status">
      <h3 ref={headingRef} tabIndex={-1} className="scroll-mt-28 flex items-center gap-3 text-2xl sm:text-3xl font-black leading-snug text-white outline-none">
        <CheckCircle2 aria-hidden="true" className="w-8 h-8 shrink-0 text-[#3ED0C8]" />
        <span>{title}</span>
      </h3>
      <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-[1.95] text-[#C9D7DB]">{text}</p>
      <p className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0C252B] text-sm text-[#A2B6BC]">
        <span>شماره پیگیری</span>
        <span className="text-lg font-black text-[#E2C98C]">{reference.toLocaleString('fa-IR', { useGrouping: false })}</span>
      </p>
      <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
        <a
          href={telHref(supportPhone)}
          className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg text-[#F7F7F3] border border-white/25 hover:border-[#12B8B0] font-bold text-[15px] transition-colors ${FOCUS}`}
        >
          <PhoneCall className="w-[18px] h-[18px]" />
          <span>کارتان فوری است؟</span>
          <span dir="ltr">{supportPhone}</span>
        </a>
        <button
          type="button"
          onClick={onReset}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-[#E2C98C] hover:text-white font-bold text-[15px] transition-colors ${FOCUS}`}
        >
          <PencilLine className="w-[18px] h-[18px]" />
          <span>{resetLabel}</span>
        </button>
      </div>
    </div>
  );
};
