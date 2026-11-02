import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

const title = 'گیتی پیما | GITI International';
const description =
  'سامانه رسمی گیتی پیما؛ خدمات بین‌المللی مسافری VIP، کارگو، خدمات ارزی، حقوقی، ثبت شرکت و اقامت فرامرزی بین ایران، ترکیه و اروپا.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: 'data:,' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* The public site and the admin panel each draw their own frame: (site)/layout.tsx and admins/ */}
      <body className="bg-[#07191F] text-[#F7F7F3] font-['Vazirmatn',sans-serif] antialiased">{children}</body>
    </html>
  );
}
