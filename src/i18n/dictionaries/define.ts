import type { Locale } from '../config';

/**
 * One namespace of the site's interface text, all three languages side by side. The Persian object
 * sets the shape; English and Turkish must have exactly the same keys, or the build fails.
 * Placeholders like {name} are filled with fill() from i18n/format.
 */
export const defineMessages = <T extends object>(messages: { fa: T; en: NoInfer<T>; tr: NoInfer<T> }): Record<Locale, T> => messages;
