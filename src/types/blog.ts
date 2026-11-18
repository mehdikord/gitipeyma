// The blog as the public site sees it: plain text in the visitor's language.

import type { Locale } from '../i18n/config';

export type ArticleCardItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  category: { id: number; name: string };
  publishedAt: string;
  readingMinutes: number;
  views: number;
  isFeatured: boolean;
};

export type TocEntry = { id: string; text: string; level: 2 | 3 };

export type ArticleDetail = ArticleCardItem & {
  // Cleaned, with heading ids for the table of contents
  html: string;
  toc: TocEntry[];
  // The language the body is actually written in (a missing translation falls back to another)
  contentLocale: Locale;
  // The languages the article is written in, for hreflang and the sitemap
  writtenIn: Locale[];
  tags: { id: number; name: string }[];
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  wordCount: number;
};

export type BlogFilterItem = { id: number; name: string; count: number };

export type BlogListing = {
  articles: ArticleCardItem[];
  page: number;
  pages: number;
  total: number;
};
