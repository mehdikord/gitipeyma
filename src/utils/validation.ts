/**
 * Utility functions for form input normalization and validation.
 * Supports Persian, Arabic, and Western digits, Iranian & Turkish phone numbers.
 * Messages come in the visitor's language; Persian when none is given.
 */

import type { Locale } from '../i18n/config';

/**
 * Normalizes Persian and Arabic numerals to standard Western ASCII digits.
 */
export function normalizeDigits(input: string): string {
  if (!input) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let result = input;
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(persianDigits[i], String(i));
    result = result.replaceAll(arabicDigits[i], String(i));
  }
  return result.trim();
}

// What the public forms say about a wrong value, in each of the site's languages.
const MESSAGES: Record<Locale, Record<'nameMissing' | 'nameShort' | 'nameInvalid' | 'phoneMissing' | 'phoneInvalid' | 'messageMissing' | 'messageShort', string>> = {
  fa: {
    nameMissing: 'لطفاً نام و نام خانوادگی خود را وارد نمایید.',
    nameShort: 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.',
    nameInvalid: 'لطفاً نام معتبر وارد کنید (شامل حروف و فاصله).',
    phoneMissing: 'لطفاً شماره تماس خود را وارد نمایید.',
    phoneInvalid: 'شماره تماس وارد شده معتبر نیست. لطفاً شماره موبایل خود را به درستی وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۵xxxxxxxxx).',
    messageMissing: 'لطفاً متن پیام خود را بنویسید.',
    messageShort: 'متن پیام باید حداقل ۱۰ کاراکتر باشد.',
  },
  en: {
    nameMissing: 'Please enter your full name.',
    nameShort: 'Your full name must be at least 3 characters.',
    nameInvalid: 'Please enter a valid name (letters and spaces only).',
    phoneMissing: 'Please enter your phone number.',
    phoneInvalid: 'This phone number is not valid. Please enter your mobile number with its country code (e.g. +90 532 123 45 67).',
    messageMissing: 'Please write your message.',
    messageShort: 'Your message must be at least 10 characters.',
  },
  tr: {
    nameMissing: 'Lütfen adınızı ve soyadınızı girin.',
    nameShort: 'Ad soyad en az 3 karakter olmalıdır.',
    nameInvalid: 'Lütfen geçerli bir ad girin (yalnızca harf ve boşluk).',
    phoneMissing: 'Lütfen telefon numaranızı girin.',
    phoneInvalid: 'Girilen telefon numarası geçerli değil. Lütfen cep telefonu numaranızı doğru girin (örnek: 0532 123 45 67).',
    messageMissing: 'Lütfen mesajınızı yazın.',
    messageShort: 'Mesajınız en az 10 karakter olmalıdır.',
  },
};

/**
 * Validates a full name (minimum 3 characters, letters of any script, not digits or punctuation).
 */
export function validateFullName(name: string, locale: Locale = 'fa'): { isValid: boolean; error?: string } {
  const trimmed = name?.trim() || '';
  if (!trimmed) {
    return { isValid: false, error: MESSAGES[locale].nameMissing };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: MESSAGES[locale].nameShort };
  }
  // Letters in any script (Persian, Latin, Turkish ç ğ ı ş ...), spaces, the zero-width non-joiner and . ' -
  const validNameRegex = /^[\p{L}\p{M}\s‌.'-]+$/u;
  if (!validNameRegex.test(trimmed)) {
    return { isValid: false, error: MESSAGES[locale].nameInvalid };
  }
  return { isValid: true };
}

/**
 * Validates a mobile phone number (supports Iranian 09xx, Turkish +90 / 05xx, and generic international format).
 */
export function validatePhoneNumber(phone: string, locale: Locale = 'fa'): { isValid: boolean; normalized: string; error?: string } {
  const normalized = normalizeDigits(phone).replace(/[\s()-]/g, '');

  if (!normalized) {
    return { isValid: false, normalized: '', error: MESSAGES[locale].phoneMissing };
  }

  // Iranian mobile patterns: 0912..., +98912..., 0098912..., 912...
  const iranRegex = /^(?:\+98|0098|0)?9\d{9}$/;

  // Turkish mobile patterns: +905..., 05..., 5...
  const turkeyRegex = /^(?:\+90|0090|0)?5\d{9}$/;

  // Generic international with country code: +[1-9]\d{6,14}
  const genericIntlRegex = /^\+?[1-9]\d{7,14}$/;

  if (iranRegex.test(normalized) || turkeyRegex.test(normalized) || genericIntlRegex.test(normalized)) {
    return { isValid: true, normalized };
  }

  return { isValid: false, normalized, error: MESSAGES[locale].phoneInvalid };
}

/**
 * Validates a message / inquiry text.
 */
export function validateMessage(message: string, isRequired = false, locale: Locale = 'fa'): { isValid: boolean; error?: string } {
  const trimmed = message?.trim() || '';
  if (isRequired && !trimmed) {
    return { isValid: false, error: MESSAGES[locale].messageMissing };
  }
  if (isRequired && trimmed.length < 10) {
    return { isValid: false, error: MESSAGES[locale].messageShort };
  }
  return { isValid: true };
}
