import type { Metadata } from 'next';
import React from 'react';
import { cookies } from 'next/headers';
import '../globals.css';
import { LOCALES, LOCALE_INFO } from '../../i18n/config';
import { getDictionary } from '../../i18n/dictionaries';
import { I18nProvider } from '../../i18n/I18nProvider';
import { currentLocale, getI18n } from '../../i18n/server';
import { SiteShell } from '../../components/site/SiteShell';
import { ThemeProvider } from '../../components/site/ThemeProvider';
import { THEME_COOKIE, themeFromCookie } from '../../theme';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  const { title, titleTemplate, description } = t.common.meta;
  return {
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    title: { default: title, template: titleTemplate },
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image' },
    icons: { icon: 'data:,' },
  };
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// The root of the public site, one per language. The admin panel has its own root (admins/layout.tsx).
export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await currentLocale();
  const theme = themeFromCookie((await cookies()).get(THEME_COOKIE)?.value);
  return (
    <html lang={locale} dir={LOCALE_INFO[locale].dir} data-theme={theme} style={{ colorScheme: theme }} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-ink font-['Vazirmatn',sans-serif] antialiased">
        <I18nProvider locale={locale} dictionary={getDictionary(locale)}>
          <ThemeProvider initial={theme}>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
