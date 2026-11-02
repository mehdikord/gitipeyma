/**
 * Currency conversion and estimation logic for international transfers (Rial, TRY, USD, EUR, AED).
 */

import type { CurrencyRate } from '../types';

export type { CurrencyRate };

// Rates keyed by currency code, as the calculator looks them up.
export type RateTable = Record<string, CurrencyRate>;

export const rateTable = (rates: CurrencyRate[]): RateTable => Object.fromEntries(rates.map((rate) => [rate.code, rate]));

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
  to: string,
  rates: RateTable,
  feePercent = 1
): ConversionResult | null {
  if (amount <= 0) return null;

  let estimated = 0;
  let rate = 1;

  if (from === 'TOMAN' && to in rates) {
    rate = rates[to].rateToToman;
    estimated = amount / rate;
  } else if (from in rates && to === 'TOMAN') {
    rate = rates[from].rateToToman;
    estimated = amount * rate;
  } else if (from in rates && to in rates) {
    const fromRate = rates[from].rateToToman;
    const toRate = rates[to].rateToToman;
    rate = fromRate / toRate;
    estimated = amount * rate;
  } else {
    return null;
  }

  // The SWIFT / handling fee, set in the admin panel (1% by default)
  const feeAmount = estimated * (feePercent / 100);
  const finalReceiveAmount = estimated - feeAmount;

  return {
    fromAmount: amount,
    fromCurrency: from,
    toCurrency: to,
    estimatedAmount: Math.round(estimated * 100) / 100,
    rateUsed: Math.round(rate * 100) / 100,
    feePercentage: feePercent,
    feeAmount: Math.round(feeAmount * 100) / 100,
    finalReceiveAmount: Math.round(finalReceiveAmount * 100) / 100,
  };
}
