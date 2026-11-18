import type { Metadata } from 'next';
import { listArticleCategories } from '../../../../modules/articleCategories/queries';
import { ArticleCategoriesManager } from './ArticleCategoriesManager';

export const metadata: Metadata = { title: 'دسته‌بندی مقالات' };

export default async function ArticleCategoriesPage() {
  return <ArticleCategoriesManager rows={await listArticleCategories()} />;
}
