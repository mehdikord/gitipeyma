/**
 * Turns a filled service request into the message the company receives.
 * The site has no backend yet, so WhatsApp is the channel that actually delivers it.
 */

export const REQUEST_WHATSAPP_NUMBER = '905367008090';

export interface ServiceRequest {
  serviceTitle: string;
  answers: { label: string; value: string }[];
  fullName: string;
  phone: string;
  details: string;
}

export function buildRequestMessage({ serviceTitle, answers, fullName, phone, details }: ServiceRequest): string {
  const trimmedDetails = details.trim();
  return [
    `سلام، درخواست «${serviceTitle}» را دارم.`,
    ...answers.map(({ label, value }) => `${label}: ${value}`),
    `نام: ${fullName.trim()}`,
    `شماره تماس: ${phone.trim()}`,
    ...(trimmedDetails ? [`توضیحات: ${trimmedDetails}`] : []),
  ].join('\n');
}

export function requestWhatsAppUrl(request: ServiceRequest): string {
  return `https://wa.me/${REQUEST_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildRequestMessage(request))}`;
}
