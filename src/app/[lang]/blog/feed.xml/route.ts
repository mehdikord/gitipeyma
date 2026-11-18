import { db } from '../../../../lib/db';
import { isLocale, localePath, LOCALE_INFO } from '../../../../i18n/config';
import { getDictionary } from '../../../../i18n/dictionaries';
import { pick } from '../../../../i18n/translated';
import { absoluteUrl, siteUrl } from '../../../../lib/seo';
import { htmlToText } from '../../../../modules/articles/html';

// RSS of the newest articles in one language, at /fa/blog/feed.xml (and /en, /tr). Route handlers cannot
// read the language with next/root-params, so it comes from the address.

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response('Not found', { status: 404 });

  const [base, articles] = await Promise.all([
    siteUrl(),
    db.article.findMany({
      where: { status: 'published', publishedAt: { lte: new Date() } },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: 30,
      select: { slug: true, title: true, excerpt: true, content: true, image: true, publishedAt: true, category: { select: { name: true } } },
    }),
  ]);
  const t = getDictionary(lang);
  const blogUrl = absoluteUrl(base, localePath(lang, '/blog'));
  const feedUrl = absoluteUrl(base, localePath(lang, '/blog/feed.xml'));

  const items = articles.map((article) => {
    const url = absoluteUrl(base, localePath(lang, `/blog/${article.slug}`));
    const summary = pick(article.excerpt, lang) || htmlToText(pick(article.content, lang)).slice(0, 300);
    return [
      '    <item>',
      `      <title>${escape(pick(article.title, lang))}</title>`,
      `      <link>${escape(url)}</link>`,
      `      <guid isPermaLink="true">${escape(url)}</guid>`,
      `      <pubDate>${(article.publishedAt ?? new Date()).toUTCString()}</pubDate>`,
      `      <category>${escape(pick(article.category.name, lang))}</category>`,
      `      <description>${escape(summary)}</description>`,
      article.image ? `      <enclosure url="${escape(absoluteUrl(base, article.image))}" type="image/${article.image.split('.').pop()?.replace('jpg', 'jpeg') ?? 'jpeg'}" length="0" />` : '',
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(t.blog.meta.feed)}</title>
    <link>${escape(blogUrl)}</link>
    <atom:link href="${escape(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>${escape(t.blog.meta.description)}</description>
    <language>${LOCALE_INFO[lang].intl}</language>
    <lastBuildDate>${(articles[0]?.publishedAt ?? new Date()).toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' } });
}
