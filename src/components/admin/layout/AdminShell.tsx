'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, LogOut, Menu, UserCog, X } from 'lucide-react';
import { logout } from '../../../modules/auth/actions';
import { NAVIGATION, NavBadges } from './navigation';
import { FOCUS } from '../ui/styles';

const isActive = (pathname: string, href: string) => (href === '/admins' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

const Sidebar: React.FC<{ badges: NavBadges; onNavigate?: () => void }> = ({ badges, onNavigate }) => {
  const pathname = usePathname();
  return (
    <nav aria-label="منوی پنل مدیریت" className="flex-1 overflow-y-auto px-3 pb-6">
      {NAVIGATION.map((section, index) => (
        <div key={section.title ?? index} className="mt-5 first:mt-2">
          {section.title && <p className="mb-1.5 px-3 text-[11px] font-bold text-[#7F979E]">{section.title}</p>}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);
              const count = item.badge ? badges[item.badge] : 0;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#E2C98C] ${
                      active ? 'bg-[#12343C] text-white' : 'text-[#B7C8CD] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {active && <span aria-hidden="true" className="absolute inset-y-1.5 right-0 w-1 rounded-l bg-[#E2C98C]" />}
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-[#E2C98C]' : ''}`} />
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span className="rounded-full bg-[#E2C98C] px-2 py-0.5 text-[11px] font-black text-[#07191F]" aria-label={`${count} مورد جدید`}>
                        {count.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const Brand = () => (
  <Link href="/admins" className="flex items-center gap-3 rounded-lg px-5 py-5 focus-visible:outline-2 focus-visible:outline-[#E2C98C]">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2C98C]/50 bg-[#0C252B] font-['Plus_Jakarta_Sans',sans-serif] text-lg font-black text-[#E2C98C]">G</span>
    <span>
      <span className="block text-base font-black text-white">گیتی پیما</span>
      <span className="block text-[11px] text-[#A2B6BC]">پنل مدیریت</span>
    </span>
  </Link>
);

export const AdminShell: React.FC<{ admin: { name: string; phone: string }; badges: NavBadges; children: React.ReactNode }> = ({ admin, badges, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setDrawerOpen(false), [pathname]);

  return (
    <div className="min-h-screen lg:pr-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 flex-col bg-[#07191F] lg:flex">
        <Brand />
        <Sidebar badges={badges} />
      </aside>

      {/* Phone drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="بستن منو" className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="admin-drawer absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-[#07191F]">
            <div className="flex items-center justify-between pl-3">
              <Brand />
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="بستن منو" className="rounded-lg p-2 text-[#B7C8CD] hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar badges={badges} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#E3E8EA] bg-white/95 px-4 backdrop-blur sm:px-6">
        <button type="button" onClick={() => setDrawerOpen(true)} aria-label="باز کردن منو" className={`-mr-1 rounded-lg p-2 text-[#3F5257] hover:bg-[#EEF2F3] lg:hidden ${FOCUS}`}>
          <Menu className="h-5 w-5" />
        </button>

        <a href="/" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-bold text-[#0B7A75] hover:bg-[#E6F4F3] ${FOCUS}`}>
          <ExternalLink className="h-4 w-4" />
          <span>مشاهده سایت</span>
        </a>

        <div className="mr-auto flex items-center gap-1">
          <Link href="/admins/profile" className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[#EEF2F3] ${FOCUS}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4F3] text-sm font-black text-[#0B5F5B]">{admin.name.trim().charAt(0) || 'م'}</span>
            <span className="hidden text-right sm:block">
              <span className="block text-[13px] font-bold leading-tight text-[#14282D]">{admin.name}</span>
              <span dir="ltr" className="block text-[11px] leading-tight text-[#5F7177]">
                {admin.phone}
              </span>
            </span>
            <UserCog className="h-4 w-4 text-[#5F7177] sm:hidden" />
          </Link>
          <form action={logout}>
            <button type="submit" title="خروج" aria-label="خروج از پنل" className={`rounded-lg p-2 text-[#B91C1C] hover:bg-[#FEE2E2] ${FOCUS}`}>
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
