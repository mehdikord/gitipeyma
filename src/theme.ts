// The public site's color theme. Dark is the brand's own and the default; the visitor's choice is kept in a cookie
// so the server renders the right theme from the first byte (no flash, no hydration mismatch).

export type Theme = 'dark' | 'light';

export const THEMES: readonly Theme[] = ['dark', 'light'];
export const THEME_COOKIE = 'theme';

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

export const themeFromCookie = (value: string | undefined): Theme => (isTheme(value) ? value : 'dark');
