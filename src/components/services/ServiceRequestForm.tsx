'use client';

import React, { useRef, useState, useTransition } from 'react';
import { AlertCircle, Send, ShieldCheck } from 'lucide-react';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { submitServiceRequest } from '../../modules/site/actions';
import { RequestReceived } from '../ui/RequestReceived';
import { TextField } from '../ui/TextField';
import { useI18n } from '../../i18n/I18nProvider';

interface ServiceRequestFormProps {
  serviceId: number;
  serviceShortTitle: string;
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
  fullName: string;
  phone: string;
  details: string;
  remaining: number;
  ready: boolean;
}> = ({ title, fullName, phone, details, remaining, ready }) => {
  const t = useI18n().t.services.form;
  return (
    <div aria-hidden="true" className="relative rounded-2xl overflow-hidden bg-[#E2C98C] text-[#07191F]">
      <div className="px-5 sm:px-6 pt-5 pb-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#07191F]/75">
          <span>{t.waybill}</span>
          <span>GITI</span>
        </div>
        <p className="mt-3 text-xl sm:text-[1.4rem] font-black leading-snug">{title}</p>

        <div className="mt-4">
          <WaybillRow label={t.applicant} value={fullName.trim()} placeholder={t.notEntered} />
          <WaybillRow label={t.phone} value={phone.trim()} placeholder={t.notEntered} ltr />
          <WaybillRow label={t.description} value={details.trim() ? t.written : ''} placeholder={t.optional} />
        </div>
      </div>

      {/* Tear line, with the notches a real ticket stub has */}
      <div className="relative border-t-2 border-dashed border-[#07191F]/35">
        <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#07191F]" />
        <span className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-[#07191F]" />
      </div>

      <div className="relative px-5 sm:px-6 py-4 min-h-[84px] flex items-center">
        {/* Two stops are required: the name and the phone number */}
        <div className="flex-1 pe-24">
          <p className="text-xs font-bold text-[#07191F]/75 mb-2">{ready ? t.ready : remaining === 2 ? t.twoLeft : t.oneLeft}</p>
          <div className="relative h-1 rounded-full bg-[#07191F]/20">
            <span className="waybill-progress absolute inset-y-0 start-0 rounded-full bg-[#087F7B]" style={{ width: `${((2 - remaining) / 2) * 100}%` }} />
          </div>
        </div>
        {ready && (
          <span className="waybill-stamp absolute end-4 top-1/2 flex items-center justify-center w-[84px] h-[84px] rounded-full border-[3px] border-[#087F7B] text-[#07655F] text-[13px] font-black text-center leading-tight">
            {t.stampTop}
            <br />
            {t.stampBottom}
          </span>
        )}
      </div>
    </div>
  );
};

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceId, serviceShortTitle }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [touched, setTouched] = useState({ fullName: false, phone: false });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<number | null>(null);
  const [isSubmitting, startSubmit] = useTransition();
  const { t: { services: { form: t } }, locale } = useI18n();

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const nameCheck = validateFullName(fullName, locale);
  const phoneCheck = validatePhoneNumber(phone, locale);
  const ready = nameCheck.isValid && phoneCheck.isValid;
  const filled = Number(nameCheck.isValid) + Number(phoneCheck.isValid);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();

    startSubmit(async () => {
      const result = await submitServiceRequest({ serviceId, name: fullName, phone, description: details }, locale);
      if (result.ok) {
        setReference(result.data!.reference);
        setServerErrors({});
        setFormError(null);
      } else {
        setServerErrors(result.errors ?? {});
        setFormError(result.message ?? null);
      }
    });
  };

  const reset = () => {
    setReference(null);
    setFullName('');
    setPhone('');
    setDetails('');
    setTouched({ fullName: false, phone: false });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start text-start">
      <div className="lg:col-span-7">
        {reference ? (
          <RequestReceived reference={reference} onReset={reset} />
        ) : (
          <div className="space-y-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                id="service-fullname"
                label={t.nameLabel}
                value={fullName}
                inputRef={nameRef}
                autoComplete="name"
                placeholder={t.namePlaceholder}
                valid={nameCheck.isValid}
                error={touched.fullName ? nameCheck.error ?? serverErrors.name : undefined}
                onChange={setFullName}
                onBlur={() => setTouched((current) => ({ ...current, fullName: fullName !== '' || current.fullName }))}
              />
              <TextField
                id="service-phone"
                label={t.phoneLabel}
                value={phone}
                inputRef={phoneRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t.phonePlaceholder}
                ltr
                valid={phoneCheck.isValid}
                error={touched.phone ? phoneCheck.error ?? serverErrors.phone : undefined}
                onChange={setPhone}
                onBlur={() => setTouched((current) => ({ ...current, phone: phone !== '' || current.phone }))}
              />
            </div>

            <div>
              <label htmlFor="service-details" className="block mb-2 text-sm font-bold text-[#F7F7F3]">
                {t.detailsLabel} <span className="font-normal text-[#A2B6BC]">{t.detailsOptional}</span>
              </label>
              <textarea
                id="service-details"
                rows={5}
                maxLength={2000}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder={t.detailsPlaceholder}
                className="w-full px-4 py-3.5 rounded-lg bg-[#0C252B] border border-white/15 hover:border-white/30 text-base leading-relaxed text-white placeholder:text-[#7F979E] outline-none transition-colors resize-none focus:border-[#E2C98C] focus:ring-1 focus:ring-[#E2C98C]"
              />
              {serverErrors.description && <p className="mt-2 text-[13px] text-[#F58B8B]">{serverErrors.description}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-36">
        <Waybill title={serviceShortTitle} fullName={fullName} phone={phone} details={details} remaining={2 - filled} ready={ready} />

        {!reference && (
          <>
            {formError && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[#F58B8B]">
                <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full inline-flex items-center justify-center gap-2.5 min-h-14 px-6 rounded-lg bg-[#12B8B0] hover:bg-[#3ED0C8] disabled:opacity-70 disabled:cursor-wait text-[#07191F] font-black text-base transition-colors ${FOCUS}`}
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? t.submitting : t.submit}</span>
            </button>
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-[#A2B6BC]">
              <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-[#12B8B0]" />
              <span>{t.privacy}</span>
            </p>
          </>
        )}
      </div>
    </form>
  );
};
