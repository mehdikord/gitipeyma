'use client';

import React, { useState } from 'react';
import { CurrencyRate, calculateCurrencyConversion, ConversionResult, rateTable } from '../../utils/currency';
import { ArrowLeftRight, Calculator, CheckCircle2, Info } from 'lucide-react';
import { normalizeDigits } from '../../utils/validation';
import { useI18n } from '../../i18n/I18nProvider';

export const CurrencyCalculator: React.FC<{ rates: CurrencyRate[]; feePercent: number }> = ({ rates, feePercent }) => {
  const SUPPORTED_CURRENCIES = rateTable(rates);
  const { t: { services: { calculator: t } }, num, fill, locale } = useI18n();
  // "۱٪" on the Persian site, "1%" and "%1" in English and Turkish
  const feeText = locale === 'fa' ? `${num(feePercent)}٪` : num(feePercent / 100, { style: 'percent', maximumFractionDigits: 2 });
  const [amountStr, setAmountStr] = useState<string>('50000000');
  const [fromCurrency, setFromCurrency] = useState<string>('TOMAN');
  const [toCurrency, setToCurrency] = useState<string>(rates[0]?.code ?? 'TOMAN');
  // Turkish writes thousands with dots (50.000.000) and decimals with a comma; the others the other way round
  const typed = normalizeDigits(amountStr).replace(/[٬\s]/g, '');
  const rawNum = parseFloat(locale === 'tr' ? typed.replace(/\./g, '').replace(',', '.') : typed.replace(/,/g, '')) || 0;
  const result: ConversionResult | null = calculateCurrencyConversion(rawNum, fromCurrency, toCurrency, SUPPORTED_CURRENCIES, feePercent);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-surface text-ink">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-bold text-ink">
          {t.title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* From Amount */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs text-ink-muted font-medium block">
            {t.amount}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-brand/30 text-ink-strong text-base focus:outline-none focus:border-gold-line"
              placeholder={t.amountPlaceholder}
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-canvas border border-brand/30 text-gold text-xs font-bold focus:outline-none"
            >
              <option value="TOMAN">{t.tomanOption}</option>
              {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div className="md:col-span-2 flex justify-center pt-4 md:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            className="w-10 h-10 rounded-full bg-canvas border border-brand/40 text-brand hover:bg-brand-fill hover:text-on-accent transition-all flex items-center justify-center shadow-md"
            aria-label={t.swap}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs text-ink-muted font-medium block">
            {t.receive}
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-brand/30 text-gold text-sm font-bold focus:outline-none focus:border-gold-line"
          >
            <option value="TOMAN">{t.tomanOption}</option>
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversion Result Card */}
      {result ? (
        <div className="mt-6 p-4 rounded-xl bg-canvas border border-gold-deep-line/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-ink-muted block mb-1">
              {fill(t.estimate, { fee: feeText })}
            </span>
            <div className="text-2xl font-black text-gold">
              {num(result.finalReceiveAmount)}{' '}
              <span className="text-sm text-brand-bright">
                {toCurrency === 'TOMAN' ? t.toman : SUPPORTED_CURRENCIES[toCurrency]?.name}
              </span>
            </div>
            <span className="text-xs text-ink-muted mt-1 block">
              {fill(t.baseRate, { rate: num(result.rateUsed) })}
            </span>
          </div>

          <div className="text-start sm:text-end text-xs text-ink-muted">
            <div>{fill(t.fee, { fee: feeText })}</div>
            <div className="text-brand font-semibold mt-0.5">{t.delivery}</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-lg bg-red-950/30 border border-red-500/20 text-xs text-red-300">
          {t.sameCurrency}
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted">
        <Info className="w-3.5 h-3.5 text-brand shrink-0" />
        <span>
          {t.disclaimer}
        </span>
      </div>
    </div>
  );
};
