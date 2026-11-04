import React from 'react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { getSiteData } from '../../modules/site/queries';
import { SiteProvider } from './SiteProvider';

// The frame of every public page. Also used by the root not-found page, which sits outside the (site) group.
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const site = await getSiteData();
  return (
    <SiteProvider value={site}>
      <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-brand/30 selection:text-gold">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </SiteProvider>
  );
}
