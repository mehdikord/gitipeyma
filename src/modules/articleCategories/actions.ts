'use server';

import { db } from '../../lib/db';
import { adminAction, FormError, idSchema } from '../../lib/actions';
import { ArticleCategoryInput, articleCategorySchema } from './schema';

export async function saveArticleCategory(id: number | null, input: ArticleCategoryInput) {
  return adminAction(articleCategorySchema, input, async (data) => {
    if (id) await db.articleCategory.update({ where: { id }, data });
    else await db.articleCategory.create({ data });
  });
}

export async function deleteArticleCategory(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    const articles = await db.article.count({ where: { articleCategoryId: data.id } });
    if (articles > 0) throw new FormError(`${articles.toLocaleString('fa-IR')} مقاله در این دسته است. ابتدا آن‌ها را به دسته دیگری منتقل کنید.`);
    await db.articleCategory.delete({ where: { id: data.id } });
    return { ok: true, message: 'دسته حذف شد.' };
  });
}
