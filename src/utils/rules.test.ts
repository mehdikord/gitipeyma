import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDigits, validateFullName, validatePhoneNumber, validateMessage } from './validation';
import { calculateCurrencyConversion } from './currency';
import { buildRequestMessage, requestWhatsAppUrl } from './serviceRequest';
import { Office, officeStatus, telHref } from './contact';

test('normalizeDigits converts Persian and Arabic digits to ASCII digits', () => {
  assert.equal(normalizeDigits('۰۹۱۲۳۴۵۶۷۸۹'), '09123456789');
  assert.equal(normalizeDigits('٠١٢٣٤٥٦٧٨٩'), '0123456789');
  assert.equal(normalizeDigits(' ۰۹۱۲-۳۴۵-۶۷۸۹ '), '0912-345-6789');
});

test('validateFullName handles valid and invalid names', () => {
  assert.equal(validateFullName('علی رضایی').isValid, true);
  assert.equal(validateFullName('Reza Ahmadi').isValid, true);
  assert.equal(validateFullName('س').isValid, false);
  assert.equal(validateFullName('').isValid, false);
  assert.equal(validateFullName('123456').isValid, false);
});

test('validatePhoneNumber validates Iranian, Turkish, and international formats', () => {
  // Iranian
  assert.equal(validatePhoneNumber('09123456789').isValid, true);
  assert.equal(validatePhoneNumber('۰۹۱۲۳۴۵۶۷۸۹').isValid, true);
  assert.equal(validatePhoneNumber('+989123456789').isValid, true);

  // Turkish
  assert.equal(validatePhoneNumber('+905321234567').isValid, true);
  assert.equal(validatePhoneNumber('05321234567').isValid, true);

  // Invalid
  assert.equal(validatePhoneNumber('12345').isValid, false);
  assert.equal(validatePhoneNumber('').isValid, false);
});

test('validateMessage respects isRequired flag', () => {
  assert.equal(validateMessage('', false).isValid, true);
  assert.equal(validateMessage('', true).isValid, false);
  assert.equal(validateMessage('درخواست اطلاعات', true).isValid, true);
  assert.equal(validateMessage('سلام', true).isValid, false); // too short
});

test('calculateCurrencyConversion calculates accurate transfer estimates', () => {
  // Convert 26,000,000 Tomans to TRY (rate 2600)
  const result = calculateCurrencyConversion(26000000, 'TOMAN', 'TRY');
  assert.notEqual(result, null);
  if (result) {
    assert.equal(result.estimatedAmount, 10000);
    assert.equal(result.feePercentage, 1);
    assert.equal(result.feeAmount, 100);
    assert.equal(result.finalReceiveAmount, 9900);
  }

  // Invalid currency returns null
  assert.equal(calculateCurrencyConversion(100, 'ABC', 'XYZ'), null);
});

test('service requests carry everything the expert needs, and skip what was left empty', () => {
  const request = {
    serviceTitle: 'ارسال بار',
    answers: [{ label: 'مسیر ارسال', value: 'ایران به ترکیه' }],
    fullName: ' علی احمدی ',
    phone: '09123456789',
    details: '   ',
  };
  assert.equal(
    buildRequestMessage(request),
    'سلام، درخواست «ارسال بار» را دارم.\nمسیر ارسال: ایران به ترکیه\nنام: علی احمدی\nشماره تماس: 09123456789',
  );
  assert.ok(buildRequestMessage({ ...request, details: 'وزن ۵ کیلو' }).endsWith('توضیحات: وزن ۵ کیلو'));

  const url = new URL(requestWhatsAppUrl(request));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.searchParams.get('text'), buildRequestMessage(request));
});

test('consultation and contact messages can open with their own line', () => {
  const message = buildRequestMessage({ intro: 'سلام، درخواست مشاوره دارم.', answers: [{ label: 'موضوع', value: 'ثبت شرکت' }], fullName: 'علی', phone: '0912', details: '' });
  assert.equal(message, 'سلام، درخواست مشاوره دارم.\nموضوع: ثبت شرکت\nنام: علی\nشماره تماس: 0912');
  // The expert has to be able to tap the number, however it was typed
  assert.ok(buildRequestMessage({ intro: 'سلام', answers: [], fullName: 'علی', phone: ' ۰۹۱۲ ', details: '' }).endsWith('شماره تماس: 0912'));
});

test('telHref dials Latin digits from any written form', () => {
  assert.equal(telHref('۰۲۱-۴۴۶۶۸۰۸۰'), 'tel:02144668080');
  assert.equal(telHref('+90 (212) 588 40 40'), 'tel:+902125884040');
});

test('officeStatus follows each office\'s local hours and closed days', () => {
  const istanbul = { schedule: { timeZone: 'Europe/Istanbul', openHour: 8, closeHour: 22, closedWeekdays: [1] } } as Office;
  assert.equal(officeStatus(istanbul, new Date('2026-11-04T09:00:00Z')).isOpen, true); // Wednesday 12:00
  assert.equal(officeStatus(istanbul, new Date('2026-11-02T09:00:00Z')).isOpen, false); // Monday, closed
  assert.equal(officeStatus(istanbul, new Date('2026-11-01T20:00:00Z')).text, 'در روز کاری بعدی باز می‌شود'); // Sunday night, Monday closed
  assert.equal(officeStatus(istanbul, new Date('2026-11-03T03:00:00Z')).text, 'ساعت ۰۸:۰۰ باز می‌شود'); // Tuesday 06:00
});
