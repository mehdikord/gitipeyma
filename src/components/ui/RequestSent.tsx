'use client';

import React, { useEffect, useRef } from 'react';
import { MessageCircle, PencilLine, PhoneCall } from 'lucide-react';
import { COMPANY_CONFIG } from '../../data/company';
import { telHref } from '../../utils/contact';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';
const SUPPORT_PHONE = COMPANY_CONFIG.emergencySupportPhone;

// Nothing is received until the visitor presses send in WhatsApp, so this says exactly that.
export const RequestSent: React.FC<{ url: string; onEdit: () => void }> = ({ url, onEdit }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div>
      <h3 ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-2xl sm:text-3xl font-black leading-snug text-white outline-none">
        یک قدم تا ثبت درخواست
      </h3>
      <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-[1.95] text-[#C9D7DB]">
        متن درخواست شما در واتس‌اپ آماده است. آنجا دکمه ارسال را بزنید تا به دست کارشناس برسد. اگر واتس‌اپ باز نشد، از دکمه زیر استفاده کنید یا با ما تماس بگیرید.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-[15px] transition-colors ${FOCUS}`}
        >
          <MessageCircle className="w-5 h-5" />
          <span>باز کردن واتس‌اپ</span>
        </a>
        <a
          href={telHref(SUPPORT_PHONE)}
          className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg text-[#F7F7F3] border border-white/25 hover:border-[#12B8B0] font-bold text-[15px] transition-colors ${FOCUS}`}
        >
          <PhoneCall className="w-[18px] h-[18px]" />
          <span dir="ltr">{SUPPORT_PHONE}</span>
        </a>
        <button
          type="button"
          onClick={onEdit}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-[#E2C98C] hover:text-white font-bold text-[15px] transition-colors ${FOCUS}`}
        >
          <PencilLine className="w-[18px] h-[18px]" />
          <span>ویرایش درخواست</span>
        </button>
      </div>
    </div>
  );
};
