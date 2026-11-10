'use client';

import React, { useMemo, useRef, useState, useTransition } from 'react';
import { AlertCircle, Send, ShieldCheck } from 'lucide-react';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { submitServiceRequest } from '../../modules/site/actions';
import { RequestReceived } from '../ui/RequestReceived';
import { TextField } from '../ui/TextField';
import { useI18n } from '../../i18n/I18nProvider';
import { checkAnswer, PublicFormField, RawAnswer } from '../../modules/serviceForms/fields';
import { emptyAnswer, fieldInputId, isAnswered, isWide, ServiceFormField } from './ServiceFormField';

interface ServiceRequestFormProps {
  serviceId: number;
  serviceShortTitle: string;
  // The service's own questions, designed in the panel; they come after the name and phone.
  fields: PublicFormField[];
}

type Answers = Record<string, RawAnswer>;

const emptyAnswers = (fields: PublicFormField[]): Answers => Object.fromEntries(fields.map((field) => [String(field.id), emptyAnswer(field)]));

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-line';

// ---- The waybill: a live preview that fills in as the visitor types ------------

const WaybillRow: React.FC<{ label: string; value: string; placeholder?: string; ltr?: boolean }> = ({ label, value, placeholder, ltr }) => (
  <div className="flex items-baseline justify-between gap-4 py-2 border-b border-canvas/15 last:border-b-0">
    <span className="shrink-0 text-xs font-medium text-on-accent/70">{label}</span>
    {value ? (
      <span dir={ltr ? 'ltr' : undefined} className="min-w-0 truncate text-sm font-extrabold text-on-accent">
        {value}
      </span>
    ) : (
      <span className="text-xs text-on-accent/55">{placeholder}</span>
    )}
  </div>
);

