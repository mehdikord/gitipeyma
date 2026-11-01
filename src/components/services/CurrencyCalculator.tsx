'use client';

import React, { useState, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, calculateCurrencyConversion, ConversionResult } from '../../utils/currency';
import { ArrowLeftRight, Calculator, CheckCircle2, Info } from 'lucide-react';
import { normalizeDigits } from '../../utils/validation';

export const CurrencyCalculator: React.FC = () => {
  const [amountStr, setAmountStr] = useState<string>('50000000');
  const [fromCurrency, setFromCurrency] = useState<string>('TOMAN');
  const [toCurrency, setToCurrency] = useState<string>('TRY');
  // Numbers use a fixed locale until hydration, then the visitor's browser locale
  const [locale, setLocale] = useState<string | undefined>('en-US');

  useEffect(() => {
    setLocale(undefined);
  }, []);

  const rawNum = parseFloat(normalizeDigits(amountStr).replace(/,/g, '')) || 0;
  const result: ConversionResult | null = calculateCurrencyConversion(rawNum, fromCurrency, toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-[#0C252B] text-[#F7F7F3]">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-[#E2C98C]" />
        <h3 className="text-lg font-bold text-[#F7F7F3]">
          محاسبه‌گر آنلاین حواله و برآورد تبدیل ارز
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* From Amount */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs text-[#A2B6BC] font-medium block">
            مبلغ پرداختی:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-white text-base focus:outline-none focus:border-[#E2C98C]"
              placeholder="مثال: ۵۰,۰۰۰,۰۰۰"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-[#E2C98C] text-xs font-bold focus:outline-none"
            >
              <option value="TOMAN">تومان (ایران)</option>
              {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.nameFa} ({c.code})
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
            className="w-10 h-10 rounded-full bg-[#07191F] border border-[#12B8B0]/40 text-[#12B8B0] hover:bg-[#12B8B0] hover:text-[#07191F] transition-all flex items-center justify-center shadow-md"
            aria-label="تعویض ارز مبدا و مقصد"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs text-[#A2B6BC] font-medium block">
            ارز دریافتی در مقصد:
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-[#E2C98C] text-sm font-bold focus:outline-none focus:border-[#E2C98C]"
          >
            <option value="TOMAN">تومان (ایران)</option>
            {Object.values(SUPPORTED_CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.nameFa} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversion Result Card */}
      {result ? (
        <div className="mt-6 p-4 rounded-xl bg-[#07191F] border border-[#C6A15B]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#A2B6BC] block mb-1">
              مبلغ برآوردی دریافتی در مقصد (پس از کسر کارمزد استاندارد ۱٪):
            </span>
            <div className="text-2xl font-black text-[#E2C98C]">
              {result.finalReceiveAmount.toLocaleString(locale)}{' '}
              <span className="text-sm text-[#3ED0C8]">
                {toCurrency === 'TOMAN' ? 'تومان' : SUPPORTED_CURRENCIES[toCurrency]?.nameFa}
              </span>
            </div>
            <span className="text-xs text-[#A2B6BC] mt-1 block">
              نرخ مبنای محاسبه: هر واحد معادل {result.rateUsed.toLocaleString(locale)} تومان
            </span>
          </div>

          <div className="text-right sm:text-left text-xs text-[#A2B6BC]">
            <div>کارمزد ترانزیت مالی: ۱٪</div>
            <div className="text-[#12B8B0] font-semibold mt-0.5">تحویل نقدی در استانبول یا واریز فوری</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-lg bg-red-950/30 border border-red-500/20 text-xs text-red-300">
          لطفاً دو ارز متفاوت برای تبدیل انتخاب کنید.
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-[#A2B6BC]">
        <Info className="w-3.5 h-3.5 text-[#12B8B0] shrink-0" />
        <span>
          * نرخ‌های فوق تخمینی هستند. جهت دریافت نرخ دقیق و تسویه قطعی در ساعات معاملاتی، با واحد ارزی گیتی پیما تماس حاصل فرمایید.
        </span>
      </div>
    </div>
  );
};
