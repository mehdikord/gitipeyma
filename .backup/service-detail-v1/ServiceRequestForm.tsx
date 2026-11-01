'use client';

import React, { useState } from 'react';
import { validateFullName, validatePhoneNumber, validateMessage } from '../../utils/validation';
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

interface ServiceRequestFormProps {
  serviceTitle: string;
  serviceSlug: string;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceTitle, serviceSlug }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; details?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidation = validateFullName(fullName);
    const phoneValidation = validatePhoneNumber(phone);
    const detailsValidation = validateMessage(details, false);

    const newErrors: { fullName?: string; phone?: string; details?: string } = {};

    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.error;
    }
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }
    if (!detailsValidation.isValid) {
      newErrors.details = detailsValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate clean realistic processing for demonstration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setDetails('');
    setIsSuccess(false);
  };

  return (
    <div className="rounded-3xl p-6 sm:p-10 bg-[#0C252B] border border-[#12B8B0]/30 shadow-2xl text-[#F7F7F3] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#12B8B0]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-mono font-bold text-[#12B8B0] tracking-wider uppercase">
            DIRECT INQUIRY & SERVICE BOOKING
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">
            درخواست استفاده از این خدمت
          </h3>
          <p className="text-xs sm:text-sm text-[#A2B6BC]">
            برای دریافت مشاوره تخصصی و پیگیری مستقیم در خصوص «{serviceTitle}»، اطلاعات تماس خود را ثبت نمایید.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-2xl bg-[#07191F] border border-[#12B8B0] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#12B8B0]/20 text-[#12B8B0] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#E2C98C]">
              درخواست شما با موفقیت ثبت شد
            </h4>
            <p className="text-sm text-[#A2B6BC] leading-relaxed max-w-md mx-auto">
              کارشناس بخش «{serviceTitle}» ظرف حداکثر ۲ ساعت کاری جهت بررسی جزئیات پرونده با شماره اعلامی شما تماس خواهد گرفت.
            </p>
            <div className="p-3 rounded-lg bg-[#0C252B] border border-white/10 text-[11px] text-[#718085]">
              (نسخه نمایشی وب‌سایت: درخواست در حافظه محلی مرورگر شما پردازش گردید.)
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#12B8B0] text-[#07191F] font-bold text-xs hover:bg-[#087F7B] transition-colors"
            >
              ثبت درخواست دیگر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            {/* Auto Selected Service Indicator */}
            <div className="p-3 rounded-xl bg-[#07191F] border border-[#12B8B0]/20 flex items-center justify-between">
              <span className="text-xs text-[#A2B6BC]">خدمت انتخابی:</span>
              <span className="text-xs font-bold text-[#E2C98C]">{serviceTitle}</span>
            </div>

            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="service-fullname" className="text-xs font-semibold text-[#F7F7F3] block">
                نام و نام خانوادگی <span className="text-red-400">*</span>
              </label>
              <input
                id="service-fullname"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#07191F] border ${
                  errors.fullName ? 'border-red-400' : 'border-[#12B8B0]/30'
                } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] transition-colors`}
                placeholder="مثال: علی احمدی"
              />
              {errors.fullName && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label htmlFor="service-phone" className="text-xs font-semibold text-[#F7F7F3] block">
                شماره موبایل یا واتس‌اپ <span className="text-red-400">*</span>
              </label>
              <input
                id="service-phone"
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#07191F] border ${
                  errors.phone ? 'border-red-400' : 'border-[#12B8B0]/30'
                } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] transition-colors`}
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا ۰۵۳۶xxxxxxx"
                dir="ltr"
              />
              {errors.phone && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Details / Description Field */}
            <div className="space-y-1.5">
              <label htmlFor="service-details" className="text-xs font-semibold text-[#F7F7F3] block">
                توضیحات و جزئیات درخواست (اختیاری)
              </label>
              <textarea
                id="service-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] transition-colors resize-none"
                placeholder="توضیحات تکمیلی مانند تاریخ سفر، نوع کالا، نوع اقامت یا شرایط خاص پرونده..."
              />
            </div>

            {/* Privacy & Assurance Note */}
            <div className="flex items-center gap-2 text-[11px] text-[#718085]">
              <ShieldCheck className="w-4 h-4 text-[#12B8B0] shrink-0" />
              <span>
                اطلاعات شما نزد گیتی پیما کاملاً محرمانه تلقی شده و صرفاً جهت تماس کارشناس استفاده می‌گردد.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#12B8B0] via-[#087F7B] to-[#12B8B0] text-[#07191F] font-black text-sm shadow-xl shadow-[#12B8B0]/25 hover:shadow-[#12B8B0]/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ثبت درخواست...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ثبت و ارسال درخواست خدمت</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
