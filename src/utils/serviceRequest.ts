/**
 * Turns a filled service request into the message the company receives.
 * The site has no backend yet, so WhatsApp is the channel that actually delivers it.
 */

import { normalizeDigits } from './validation';

export const REQUEST_WHATSAPP_NUMBER = '905367008090';

export interface ServiceRequest {
  serviceTitle?: string;
  // Replaces the opening line, for requests that aren't about one service.
  intro?: string;
  answers: { label: string; value: string }[];
  fullName: string;
  phone: string;
  details: string;
}

export function buildRequestMessage({ serviceTitle, intro, answers, fullName, phone, details }: ServiceRequest): string {
  const trimmedDetails = details.trim();
  return [
    intro ?? `سلام، درخواست «${serviceTitle}» را دارم.`,
    ...answers.map(({ label, value }) => `${label}: ${value}`),
    `نام: ${fullName.trim()}`,
    `شماره تماس: ${normalizeDigits(phone)}`,
    ...(trimmedDetails ? [`توضیحات: ${trimmedDetails}`] : []),
  ].join('\n');
}

export function requestWhatsAppUrl(request: ServiceRequest): string {
  return `https://wa.me/${REQUEST_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildRequestMessage(request))}`;
}
