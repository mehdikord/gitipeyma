import React from 'react';
import { Users } from 'lucide-react';
import type { TeamMember } from '../../types';

export const TeamSection: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  if (members.length === 0) return null;

  return (
    <section className="py-24 bg-[#07191F] text-[#F7F7F3] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12B8B0]/15 border border-[#12B8B0]/30 text-[#12B8B0] text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>متخصصان میدانی گیتی پیما</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F7F7F3]">
            کادر اجرایی و مشاوران امور بین‌الملل
          </h2>
          <p className="text-sm text-[#A2B6BC]">
            تلفیقی از کارشناسان باسابقه ترانزیت جاده‌ای، وکلای تجاری و مشاوران اقامتی مستقر در دفاتر استانبول و تهران.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl overflow-hidden bg-[#0C252B] border border-[#12B8B0]/20 hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div aria-hidden="true" className="w-full h-full flex items-center justify-center bg-[#07191F] text-5xl font-black text-[#12B8B0]/40">
                    {member.name.trim().charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C252B] via-transparent to-transparent"></div>
                {member.department && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-semibold text-[#12B8B0] bg-[#07191F]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#12B8B0]/30">
                      {member.department}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 text-right space-y-1.5">
                <h3 className="text-base font-bold text-[#F7F7F3] group-hover:text-[#E2C98C] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-medium text-[#12B8B0]">{member.role}</p>
                <p className="text-[11px] text-[#718085] leading-relaxed pt-1">
                  {member.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Note */}
        <div className="mt-12 text-center text-[11px] text-[#718085] max-w-lg mx-auto">
          * تمامی فرآیندهای اداری، حقوقی و ترانزیتی در مراجع رسمی توسط وکلای پایه یک و کارگزاران مورد تایید نهادهای قانونی نظارت و انجام می‌پذیرند.
        </div>
      </div>
    </section>
  );
};
