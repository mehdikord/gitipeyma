'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../site/ThemeProvider';
import { useI18n } from '../../i18n/I18nProvider';

/** The dark/light switch in the header: a night sky whose golden moon slides over and becomes the sun. */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { t: { layout: { header: { theme: t } } } } = useI18n();
  const light = theme === 'light';
  const label = light ? t.toDark : t.toLight;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={label}
      title={label}
      onClick={() => setTheme(light ? 'dark' : 'light')}
      className={`theme-toggle ${className}`}
    >
      <span className="theme-toggle-knob" aria-hidden="true">
        <Moon className="theme-toggle-moon" strokeWidth={2.4} />
        <Sun className="theme-toggle-sun" strokeWidth={2.4} />
      </span>
    </button>
  );
};
