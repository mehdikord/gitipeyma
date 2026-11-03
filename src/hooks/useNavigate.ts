'use client';

import { usePathname, useRouter } from 'next/navigation';
import { isLocale } from '../i18n/config';
import { useI18n } from '../i18n/I18nProvider';

/** Goes to a site path ("/services") in the current language ("/en/services"). */
export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const { path: localized } = useI18n();

  return (path: string) => {
    const target = path.startsWith('/') && !isLocale(path.split('/')[1]) ? localized(path) : path;
    if (target !== pathname) {
      router.push(target, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
}
