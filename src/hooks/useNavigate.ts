'use client';

import { usePathname, useRouter } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();

  return (path: string) => {
    if (path !== pathname) {
      router.push(path, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
}
