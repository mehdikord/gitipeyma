import type { Metadata } from 'next';
import React from 'react';
import { ToastProvider } from '../../components/admin/ui/Toast';
import { ConfirmProvider } from '../../components/admin/ui/Confirm';
import '../globals.css';
import './admin.css';

export const metadata: Metadata = {
  title: { default: 'پنل مدیریت | رویال تراول', template: '%s | پنل مدیریت رویال تراول' },
  robots: { index: false, follow: false },
  icons: { icon: 'data:,' },
};

// The panel is its own root, always in Persian, whatever language the site is viewed in.
export default function AdminsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Vazirmatn',sans-serif] antialiased">
        <div data-admin className="min-h-screen bg-[#F4F6F7] text-[#14282D]">
          <ToastProvider>
            <ConfirmProvider>{children}</ConfirmProvider>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
