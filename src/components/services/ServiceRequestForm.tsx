'use client';

import React, { useRef, useState } from 'react';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { REQUEST_QUESTIONS, RequestRoute, routeText } from '../../data/serviceRequestOptions';
import { requestWhatsAppUrl } from '../../utils/serviceRequest';
import { RequestSent } from '../ui/RequestSent';
import { TextField } from '../ui/TextField';

interface ServiceRequestFormProps {
  serviceTitle: string;
  serviceShortTitle: string;
  serviceSlug: string;
}

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
          <RequestSent url={sentUrl} onEdit={() => setSentUrl(null)} />
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
