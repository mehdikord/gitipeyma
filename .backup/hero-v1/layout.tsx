import type { Metadata } from 'next';
import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
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
      <body className="bg-[#07191F] text-[#F7F7F3] font-['Vazirmatn',sans-serif] antialiased selection:bg-[#12B8B0]/30 selection:text-[#E2C98C]">
        <div className="min-h-screen flex flex-col bg-[#07191F] text-[#F7F7F3] selection:bg-[#12B8B0]/30 selection:text-[#E2C98C]">
          {/* Global Header */}
          <Header />

          {/* Main View Router Content */}
          <div className="flex-1">{children}</div>

          {/* Global Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
