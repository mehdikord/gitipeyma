'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, MessageCircle, PencilLine, PhoneCall, ShieldCheck } from 'lucide-react';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { REQUEST_QUESTIONS, RequestRoute, routeText } from '../../data/serviceRequestOptions';
import { requestWhatsAppUrl } from '../../utils/serviceRequest';
import { COMPANY_CONFIG } from '../../data/company';

interface ServiceRequestFormProps {
  serviceTitle: string;
  serviceShortTitle: string;
  serviceSlug: string;
}

const SUPPORT_PHONE = COMPANY_CONFIG.emergencySupportPhone;
const SUPPORT_TEL = `tel:${SUPPORT_PHONE.replace(/[\s()-]/g, '')}`;
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C98C]';

// ---- The waybill: a live preview that fills in as the visitor types ------------

const WaybillRow: React.FC<{ label: string; value: string; placeholder?: string; ltr?: boolean }> = ({ label, value, placeholder, ltr }) => (
  <div className="flex items-baseline justify-between gap-4 py-2 border-b border-[#07191F]/15 last:border-b-0">
    <span className="shrink-0 text-xs font-medium text-[#07191F]/70">{label}</span>
    {value ? (
      <span dir={ltr ? 'ltr' : undefined} className="min-w-0 truncate text-sm font-extrabold text-[#07191F]">
        {value}
      </span>
    ) : (
      <span className="text-xs text-[#07191F]/55">{placeholder}</span>
    )}
  </div>
);

