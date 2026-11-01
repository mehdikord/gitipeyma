/**
 * Utility functions for form input normalization and validation.
 * Supports Persian, Arabic, and Western digits, Iranian & Turkish phone numbers.
 */

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

/**
 * Validates a full name (minimum 2 characters, not purely numeric or punctuation).
 */
export function validateFullName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name?.trim() || '';
  if (!trimmed) {
    return { isValid: false, error: 'لطفاً نام و نام خانوادگی خود را وارد نمایید.' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.' };
  }
  // Check that it contains valid letters (Persian, English, spaces)
  const validNameRegex = /^[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\sA-Za-z.'-]+$/;
  if (!validNameRegex.test(trimmed)) {
    return { isValid: false, error: 'لطفاً نام معتبر وارد کنید (شامل حروف و فاصله).' };
  }
  return { isValid: true };
}

/**
 * Validates a mobile phone number (supports Iranian 09xx, Turkish +90 / 05xx, and generic international format).
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; normalized: string; error?: string } {
  const normalized = normalizeDigits(phone).replace(/[\s-]/g, '');

  if (!normalized) {
    return { isValid: false, normalized: '', error: 'لطفاً شماره تماس خود را وارد نمایید.' };
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

  return {
    isValid: false,
    normalized,
    error: 'شماره تماس وارد شده معتبر نیست. لطفاً شماره موبایل خود را به درستی وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۵xxxxxxxxx).',
  };
}

/**
 * Validates a message / inquiry text.
 */
export function validateMessage(message: string, isRequired = false): { isValid: boolean; error?: string } {
  const trimmed = message?.trim() || '';
  if (isRequired && !trimmed) {
    return { isValid: false, error: 'لطفاً متن پیام خود را بنویسید.' };
  }
  if (isRequired && trimmed.length < 10) {
    return { isValid: false, error: 'متن پیام باید حداقل ۱۰ کاراکتر باشد.' };
  }
  return { isValid: true };
}
