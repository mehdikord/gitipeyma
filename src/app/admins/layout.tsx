import type { Metadata } from 'next';
import React from 'react';
import { ToastProvider } from '../../components/admin/ui/Toast';
import { ConfirmProvider } from '../../components/admin/ui/Confirm';
import './admin.css';

export const metadata: Metadata = {
  title: { default: 'پنل مدیریت | گیتی پیما', template: '%s | پنل مدیریت گیتی پیما' },
  robots: { index: false, follow: false },
};

export default function AdminsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin className="min-h-screen bg-[#F4F6F7] text-[#14282D]">
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </div>
  );
}
