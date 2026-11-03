'use server';

/**
 * What the public forms submit. Each one validates on the server (the browser checks are only a
 * convenience), is throttled per visitor, and lands in the table the admin panel reads.
 * Every action takes the page's language, so its messages reach the visitor in that language.
 */

import { db } from '../../lib/db';
import { ActionResult, FormError, publicAction } from '../../lib/actions';
import { clientIp, tooManyAttempts } from '../../lib/rateLimit';
import { isLocale, Locale, LOCALES } from '../../i18n/config';
import type { Translated } from '../../i18n/translated';
import { serviceRequestSubmitSchema, ServiceRequestSubmitInput } from '../serviceRequests/schema';
import { consultationSubmitSchema, ConsultationSubmitInput } from '../consultations/schema';
import { contactMessageSubmitSchema, ContactMessageSubmitInput } from '../contactMessages/schema';
import { testimonialSubmitSchema, TestimonialSubmitInput } from '../testimonials/schema';
import { SITE_MESSAGES } from './messages';

const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;

const languageOf = (locale: unknown): Locale => (isLocale(locale) ? locale : 'fa');

async function throttle(form: string, locale: Locale) {
  if (tooManyAttempts(`${form}:${await clientIp()}`, LIMIT, WINDOW)) {
    throw new FormError(SITE_MESSAGES[locale].tooMany);
  }
}

async function activeService(serviceId: number, locale: Locale) {
  const service = await db.service.findFirst({ where: { id: serviceId, isActive: true }, select: { id: true, shortTitle: true, serviceCategoryId: true } });
  if (!service) throw new FormError(SITE_MESSAGES[locale].inactiveService);
  return service;
}

/** Returns the request number, which the visitor can quote when they call. */
export async function submitServiceRequest(input: ServiceRequestSubmitInput, language?: Locale): Promise<ActionResult<{ reference: number }>> {
  const locale = languageOf(language);
  return publicAction(
    serviceRequestSubmitSchema(locale),
    input,
    async (data) => {
      await throttle('service-request', locale);
      const service = await activeService(data.serviceId, locale);
      const request = await db.serviceRequest.create({
        data: { serviceId: service.id, name: data.name, phone: data.phone, description: data.description },
      });
      return { ok: true, data: { reference: Number(request.id) } };
    },
    SITE_MESSAGES[locale] as { invalid: string; failed: string },
  );
}

export async function submitConsultationRequest(input: ConsultationSubmitInput, language?: Locale): Promise<ActionResult<{ reference: number }>> {
  const locale = languageOf(language);
  return publicAction(
    consultationSubmitSchema(locale),
    input,
    async (data) => {
      await throttle('consultation', locale);
      const service = data.serviceId ? await activeService(data.serviceId, locale) : null;
      const request = await db.consultationRequest.create({
        data: { serviceId: service?.id ?? null, callTime: data.callTime, name: data.name, phone: data.phone, description: data.description },
      });
      return { ok: true, data: { reference: Number(request.id) } };
    },
    SITE_MESSAGES[locale] as { invalid: string; failed: string },
  );
}

export async function submitContactMessage(input: ContactMessageSubmitInput, language?: Locale): Promise<ActionResult<{ reference: number }>> {
  const locale = languageOf(language);
  return publicAction(
    contactMessageSubmitSchema(locale),
    input,
    async (data) => {
      await throttle('contact', locale);
      const message = await db.contactMessage.create({ data });
      return { ok: true, data: { reference: Number(message.id) } };
    },
    SITE_MESSAGES[locale] as { invalid: string; failed: string },
  );
}

const OTHER_SERVICES: Translated = { fa: 'سایر خدمات', en: 'Other services', tr: 'Diğer hizmetler' };
const CASE_CODE: Record<Locale, string> = { fa: 'کد پرونده', en: 'Case code', tr: 'Dosya kodu' };

// The year as each language's site writes it: Persian calendar on the Persian site
const yearNow = (): Translated =>
  Object.fromEntries(
    LOCALES.map((locale) => [locale, new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', { year: 'numeric' }).format(new Date())]),
  );

/** The review is stored in the language it was written in; the panel can add the others before publishing it. */
export async function submitTestimonial(input: TestimonialSubmitInput, language?: Locale): Promise<ActionResult> {
  const locale = languageOf(language);
  return publicAction(
    testimonialSubmitSchema(locale),
    input,
    async (data) => {
      await throttle('testimonial', locale);
      const service = data.serviceId ? await activeService(data.serviceId, locale) : null;
      await db.testimonial.create({
        data: {
          clientName: { [locale]: data.name },
          serviceTitle: service?.shortTitle ?? OTHER_SERVICES,
          serviceCategoryId: service?.serviceCategoryId ?? null,
          trackingCode: data.trackingCode,
          context: data.trackingCode ? Object.fromEntries(LOCALES.map((code) => [code, `${CASE_CODE[code]}: ${data.trackingCode}`])) : {},
          comment: { [locale]: data.comment },
          rating: data.rating,
          year: yearNow(),
          categoryLabel: {},
          verifiedCode: {},
          outcomeHeadline: {},
          originDestination: {},
          source: 'visitor',
          isPublished: false,
        },
      });
    },
    SITE_MESSAGES[locale] as { invalid: string; failed: string },
  );
}
