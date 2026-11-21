'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

/**
 * The article editor runs in the browser only: its publish time is shown in the admin's own clock and
 * calendar, which the server (often on UTC) cannot know, and the text editor needs the browser anyway.
 */
export const ArticleEditorClient = dynamic(() => import('./ArticleEditor').then((module) => module.ArticleEditor), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm font-bold text-[#5D6B82]">
      <Loader2 className="h-5 w-5 animate-spin text-[#094BAF]" />
      در حال بارگذاری ویرایشگر...
    </div>
  ),
});
