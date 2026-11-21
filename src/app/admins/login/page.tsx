import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '../../../lib/auth/currentAdmin';
import { param } from '../../../lib/pagination';
import { LoginForm } from './LoginForm';
import { BrandEmblem } from '../../../components/layout/BrandEmblem';

export const metadata: Metadata = { title: 'ورود' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (await getCurrentAdmin()) redirect('/admins');
  const next = param(await searchParams, 'next');

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050D1C] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandEmblem variant="gold" priority className="h-24" />
          <h1 className="mt-4 text-xl font-black text-white">ورود به پنل مدیریت</h1>
          <p className="mt-1 text-sm text-[#A2B6BC]">رویال تراول</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
