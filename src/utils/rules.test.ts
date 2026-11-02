import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDigits, validateFullName, validatePhoneNumber, validateMessage } from './validation';
import { calculateCurrencyConversion, rateTable } from './currency';
import { serviceRequestSubmitSchema } from '../modules/serviceRequests/schema';
import { consultationSubmitSchema } from '../modules/consultations/schema';
import { adminPhone, fieldErrors } from '../lib/validation';
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
  const rates = rateTable([{ code: 'TRY', nameFa: 'لیر ترکیه', symbol: '₺', rateToToman: 2600, flag: '' }]);
  const result = calculateCurrencyConversion(26000000, 'TOMAN', 'TRY', rates);
  assert.notEqual(result, null);
  if (result) {
    assert.equal(result.estimatedAmount, 10000);
    assert.equal(result.feePercentage, 1);
    assert.equal(result.feeAmount, 100);
    assert.equal(result.finalReceiveAmount, 9900);
  }

  // Invalid currency returns null
  assert.equal(calculateCurrencyConversion(100, 'ABC', 'XYZ', rates), null);

  // The fee comes from the admin panel
  assert.equal(calculateCurrencyConversion(26000000, 'TOMAN', 'TRY', rates, 2)?.finalReceiveAmount, 9800);
});

test('a service request is the same three fields for every service, stored with Latin digits', () => {
  const parsed = serviceRequestSubmitSchema.safeParse({ serviceId: '3', name: ' علی احمدی ', phone: '۰۹۱۲ ۳۴۵ ۶۷۸۹', description: '   ' });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.deepEqual(parsed.data, { serviceId: 3, name: 'علی احمدی', phone: '09123456789', description: null });
  }

  const invalid = serviceRequestSubmitSchema.safeParse({ serviceId: 0, name: 'ع', phone: '123', description: '' });
  assert.equal(invalid.success, false);
  if (!invalid.success) {
    assert.deepEqual(Object.keys(fieldErrors(invalid.error)).sort(), ['name', 'phone', 'serviceId']);
  }
});

test('a consultation without a service is general guidance, and needs a known call time', () => {
  const general = consultationSubmitSchema.safeParse({ serviceId: '', callTime: 'asap', name: 'سارا رضایی', phone: '+905321234567' });
  assert.equal(general.success, true);
  if (general.success) assert.equal(general.data.serviceId, null);

  assert.equal(consultationSubmitSchema.safeParse({ serviceId: null, callTime: 'midnight', name: 'سارا رضایی', phone: '+905321234567' }).success, false);
});

test('admin logins are Iranian mobile numbers, whatever digits they were typed in', () => {
  assert.equal(adminPhone.parse('۰۹۱۲۰۰۰۰۰۰۰'), '09120000000');
  assert.equal(adminPhone.safeParse('9120000000').success, false);
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
