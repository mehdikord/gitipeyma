import { z } from 'zod';
import { flag, requiredText, sortOrder } from '../../lib/validation';
import { SOCIAL_ICONS } from './icons';

export const socialLinkSchema = z.object({
  platform: requiredText('نام شبکه', 50),
  label: requiredText('توضیح'),
  url: requiredText('آدرس', 500).pipe(z.string().regex(/^(https?:\/\/|mailto:|tel:)/, { error: 'آدرس باید با https:// یا mailto: شروع شود.' })),
  icon: z.string().refine((value) => value in SOCIAL_ICONS, { error: 'آیکن را انتخاب کنید.' }),
  isActive: flag,
  sortOrder,
});

export type SocialLinkInput = z.input<typeof socialLinkSchema>;
