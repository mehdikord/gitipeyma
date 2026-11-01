/**
 * Currency conversion and estimation logic for international transfers (Rial, TRY, USD, EUR, AED).
 */

export interface CurrencyRate {
  code: string;
  nameFa: string;
  symbol: string;
  rateToToman: number; // in Iranian Toman
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyRate> = {
  TRY: {
    code: 'TRY',
    nameFa: 'لیر ترکیه',
    symbol: '₺',
    rateToToman: 2600,
    flag: '🇹🇷',
  },
  USD: {
    code: 'USD',
    nameFa: 'دلار آمریکا',
    symbol: '$',
    rateToToman: 92000,
    flag: '🇺🇸',
  },
  EUR: {
    code: 'EUR',
    nameFa: 'یورو اروپا',
    symbol: '€',
    rateToToman: 99000,
    flag: '🇪🇺',
  },
  AED: {
    code: 'AED',
    nameFa: 'درهم امارات',
    symbol: 'د.إ',
    rateToToman: 25000,
    flag: '🇦🇪',
  },
};

export interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string;
  estimatedAmount: number;
  rateUsed: number;
  feePercentage: number;
  feeAmount: number;
  finalReceiveAmount: number;
}

/**
 * Calculates estimated currency transfer between IRR (Toman) and target foreign currencies or vice-versa.
 */
export function calculateCurrencyConversion(
  amount: number,
  from: string,
  to: string
): ConversionResult | null {
  if (amount <= 0) return null;

  let estimated = 0;
  let rate = 1;

  if (from === 'TOMAN' && to in SUPPORTED_CURRENCIES) {
    rate = SUPPORTED_CURRENCIES[to].rateToToman;
    estimated = amount / rate;
  } else if (from in SUPPORTED_CURRENCIES && to === 'TOMAN') {
    rate = SUPPORTED_CURRENCIES[from].rateToToman;
    estimated = amount * rate;
  } else if (from in SUPPORTED_CURRENCIES && to in SUPPORTED_CURRENCIES) {
    const fromRate = SUPPORTED_CURRENCIES[from].rateToToman;
    const toRate = SUPPORTED_CURRENCIES[to].rateToToman;
    rate = fromRate / toRate;
    estimated = amount * rate;
  } else {
    return null;
  }

  // 1% standard SWIFT / handling fee for calculations
  const feePercentage = 0.01;
  const feeAmount = estimated * feePercentage;
  const finalReceiveAmount = estimated - feeAmount;

  return {
    fromAmount: amount,
    fromCurrency: from,
    toCurrency: to,
    estimatedAmount: Math.round(estimated * 100) / 100,
    rateUsed: Math.round(rate * 100) / 100,
    feePercentage: 1.0,
    feeAmount: Math.round(feeAmount * 100) / 100,
    finalReceiveAmount: Math.round(finalReceiveAmount * 100) / 100,
  };
}
