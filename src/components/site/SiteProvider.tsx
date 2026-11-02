'use client';

import React, { createContext, useContext } from 'react';
import type { SiteData } from '../../types';

// Settings, offices and links, read once per request by the site layout and shared with every
// client component below it.
const SiteContext = createContext<SiteData | null>(null);

export const SiteProvider: React.FC<{ value: SiteData; children: React.ReactNode }> = ({ value, children }) => (
  <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
);

export function useSite(): SiteData {
  const site = useContext(SiteContext);
  if (!site) throw new Error('useSite must be used inside <SiteProvider>.');
  return site;
}
