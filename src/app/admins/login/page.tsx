import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '../../../lib/auth/currentAdmin';
import { param } from '../../../lib/pagination';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'ورود' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (await getCurrentAdmin()) redirect('/admins');
  const next = param(await searchParams, 'next');

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07191F] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2C98C]/50 bg-[#0C252B] font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black text-[#E2C98C]">
            RT
          </span>
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