const Waybill: React.FC<{
  title: string;
  fullName: string;
  phone: string;
  // How many of the service's own questions are answered, out of how many
  details: { done: number; total: number };
  required: { done: number; total: number };
  // Answers still missing or wrong, required or not
  remaining: number;
  ready: boolean;
}> = ({ title, fullName, phone, details, required, remaining, ready }) => {
  const { t: { services: { form: t } }, num, fill } = useI18n();
  return (
    <div aria-hidden="true" className="relative rounded-2xl overflow-hidden bg-gold-fill text-on-accent">
      <div className="px-5 sm:px-6 pt-5 pb-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-on-accent/75">
          <span>{t.waybill}</span>
          <span>ROYAL TRAVEL</span>
        </div>
        <p className="mt-3 text-xl sm:text-[1.4rem] font-black leading-snug">{title}</p>

        <div className="mt-4">
          <WaybillRow label={t.applicant} value={fullName.trim()} placeholder={t.notEntered} />
          <WaybillRow label={t.phone} value={phone.trim()} placeholder={t.notEntered} ltr />
          {details.total > 0 && (
            <WaybillRow label={t.details} value={details.done ? fill(t.answered, { done: num(details.done), total: num(details.total) }) : ''} placeholder={t.notEntered} />
          )}
        </div>
      </div>

      {/* Tear line, with the notches a real ticket stub has */}
      <div className="relative border-t-2 border-dashed border-canvas/35">
        <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-canvas" />
        <span className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-canvas" />
      </div>

      <div className="relative px-5 sm:px-6 py-4 min-h-[84px] flex items-center">
        {/* The required stops: the name, the phone number and the service's required questions */}
        <div className="flex-1 pe-24">
          <p className="text-xs font-bold text-on-accent/75 mb-2">{ready ? t.ready : fill(t.left, { count: num(remaining) })}</p>
          <div className="relative h-1 rounded-full bg-canvas/20">
            <span className="waybill-progress absolute inset-y-0 start-0 rounded-full bg-[#087F7B]" style={{ width: `${(required.done / required.total) * 100}%` }} />
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

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceId, serviceShortTitle, fields }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState<Answers>(() => emptyAnswers(fields));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<number | null>(null);
  const [isSubmitting, startSubmit] = useTransition();
  const { t: { services: { form: t } }, locale } = useI18n();

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const nameCheck = validateFullName(fullName, locale);
  const phoneCheck = validatePhoneNumber(phone, locale);
  // The same check the server runs, per question
  const fieldErrors = useMemo(
    () => Object.fromEntries(fields.map((field) => [String(field.id), checkAnswer(field, answers[String(field.id)], locale).error])),
    [fields, answers, locale],
  );
  const firstInvalid = fields.find((field) => fieldErrors[String(field.id)]);
  const ready = nameCheck.isValid && phoneCheck.isValid && !firstInvalid;

  const requiredFields = fields.filter((field) => field.required);
  const required = {
    total: 2 + requiredFields.length,
    done: Number(nameCheck.isValid) + Number(phoneCheck.isValid) + requiredFields.filter((field) => !fieldErrors[String(field.id)]).length,
  };
  const remaining = Number(!nameCheck.isValid) + Number(!phoneCheck.isValid) + fields.filter((field) => fieldErrors[String(field.id)]).length;
  const details = { total: fields.length, done: fields.filter((field) => isAnswered(answers[String(field.id)])).length };

  const touch = (key: string) => setTouched((current) => (current[key] ? current : { ...current, [key]: true }));

  const setAnswer = (field: PublicFormField, value: RawAnswer) => {
    const key = String(field.id);
    setAnswers((current) => ({ ...current, [key]: value }));
    // A choice is made in one go, so its error can show right away; typed answers wait for blur
    if (field.type === 'select' || field.type === 'checkbox') touch(key);
    if (serverErrors[`answers.${key}`]) setServerErrors(({ [`answers.${key}`]: _, ...rest }) => rest);
  };

  const errorFor = (field: PublicFormField) => {
    const key = String(field.id);
    return touched[key] ? fieldErrors[key] ?? serverErrors[`answers.${key}`] : serverErrors[`answers.${key}`];
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, phone: true, ...Object.fromEntries(fields.map((field) => [String(field.id), true])) });
    if (!nameCheck.isValid) return nameRef.current?.focus();
    if (!phoneCheck.isValid) return phoneRef.current?.focus();
    if (firstInvalid) return document.getElementById(fieldInputId(firstInvalid))?.focus();

    startSubmit(async () => {
      const result = await submitServiceRequest({ serviceId, name: fullName, phone, answers }, locale);
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
    setAnswers(emptyAnswers(fields));
    setTouched({});
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
                onBlur={() => fullName !== '' && touch('fullName')}
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
                onBlur={() => phone !== '' && touch('phone')}
              />
            </div>

            {fields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-7 border-t border-ink/10">
                {fields.map((field) => (
                  <div key={field.id} className={isWide(field) ? 'sm:col-span-2' : undefined}>
                    <ServiceFormField
                      field={field}
                      value={answers[String(field.id)]}
                      error={errorFor(field)}
                      onChange={(value) => setAnswer(field, value)}
                      onBlur={() => isAnswered(answers[String(field.id)]) && touch(String(field.id))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-36">
        <Waybill title={serviceShortTitle} fullName={fullName} phone={phone} details={details} required={required} remaining={remaining} ready={ready} />

        {!reference && (
          <>
            {formError && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-danger">
                <AlertCircle aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full inline-flex items-center justify-center gap-2.5 min-h-14 px-6 rounded-lg bg-brand-fill hover:bg-brand-bright-fill disabled:opacity-70 disabled:cursor-wait text-on-accent font-black text-base transition-colors ${FOCUS}`}
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? t.submitting : t.submit}</span>
            </button>
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
              <ShieldCheck aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
              <span>{t.privacy}</span>
            </p>
          </>
        )}
      </div>
    </form>
  );
};
