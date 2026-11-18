import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '../../../../components/blog/ArticleView';
import { getArticleBySlug, getPopularArticles, getRelatedArticles } from '../../../../modules/site/articles';
import { getI18n, pageMetadata } from '../../../../i18n/metadata';
import { currentLocale } from '../../../../i18n/server';
import { localePath } from '../../../../i18n/config';
import { JsonLd } from '../../../../components/seo/JsonLd';
import { breadcrumbs } from '../../../../components/seo/breadcrumbs';
import { absoluteUrl, siteUrl } from '../../../../lib/seo';

type Props = { params: Promise<{ lang: string; slug: string }> };

const articleFor = async (params: Props['params']) => getArticleBySlug(decodeURIComponent((await params).slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await articleFor(params);
  if (!article) return {};
  return pageMetadata(`/blog/${article.slug}`, article.metaTitle || article.title, article.metaDescription || article.excerpt, {
    type: 'article',
    image: article.image,
    locales: article.writtenIn,
    feed: true,
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category.name,
      tags: article.tags.map((tag) => tag.name),
    },
  });
}

export default async function Page({ params }: Props) {
  const article = await articleFor(params);
  if (!article) notFound();

  const [related, popular, { t }, locale, base] = await Promise.all([getRelatedArticles(article), getPopularArticles(article.id), getI18n(), currentLocale(), siteUrl()]);
  const url = absoluteUrl(base, localePath(locale, `/blog/${article.slug}`));

  const posting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.image ? [absoluteUrl(base, article.image)] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: article.contentLocale,
    articleSection: article.category.name,
    keywords: article.tags.length ? article.tags.map((tag) => tag.name).join(', ') : undefined,
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingMinutes}M`,
    author: { '@id': `${base}/#organization` },
    publisher: { '@id': `${base}/#organization` },
    isPartOf: { '@id': `${absoluteUrl(base, localePath(locale, '/blog'))}#blog` },
    interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/ReadAction', userInteractionCount: article.views },
  };

  return (
    <>
      <JsonLd
        data={[
          await breadcrumbs([
            [t.common.meta.blog, '/blog'],
            [article.title, `/blog/${article.slug}`],
          ]),
          posting,
        ]}
      />
      <ArticleView article={article} related={related} popular={popular} url={url} />
    </>
  );
}
