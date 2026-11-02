import type { Metadata } from 'next';
import { requireAdmin } from '../../../../lib/auth/currentAdmin';
import { ProfileForm } from './ProfileForm';

export const metadata: Metadata = { title: 'حساب کاربری' };

export default async function ProfilePage() {
  const admin = await requireAdmin();
  return <ProfileForm admin={{ name: admin.name, phone: admin.phone }} />;
}
