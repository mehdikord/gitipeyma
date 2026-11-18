import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleForAdmin } from '../../../../../../modules/articles/queries';
import { articleCategoryOptions } from '../../../../../../modules/articleCategories/queries';
import { tagOptions } from '../../../../../../modules/tags/queries';
import { ArticleEditorClient as ArticleEditor } from '../../ArticleEditorClient';

export const metadata: Metadata = { title: 'ویرایش مقاله' };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const [article, categories, tags] = await Promise.all([getArticleForAdmin(Number((await params).id)), articleCategoryOptions(), tagOptions()]);
  if (!article) notFound();
  // Keyed by the article and its last save, so the form starts from what is stored
  return <ArticleEditor key={`${article.id}-${article.updatedAt}`} article={article} categories={categories} tags={tags} />;
}
