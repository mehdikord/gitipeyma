import type { Metadata } from 'next';
import { listArticlesForAdmin } from '../../../../modules/articles/queries';
import { articleCategoryOptions } from '../../../../modules/articleCategories/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { ArticlesManager } from './ArticlesManager';

export const metadata: Metadata = { title: 'مقالات' };

export default async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [articles, categories] = await Promise.all([listArticlesForAdmin(params), articleCategoryOptions()]);
  return <ArticlesManager articles={articles} categories={categories} />;
}
