// Shared class lists for the admin panel, so every screen draws controls the same way.

export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#094BAF]';

export const INPUT =
  'w-full rounded-lg border bg-white px-3 text-sm text-[#0E1B30] placeholder:text-[#94A1B5] outline-none transition-colors focus:border-[#094BAF] focus:ring-2 focus:ring-[#094BAF]/15 disabled:bg-[#F4F6FA] disabled:text-[#5D6B82]';

export const inputBorder = (error?: string) => (error ? 'border-[#DC2626]' : 'border-[#D4DCE8] hover:border-[#B8C3D4]');

export const CARD = 'rounded-xl border border-[#E2E8F1] bg-white';