const Waybill: React.FC<{
  title: string;
  route: RequestRoute | null;
  rows: { label: string; value: string }[];
  fullName: string;
  phone: string;
  remaining: number;
  ready: boolean;
}> = ({ title, route, rows, fullName, phone, remaining, ready }) => (
  <div aria-hidden="true" className="relative rounded-2xl overflow-hidden bg-[#E2C98C] text-[#07191F]">
    <div className="px-5 sm:px-6 pt-5 pb-5">
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#07191F]/75">
        <span>برگه درخواست گیتی پیما</span>
        <span>GITI</span>
      </div>
      <p className="mt-3 text-xl sm:text-[1.4rem] font-black leading-snug">{title}</p>

      {route && (
        <div className="mt-4 flex items-center gap-3 font-black text-lg">
          <span>{route.from}</span>
          <span className="relative flex-1 h-0.5 bg-[#07191F]/70">
            <span className="absolute -top-[3px] right-0 w-2 h-2 rounded-full bg-[#07191F]" />
            <span className="absolute -top-[3px] left-0 w-2 h-2 rounded-full border-2 border-[#07191F] bg-[#E2C98C]" />
          </span>
          <span>{route.to}</span>
        </div>
      )}

      <div className="mt-4">
        {rows.map((row) => (
          <WaybillRow key={row.label} label={row.label} value={row.value} placeholder="اختیاری" />
        ))}
        <WaybillRow label="نام متقاضی" value={fullName.trim()} placeholder="هنوز وارد نشده" />
        <WaybillRow label="شماره تماس" value={phone.trim()} placeholder="هنوز وارد نشده" ltr />
      </div>
    </div>

    {/* Tear line, with the notches a real ticket stub has */}
    <div className="relative border-t-2 border-dashed border-[#07191F]/35">
      <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#07191F]" />
      <span className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-[#07191F]" />
    </div>

    <div className="relative px-5 sm:px-6 py-4 min-h-[84px] flex items-center">
      {/* Two stops are required: the name and the phone number */}
      <div className="flex-1 pl-24">
        <p className="text-xs font-bold text-[#07191F]/75 mb-2">{ready ? 'همه چیز آماده است' : remaining === 2 ? 'نام و شماره تماس مانده' : 'یک مورد ضروری مانده'}</p>
        <div className="relative h-1 rounded-full bg-[#07191F]/20">
          <span className="waybill-progress absolute inset-y-0 right-0 rounded-full bg-[#087F7B]" style={{ width: `${((2 - remaining) / 2) * 100}%` }} />
        </div>
      </div>
      {ready && (
        <span className="waybill-stamp absolute left-4 top-1/2 flex items-center justify-center w-[84px] h-[84px] rounded-full border-[3px] border-[#087F7B] text-[#07655F] text-[13px] font-black text-center leading-tight">
          آماده
          <br />
          ارسال
        </span>
      )}
    </div>
  </div>
);

// ---- Fields ------------------------------------------------------------------

const TextField: React.FC<{
  id: string;
  label: string;
  value: string;
  error?: string;
  valid: boolean;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onBlur: () => void;
  autoComplete: string;
  type?: string;
  inputMode?: 'tel' | 'text';
  ltr?: boolean;
}> = ({ id, label, value, error, valid, placeholder, inputRef, onChange, onBlur, autoComplete, type = 'text', inputMode, ltr }) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-bold text-[#F7F7F3]">
      {label}
    </label>
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type={type}
        inputMode={inputMode}
        dir={ltr ? 'ltr' : undefined}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`w-full h-14 rounded-lg bg-[#0C252B] border text-base text-white placeholder:text-[#7F979E] outline-none transition-colors focus:border-[#E2C98C] focus:ring-1 focus:ring-[#E2C98C] ${
          ltr ? 'pl-4 pr-11 text-left placeholder:text-right' : 'pr-4 pl-11'
        } ${error ? 'border-[#F58B8B]' : 'border-white/15 hover:border-white/30'}`}
      />
      {valid && <Check aria-hidden="true" className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#3ED0C8] ${ltr ? 'right-4' : 'left-4'}`} />}
    </div>
    {error && (
      <p id={`${id}-error`} className="flex items-start gap-1.5 mt-2 text-[13px] leading-relaxed text-[#F58B8B]">
        <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
        <span>{error}</span>
      </p>
    )}
  </div>
);

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceTitle, serviceShortTitle, serviceSlug }) => {
  const questions = REQUEST_QUESTIONS[serviceSlug] ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [touched, setTouched] = useState({ fullName: false, phone: false });
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const sentHeadingRef = useRef<HTMLHeadingElement>(null);

  const nameCheck = validateFullName(fullName);
  const phoneCheck = validatePhoneNumber(phone);
  const ready = nameCheck.isValid && phoneCheck.isValid;
  const filled = Number(nameCheck.isValid) + Number(phoneCheck.isValid);

  const routeQuestion = questions.find((question) => question.kind === 'route');
  const selectedRoute =
    routeQuestion?.kind === 'route' ? routeQuestion.routes.find((route) => routeText(route) === answers[routeQuestion.id]) ?? null : null;

  const answerRows = questions
    .filter((question) => question.kind !== 'route')
    .map((question) => ({ label: question.label, value: answers[question.id] ?? '' }));

  useEffect(() => {
    if (sentUrl) sentHeadingRef.current?.focus();
  }, [sentUrl]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();

    const url = requestWhatsAppUrl({
      serviceTitle,
      answers: questions.filter((question) => answers[question.id]).map((question) => ({ label: question.label, value: answers[question.id] })),
      fullName,
      phone,
      details,
    });
    window.open(url, '_blank', 'noopener');
    setSentUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start text-right">
      <div className="lg:col-span-7">
        {sentUrl ? (
          <div>
            <h3 ref={sentHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-black leading-snug text-white outline-none">
              یک قدم تا ثبت درخواست
            </h3>
            <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-[1.95] text-[#C9D7DB]">
              متن درخواست شما در واتس‌اپ آماده است. آنجا دکمه ارسال را بزنید تا به دست کارشناس برسد. اگر واتس‌اپ باز نشد، از دکمه زیر استفاده کنید یا با ما تماس بگیرید.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href={sentUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-extrabold text-[15px] transition-colors ${FOCUS}`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>باز کردن واتس‌اپ</span>
              </a>
              <a
                href={SUPPORT_TEL}
                className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-lg text-[#F7F7F3] border border-white/25 hover:border-[#12B8B0] font-bold text-[15px] transition-colors ${FOCUS}`}
              >
                <PhoneCall className="w-[18px] h-[18px]" />
                <span dir="ltr">{SUPPORT_PHONE}</span>
              </a>
              <button
                type="button"
                onClick={() => setSentUrl(null)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-[#E2C98C] hover:text-white font-bold text-[15px] transition-colors ${FOCUS}`}
              >
                <PencilLine className="w-[18px] h-[18px]" />
                <span>ویرایش درخواست</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            {questions.map((question) => {
              const options =
                question.kind === 'route'
                  ? question.routes.map((route) => ({ value: routeText(route), text: `${route.from} ← ${route.to}` }))
                  : question.choices.map((choice) => ({ value: choice, text: choice }));
              return (
                <fieldset key={question.id}>
                  <legend className="mb-2.5 text-sm font-bold text-[#F7F7F3]">
                    {question.label} <span className="font-normal text-[#A2B6BC]">(اختیاری)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => {
                      const isSelected = answers[question.id] === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`inline-flex items-center min-h-11 px-4 py-2 rounded-lg border text-sm font-bold cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E2C98C] ${
                            isSelected ? 'bg-[#E2C98C] border-[#E2C98C] text-[#07191F]' : 'bg-[#0C252B] border-white/15 text-[#D5E0E3] hover:border-white/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${serviceSlug}-${question.id}`}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                            className="sr-only"
                          />
                          {option.text}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                id="service-fullname"
                label="نام و نام خانوادگی"
                value={fullName}
                inputRef={nameRef}
                autoComplete="name"
                placeholder="مثال: علی احمدی"
                valid={nameCheck.isValid}
                error={touched.fullName ? nameCheck.error : undefined}
                onChange={setFullName}
                onBlur={() => setTouched((current) => ({ ...current, fullName: fullName !== '' || current.fullName }))}
              />
              <TextField
                id="service-phone"
                label="شماره موبایل یا واتس‌اپ"
                value={phone}
                inputRef={phoneRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                ltr
                valid={phoneCheck.isValid}
                error={touched.phone ? phoneCheck.error : undefined}
                onChange={setPhone}
                onBlur={() => setTouched((current) => ({ ...current, phone: phone !== '' || current.phone }))}
              />
            </div>

            <div>
              <label htmlFor="service-details" className="block mb-2 text-sm font-bold text-[#F7F7F3]">
                توضیحات <span className="font-normal text-[#A2B6BC]">(اختیاری)</span>
              </label>
              <textarea
                id="service-details"
                rows={3}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="هر چیزی که به کارشناس کمک می‌کند؛ مثل تاریخ، وزن بار یا شرایط خاص پرونده."
                className="w-full px-4 py-3.5 rounded-lg bg-[#0C252B] border border-white/15 hover:border-white/30 text-base leading-relaxed text-white placeholder:text-[#7F979E] outline-none transition-colors resize-none focus:border-[#E2C98C] focus:ring-1 focus:ring-[#E2C98C]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-36">
        <Waybill title={serviceShortTitle} route={selectedRoute} rows={answerRows} fullName={fullName} phone={phone} remaining={2 - filled} ready={ready} />

        {!sentUrl && (
          <>
            <button
              type="submit"
              className={`mt-4 w-full inline-flex items-center justify-center gap-2.5 min-h-14 px-6 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] text-[#07191F] font-black text-base transition-colors ${FOCUS}`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>ارسال درخواست در واتس‌اپ</span>
            </button>
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-[#A2B6BC]">
              <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-[#12B8B0]" />
              <span>اطلاعات شما محرمانه می‌ماند و فقط برای تماس کارشناس استفاده می‌شود.</span>
            </p>
          </>
        )}
      </div>
    </form>
  );
};
