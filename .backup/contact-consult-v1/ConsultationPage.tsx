'use client';

import React, { useEffect, useState } from 'react';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { SERVICES_DATA } from '../../data/services';
import { COMPANY_CONFIG } from '../../data/company';
import { Send, CheckCircle2, AlertCircle, Loader2, PhoneCall, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export const ConsultationPage: React.FC = () => {
  const onNavigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState('مشاوره عمومی و چندمنظوره');
  const [preferredContactTime, setPreferredContactTime] = useState('ساعات اداری (۰۹:۰۰ الی ۱۸:۰۰)');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Arriving from a service's "consult about this" link preselects that service
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service');
    const service = SERVICES_DATA.find((s) => s.slug === slug);
    if (service) setSelectedService(service.title);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidation = validateFullName(fullName);
    const phoneValidation = validatePhoneNumber(phone);

    const newErrors: { fullName?: string; phone?: string } = {};

    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.error;
    }
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setNotes('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#07191F] text-[#F7F7F3] pt-12 pb-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#12B8B0]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header content with exact prompt title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#E2C98C] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مشاوره تخصصی و برنامه‌ریزی خدمات</span>
          </div>

          {/* Mandatory Headline from Brief */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#F7F7F3] tracking-tight leading-tight">
            «برای دریافت مشاوره، اولین قدم را بردارید.»
          </h1>

          {/* Mandatory Description from Brief */}
          <p className="text-base sm:text-lg text-[#A2B6BC] max-w-xl mx-auto leading-relaxed">
            اطلاعات تماس خود را وارد کنید تا کارشناسان گیتی پیما برای راهنمایی و بررسی درخواست شما با شما در ارتباط باشند.
          </p>
        </div>

        {/* Consultation Form Card */}
        <div className="rounded-3xl p-6 sm:p-12 bg-[#0C252B] border border-[#12B8B0]/30 shadow-2xl relative">
          {isSuccess ? (
            <div className="p-8 rounded-2xl bg-[#07191F] border border-[#12B8B0] text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#12B8B0]/20 text-[#12B8B0] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-[#E2C98C]">
                درخواست مشاوره شما با موفقیت دریافت شد
              </h2>
              <p className="text-sm text-[#A2B6BC] leading-relaxed max-w-md mx-auto">
                کارشناس تخصصی بخش «{selectedService}» در زمان انتخابی شما با شماره تماس ثبت‌شده ارتباط برقرار خواهد کرد.
              </p>
              <div className="p-4 rounded-xl bg-[#0C252B] border border-white/10 text-xs text-[#718085] max-w-md mx-auto">
                در صورت نیاز فوری به هماهنگی بلیت اتوبوس یا ترخیص مرزی، می‌توانید مستقیماً با خط پشتیبانی شبانه‌روزی تماس حاصل فرمایید.
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-[#12B8B0] text-[#07191F] font-bold text-xs hover:bg-[#087F7B] transition-colors"
                >
                  ثبت فرم مشاوره جدید
                </button>
                <button
                  onClick={() => onNavigate('/')}
                  className="px-6 py-2.5 rounded-full bg-[#07191F] border border-white/20 text-[#F7F7F3] font-bold text-xs hover:border-[#12B8B0] transition-colors"
                >
                  بازگشت به صفحه اصلی
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="consult-fullname" className="text-xs font-semibold text-[#F7F7F3] block">
                    نام و نام خانوادگی <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="consult-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#07191F] border ${
                      errors.fullName ? 'border-red-400' : 'border-[#12B8B0]/30'
                    } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] transition-colors`}
                    placeholder="مثال: محمد امینی"
                  />
                  {errors.fullName && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Mobile / Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="consult-phone" className="text-xs font-semibold text-[#F7F7F3] block">
                    شماره موبایل یا واتس‌اپ <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="consult-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#07191F] border ${
                      errors.phone ? 'border-red-400' : 'border-[#12B8B0]/30'
                    } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] transition-colors`}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹ یا +90536xxxxxxx"
                    dir="ltr"
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-2">
                <label htmlFor="consult-service" className="text-xs font-semibold text-[#F7F7F3] block">
                  موضوع یا خدمت مورد نظر برای مشاوره
                </label>
                <select
                  id="consult-service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-[#E2C98C] text-sm font-semibold focus:outline-none focus:border-[#E2C98C]"
                >
                  <option value="مشاوره عمومی و چندمنظوره">مشاوره عمومی و چندمنظوره فرامرزی</option>
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Time */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#F7F7F3] block">
                  زمان ترجیحی شما جهت تماس کارشناس:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'ساعات اداری (۰۹:۰۰ الی ۱۴:۰۰)',
                    'عصرها (۱۴:۰۰ الی ۱۹:۰۰)',
                    'تماس شبانه‌روزی / فوری',
                  ].map((timeOption) => (
                    <button
                      type="button"
                      key={timeOption}
                      onClick={() => setPreferredContactTime(timeOption)}
                      className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        preferredContactTime === timeOption
                          ? 'bg-[#12B8B0]/20 border-[#12B8B0] text-[#74FFF7] font-bold'
                          : 'bg-[#07191F] border-white/10 text-[#A2B6BC] hover:border-white/25'
                      }`}
                    >
                      {timeOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="consult-notes" className="text-xs font-semibold text-[#F7F7F3] block">
                  توضیحات تکمیلی (اختیاری)
                </label>
                <textarea
                  id="consult-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] transition-colors resize-none"
                  placeholder="در صورت تمایل، خلاصه‌ای از شرایط پرونده، حجم بار یا زمان سفر خود را ذکر فرمایید..."
                />
              </div>

              {/* Direct Hotline Pill */}
              <div className="p-4 rounded-xl bg-[#07191F] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#A2B6BC]">
                  <Clock className="w-4 h-4 text-[#12B8B0]" />
                  <span>پاسخگویی مستقیم پشتیبانی شبانه‌روزی:</span>
                </div>
                <a
                  href={`tel:${COMPANY_CONFIG.emergencySupportPhone.replace(/[\s()-]/g, '')}`}
                  className="text-sm font-mono font-bold text-[#E2C98C] hover:text-white"
                  dir="ltr"
                >
                  {COMPANY_CONFIG.emergencySupportPhone}
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C6A15B] via-[#E2C98C] to-[#C6A15B] text-[#07191F] font-black text-sm tracking-wide shadow-xl shadow-[#C6A15B]/25 hover:shadow-[#C6A15B]/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ثبت اطلاعات...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ثبت درخواست مشاوره</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
