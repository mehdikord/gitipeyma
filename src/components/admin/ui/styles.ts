// Shared class lists for the admin panel, so every screen draws controls the same way.

export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B7A75]';

export const INPUT =
  'w-full rounded-lg border bg-white px-3 text-sm text-[#14282D] placeholder:text-[#94A3A8] outline-none transition-colors focus:border-[#0B7A75] focus:ring-2 focus:ring-[#0B7A75]/15 disabled:bg-[#F4F6F7] disabled:text-[#5F7177]';

export const inputBorder = (error?: string) => (error ? 'border-[#DC2626]' : 'border-[#D5DDE0] hover:border-[#B8C5C9]');

export const CARD = 'rounded-xl border border-[#E3E8EA] bg-white';
