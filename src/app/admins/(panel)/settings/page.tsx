import type { Metadata } from 'next';
import { getSettingsForAdmin } from '../../../../modules/settings/queries';
import { SettingsForm } from './SettingsForm';

export const metadata: Metadata = { title: 'تنظیمات سایت' };

export default async function SettingsPage() {
  return <SettingsForm settings={await getSettingsForAdmin()} />;
}
