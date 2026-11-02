'use server';

/**
 * What the public forms submit. Each one validates on the server (the browser checks are only a
 * convenience), is throttled per visitor, and lands in the table the admin panel reads.
 */

import { db } from '../../lib/db';
import { ActionResult, FormError, publicAction } from '../../lib/actions';
import { clientIp, tooManyAttempts } from '../../lib/rateLimit';
import { serviceRequestSubmitSchema, ServiceRequestSubmitInput } from '../serviceRequests/schema';
import { consultationSubmitSchema, ConsultationSubmitInput } from '../consultations/schema';
import { contactMessageSubmitSchema, ContactMessageSubmitInput } from '../contactMessages/schema';
import { testimonialSubmitSchema, TestimonialSubmitInput } from '../testimonials/schema';

const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;

async function throttle(form: string) {
  if (tooManyAttempts(`${form}:${await clientIp()}`, LIMIT, WINDOW)) {
    throw new FormError('تعداد درخواست‌های شما زیاد بوده است. چند دقیقه دیگر دوباره تلاش کنید.');
  }
}

async function activeService(serviceId: number) {
  const service = await db.service.findFirst({ where: { id: serviceId, isActive: true }, select: { id: true, shortTitle: true, serviceCategoryId: true } });
  if (!service) throw new FormError('این خدمت در حال حاضر فعال نیست.');
  return service;
}

/** Returns the request number, which the visitor can quote when they call. */
export async function submitServiceRequest(input: ServiceRequestSubmitInput): Promise<ActionResult<{ reference: number }>> {
  return publicAction(serviceRequestSubmitSchema, input, async (data) => {
    await throttle('service-request');
    const service = await activeService(data.serviceId);
    const request = await db.serviceRequest.create({
      data: { serviceId: service.id, name: data.name, phone: data.phone, description: data.description },
    });
    return { ok: true, data: { reference: Number(request.id) } };
  });
}

export async function submitConsultationRequest(input: ConsultationSubmitInput): Promise<ActionResult<{ reference: number }>> {
  return publicAction(consultationSubmitSchema, input, async (data) => {
    await throttle('consultation');
    const service = data.serviceId ? await activeService(data.serviceId) : null;
    const request = await db.consultationRequest.create({
      data: { serviceId: service?.id ?? null, callTime: data.callTime, name: data.name, phone: data.phone, description: data.description },
    });
    return { ok: true, data: { reference: Number(request.id) } };
  });
}

export async function submitContactMessage(input: ContactMessageSubmitInput): Promise<ActionResult<{ reference: number }>> {
  return publicAction(contactMessageSubmitSchema, input, async (data) => {
    await throttle('contact');
    const message = await db.contactMessage.create({ data });
    return { ok: true, data: { reference: Number(message.id) } };
  });
}

export async function submitTestimonial(input: TestimonialSubmitInput): Promise<ActionResult> {
  return publicAction(testimonialSubmitSchema, input, async (data) => {
    await throttle('testimonial');
    const service = data.serviceId ? await activeService(data.serviceId) : null;
    await db.testimonial.create({
      data: {
        clientName: data.name,
        serviceTitle: service?.shortTitle ?? 'سایر خدمات',
        serviceCategoryId: service?.serviceCategoryId ?? null,
        trackingCode: data.trackingCode,
        context: data.trackingCode ? `کد پرونده: ${data.trackingCode}` : null,
        comment: data.comment,
        rating: data.rating,
        year: new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date()),
        source: 'visitor',
        isPublished: false,
      },
    });
  });
}
