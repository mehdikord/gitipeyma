import type { Metadata } from 'next';
import { articleCategoryOptions } from '../../../../../modules/articleCategories/queries';
import { tagOptions } from '../../../../../modules/tags/queries';
import { ArticleEditorClient as ArticleEditor } from '../ArticleEditorClient';

export const metadata: Metadata = { title: 'افزودن مقاله' };

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([articleCategoryOptions(), tagOptions()]);
  return <ArticleEditor article={null} categories={categories} tags={tags} />;
}
