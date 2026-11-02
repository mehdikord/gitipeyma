import type { Metadata } from 'next';
import { listSocialLinks } from '../../../../modules/socialLinks/queries';
import { SocialLinksManager } from './SocialLinksManager';

export const metadata: Metadata = { title: 'شبکه‌های اجتماعی' };

export default async function SocialLinksPage() {
  return <SocialLinksManager rows={await listSocialLinks()} />;
}
