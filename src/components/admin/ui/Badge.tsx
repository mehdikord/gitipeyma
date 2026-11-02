import React from 'react';

export type BadgeTone = 'gray' | 'green' | 'amber' | 'blue' | 'red' | 'teal';

const TONES: Record<BadgeTone, string> = {
  gray: 'bg-[#EEF2F3] text-[#3F5257]',
  green: 'bg-[#DCFCE7] text-[#166534]',
  amber: 'bg-[#FEF3C7] text-[#92400E]',
  blue: 'bg-[#DBEAFE] text-[#1E40AF]',
  red: 'bg-[#FEE2E2] text-[#991B1B]',
  teal: 'bg-[#CCFBF1] text-[#115E59]',
};

export const Badge: React.FC<{ tone?: BadgeTone; children: React.ReactNode }> = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${TONES[tone]}`}>{children}</span>
);

export const ActiveBadge: React.FC<{ active: boolean; on?: string; off?: string }> = ({ active, on = 'فعال', off = 'غیرفعال' }) => (
  <Badge tone={active ? 'green' : 'gray'}>{active ? on : off}</Badge>
);
