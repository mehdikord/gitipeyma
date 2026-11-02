'use client';

import React from 'react';
import { Compass, ShieldCheck, Award, Users, Globe2, Building2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export const AboutPage: React.FC = () => {
  const onNavigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#07191F] text-[#F7F7F3] pb-24">
      {/* About Hero */}
      <div className="relative py-20 bg-gradient-to-b from-[#051115] to-[#07191F] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#12B8B0]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#E2C98C] text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>درباره نمایندگی رسمی گیتی پیما</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F7F7F3] tracking-tight">
            پل ارتباطی پایدار میان ایران و جهان
          </h1>

          <p className="text-sm sm:text-base text-[#A2B6BC] max-w-2xl mx-auto leading-relaxed">
            بیش از دو دهه تعهد به ایمنی، کیفیت و همراهی بی‌واسطه با مسافران، بازرگانان و دانشجویان در گستره خاورمیانه و اروپا.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">
        {/* Story & Background Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-right">
            <h2 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">
              از نخستین سرویس‌های ترانزیت جاده‌ای تا اکوسیستم خدمات فرامرزی
            </h2>
            <p className="text-sm sm:text-base text-[#A2B6BC] leading-relaxed">
              نام «گیتی پیما» با ترانزیت مدرن و سفرهای بین‌المللی گره خورده است. با توسعه روابط تجاری و مهاجرتی میان ایران و ترکیه، نمایندگی رسمی این شرکت در استانبول فعالیت خود را با هدف ایجاد پایگاهی مطمئن، قانونی و مجهز برای هم‌وطنان آغاز کرد.
            </p>
            <p className="text-xs sm:text-sm text-[#718085] leading-relaxed">
              امروزه این مجموعه فراتر از یک شرکت حمل‌ونقل اتوبوسرانی، زنجیره‌ای جامع از خدمات حقوقی ثبت شرکت، کارگو و ترخیص گمرکی، حواله‌های سوئیفت ارزی، تشریفات رسمی ازدواج و امور اقامتی را در استانبول، تهران و تبریز به صورت یکپارچه مدیریت می‌نماید.
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-[#12B8B0]/30 shadow-2xl">
              <img
                src="/images/about/dubai-skyline.webp"
                alt="تجارت و ترانزیت بین‌المللی گیتی پیما"
                className="w-full h-[380px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 sm:left-6 p-4 rounded-2xl bg-[#0C252B] border border-[#C6A15B]/40 shadow-xl backdrop-blur-md max-w-xs">
              <div className="text-xs font-bold text-[#E2C98C] mb-1">تنها نمایندگی رسمی ترکیه</div>
              <div className="text-[11px] text-[#A2B6BC]">مستقر در پایانه مرکزی مسافربری آکسارای استانبول</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0C252B] border border-[#12B8B0]/20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#07191F] border border-[#12B8B0]/30 flex items-center justify-center text-[#12B8B0]">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F7F7F3]">مأموریت سازمانی ما</h3>
              <p className="text-xs sm:text-sm text-[#A2B6BC] leading-relaxed">
                ایجاد بستری شفاف، قانونی و در دسترس برای رفع دغدغه‌های سفر، تجارت و اقامت هم‌وطنان در ترکیه و کشورهای حوزه شنگن. ما برآنیم تا با حذف واسطه‌های غیرمجاز و ارائه قراردادهای رسمی، تجربه‌ای امن و آرامش‌بخش را برای هر متقاضی رقم بزنیم.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#07191F] border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F7F7F3]">چشم‌انداز و تعهد به کیفیت</h3>
              <p className="text-xs sm:text-sm text-[#A2B6BC] leading-relaxed">
                تبدیل شدن به مرجع نخست و معتمدترین هاب ارتباطی و لجستیکی میان ایران، ترکیه و قاره اروپا، با توسعه ناوگان VIP روزانه، تجهیز زیرساخت‌های کارگو مدرن و به‌کارگیری زبده‌ترین مشاوران حقوقی و بازرگانی بین‌المللی.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">ارزش‌های بنیادین گیتی پیما</h3>
            <p className="text-xs sm:text-sm text-[#718085]">
              اصولی که فعالیت‌های روزمره تیم و تعامل با مراجعین بر مدار آن می‌چرخد.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0C252B] border border-white/5 space-y-3">
              <h4 className="text-base font-bold text-[#12B8B0]">شفافیت و انطباق قانونی</h4>
              <p className="text-xs text-[#A2B6BC] leading-relaxed">
                تمام خدمات با اخذ استعلامات معتبر، صدور اسناد ثبتی و رعایت موازین حقوقی رسمی دو کشور انجام می‌پذیرد.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C252B] border border-white/5 space-y-3">
              <h4 className="text-base font-bold text-[#E2C98C]">احترام به امنیت و زمان مشتری</h4>
              <p className="text-xs text-[#A2B6BC] leading-relaxed">
                زمان‌بندی دقیق در حرکت ناوگان، تحویل کارگو و پیگیری پرونده‌های حقوقی سرلوحه فعالیت کارشناسان است.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C252B] border border-white/5 space-y-3">
              <h4 className="text-base font-bold text-[#74FFF7]">پاسخگویی مستمر و بی‌وقفه</h4>
              <p className="text-xs text-[#A2B6BC] leading-relaxed">
                هیچ پرونده یا مسافری پس از ثبت درخواست تنها رها نخواهد شد و پیگیری تا حصول نتیجه ادامه دارد.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0C252B] via-[#07191F] to-[#0C252B] border border-[#12B8B0]/30 text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black text-[#F7F7F3]">
            مایلید درباره پرونده خود با ما مشورت کنید؟
          </h3>
          <p className="text-sm text-[#A2B6BC] max-w-lg mx-auto">
            کارشناسان گیتی پیما با روی گشاده آماده بررسی تقاضای سفر، تجارت یا امور ثبتی شما هستند.
          </p>
          <button
            onClick={() => onNavigate('/consultation')}
            className="px-8 py-3.5 rounded-full bg-[#12B8B0] hover:bg-[#087F7B] text-[#07191F] font-bold text-sm shadow-xl transition-all hover:scale-105"
          >
            ثبت درخواست مشاوره
          </button>
        </div>
      </div>
    </div>
  );
};
