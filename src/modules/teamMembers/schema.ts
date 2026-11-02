import { z } from 'zod';
import { flag, imagePath, optionalText, requiredText, sortOrder } from '../../lib/validation';

export const teamMemberSchema = z.object({
  name: requiredText('نام'),
  role: requiredText('سمت'),
  specialty: optionalText('تخصص', 500),
  department: optionalText('دپارتمان'),
  image: imagePath('عکس'),
  isActive: flag,
  sortOrder,
});

export type TeamMemberInput = z.input<typeof teamMemberSchema>;
