'use client';

import React, { useState } from 'react';
import { COMPANY_CONFIG } from '../../data/company';
import { validateFullName, validatePhoneNumber, validateMessage } from '../../utils/validation';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export const ContactPage: React.FC = () => {
  const onNavigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('پیگیری سرویس اتوبوس تهران - استانبول');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidation = validateFullName(fullName);
    const phoneValidation = validatePhoneNumber(phone);
    const messageValidation = validateMessage(message, true);

    const newErrors: { fullName?: string; phone?: string; message?: string } = {};

    if (!nameValidation.isValid) newErrors.fullName = nameValidation.error;
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;
    if (!messageValidation.isValid) newErrors.message = messageValidation.error;

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
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#07191F] text-[#F7F7F3] pb-24">
      {/* Contact Hero */}
      <div className="relative py-20 bg-gradient-to-b from-[#051115] to-[#07191F] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12B8B0]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12B8B0]/15 border border-[#12B8B0]/30 text-[#12B8B0] text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>راه‌های ارتباطی و دفاتر رسمی</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F7F7F3] tracking-tight">
            ارتباط با نمایندگی رسمی گیتی پیما
          </h1>

          <p className="text-sm sm:text-base text-[#A2B6BC] max-w-2xl mx-auto leading-relaxed">
            دفاتر ما در استانبول، تهران و تبریز همراه با خطوط ارتباطی شبانه‌روزی آماده پاسخگویی به درخواست‌های شما هستند.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Contact Hotline & Interactive Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#0C252B] border border-[#12B8B0]/30 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F7F7F3] mb-2">
                ارسال پیام یا طرح پرسش
              </h2>
              <p className="text-xs sm:text-sm text-[#A2B6BC] mb-8">
                کارشناسان مربوطه در ساعات کاری پیام شما را بررسی و در اسرع وقت پاسخ خواهند داد.
              </p>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-[#07191F] border border-[#12B8B0] text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#12B8B0]/20 text-[#12B8B0] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#E2C98C]">
                    پیام شما با موفقیت به واحد مربوطه ارسال گردید
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A2B6BC] max-w-md mx-auto leading-relaxed">
                    شماره پیگیری در سامانه ثبت شد و همکاران ما با شما تماس حاصل خواهند کرد.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full bg-[#12B8B0] text-[#07191F] font-bold text-xs hover:bg-[#087F7B] transition-colors"
                  >
                    ارسال پیام دیگر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-fullname" className="text-xs font-semibold text-[#F7F7F3] block">
                        نام و نام خانوادگی <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contact-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-[#07191F] border ${
                          errors.fullName ? 'border-red-400' : 'border-[#12B8B0]/30'
                        } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C]`}
                        placeholder="مثال: سهراب مرادی"
                      />
                      {errors.fullName && (
                        <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.fullName}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="text-xs font-semibold text-[#F7F7F3] block">
                        شماره تماس یا واتس‌اپ <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-[#07191F] border ${
                          errors.phone ? 'border-red-400' : 'border-[#12B8B0]/30'
                        } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C]`}
                        placeholder="مثال: ۰۹۱۲xxxxxxx"
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

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-[#F7F7F3] block">
                      موضوع پیام
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 text-[#E2C98C] text-sm font-semibold focus:outline-none focus:border-[#E2C98C]"
                    >
                      <option value="پیگیری سرویس اتوبوس تهران - استانبول">پیگیری سرویس اتوبوس تهران - استانبول</option>
                      <option value="استعلام نرخ و پیگیری بار و کارگو">استعلام نرخ و پیگیری بار و کارگو</option>
                      <option value="امور ثبت شرکت و حساب بانکی">امور ثبت شرکت و حساب بانکی</option>
                      <option value="خدمات ارزی و سوئیفت بین‌المللی">خدمات ارزی و سوئیفت بین‌المللی</option>
                      <option value="امور حقوقی و وکالتنامه نوتر">امور حقوقی و وکالتنامه نوتر</option>
                      <option value="سایر موارد و پیشنهادات">سایر موارد و پیشنهادات</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-semibold text-[#F7F7F3] block">
                      متن پیام یا شرح سوال <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-[#07191F] border ${
                        errors.message ? 'border-red-400' : 'border-[#12B8B0]/30'
                      } text-white placeholder-[#718085] text-sm focus:outline-none focus:border-[#E2C98C] resize-none`}
                      placeholder="متن پیام خود را با جزئیات بنویسید..."
                    />
                    {errors.message && (
                      <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </div>
                    )}
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
                        <span>در حال ارسال پیام...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ارسال پیام به واحد ارتباطات</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 24/7 Support Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0C252B] to-[#07191F] border border-[#C6A15B]/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#12B8B0] animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-[#E2C98C]">
                  EMERGENCY & 24/7 DISPATCH
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F7F7F3]">
                خط ویژه پشتیبانی شبانه‌روزی
              </h3>
              <p className="text-xs text-[#A2B6BC] leading-relaxed">
                پاسخگویی به مسافران در مسیر جاده‌ای و هماهنگی ترخیص بارهای فوری گمرکی در تمام روزهای هفته.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${COMPANY_CONFIG.emergencySupportPhone.replace(/[\s()-]/g, '')}`}
                  className="text-xl font-mono font-black text-[#12B8B0] hover:text-[#74FFF7] block"
                  dir="ltr"
                >
                  {COMPANY_CONFIG.emergencySupportPhone}
                </a>
              </div>
            </div>

            {/* Online Instant Messaging */}
            <div className="p-6 rounded-2xl bg-[#0C252B] border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-[#F7F7F3]">ارتباط مستقیم در پیام‌رسان‌ها</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/905367008090"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#07191F] border border-[#25D366]/30 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتس‌اپ رسمی</span>
                </a>
                <a
                  href="https://t.me/GitiPeymaOfficial"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-[#07191F] border border-[#0088cc]/30 text-xs font-bold text-[#29b6f6] hover:bg-[#0088cc]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>کانال تلگرام</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Official Directory of Physical Offices */}
        <div className="space-y-6">
          <div className="space-y-1 text-right">
            <h3 className="text-xl sm:text-2xl font-black text-[#F7F7F3]">
              نشانی دفاتر رسمی گیتی پیما
            </h3>
            <p className="text-xs text-[#718085]">
              مراجعه حضوری با هماهنگی قبلی یا در ساعات کاری اعلام‌شده در هر شعبه امکان‌پذیر است.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPANY_CONFIG.offices.map((office, oIdx) => (
              <div
                key={oIdx}
                className={`p-6 rounded-2xl bg-[#0C252B] border ${
                  office.isPrimary ? 'border-[#C6A15B]/50 ring-1 ring-[#C6A15B]/30' : 'border-white/5'
                } shadow-xl space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#F7F7F3] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#12B8B0]" />
                    <span>{office.city}</span>
                  </h4>
                  {office.isPrimary && (
                    <span className="text-[10px] font-bold text-[#07191F] bg-[#C6A15B] px-2 py-0.5 rounded-full">
                      دفتر مرکزی
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#A2B6BC] leading-relaxed min-h-[48px]">
                  {office.addressFa}
                </p>

                <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
                  <div className="text-[#718085] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>{office.workingHours}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {office.phones.map((p, pIdx) => (
                      <div key={pIdx} className="font-mono text-[#F7F7F3]" dir="ltr">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
