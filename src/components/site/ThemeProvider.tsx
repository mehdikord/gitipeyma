'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { THEME_COOKIE, Theme } from '../../theme';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// The theme the server rendered arrives from the [lang] layout, so the toggle and the page agree from the first paint.
export const ThemeProvider: React.FC<{ initial: Theme; children: React.ReactNode }> = ({ initial, children }) => {
  const [theme, setThemeState] = useState<Theme>(initial);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const root = document.documentElement;
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    root.style.colorScheme = next;
    window.setTimeout(() => root.classList.remove('theme-switching'), 400);
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return context;
}
