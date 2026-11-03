import { z } from 'zod';
import { flag, imagePath, sortOrder, translatedText } from '../../lib/validation';

export const teamMemberSchema = z.object({
  name: translatedText('نام', 255, { required: true }),
  role: translatedText('سمت', 255, { required: true }),
  specialty: translatedText('تخصص', 500),
  department: translatedText('دپارتمان'),
  image: imagePath('عکس'),
  isActive: flag,
  sortOrder,
});

export type TeamMemberInput = z.input<typeof teamMemberSchema>;
