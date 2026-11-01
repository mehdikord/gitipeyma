'use client';

import { RefObject, useEffect, useState } from 'react';

export type RevealState = 'none' | 'armed' | 'play';

// Plays a section's entrance once as it scrolls into view. Arriving mid-page or
// preferring reduced motion skips it, and without JS the section simply stays visible.
export function useRevealOnce(ref: RefObject<HTMLElement | null>): RevealState {
  const [reveal, setReveal] = useState<RevealState>('none');

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    setReveal('armed');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReveal('play');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return reveal;
}
