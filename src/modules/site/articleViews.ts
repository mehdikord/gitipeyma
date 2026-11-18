'use server';

import { z } from 'zod';
import { db } from '../../lib/db';
import { clientIp, tooManyAttempts } from '../../lib/rateLimit';

/**
 * Counts one opening of an article page. Called from the browser once the page has loaded, so link
 * prefetching and most crawlers are not counted. A visitor's reloads still count, but one address
 * cannot add more than a few views a minute to the same article.
 */
export async function recordArticleView(id: number) {
  const parsed = z.number().int().positive().safeParse(id);
  if (!parsed.success) return;
  if (tooManyAttempts(`article-view:${await clientIp()}:${parsed.data}`, 10, 60_000)) return;
  await db.article
    .updateMany({ where: { id: parsed.data, status: 'published', publishedAt: { lte: new Date() } }, data: { views: { increment: 1 } } })
    .catch((error) => console.error(error));
}
