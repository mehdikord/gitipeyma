'use server';

import { z } from 'zod';
import { db } from '../../lib/db';
import { adminAction, FormError, idSchema } from '../../lib/actions';
import { Translated } from '../../i18n/translated';
import { isBlankHtml, sanitizeArticleHtml, slugify } from './html';
import { ArticleInput, articleSchema, ARTICLE_STATUSES } from './schema';

/** The slug if it is free, otherwise the slug with -2, -3, ... after it. */
async function freeSlug(base: string, id: number | null) {
  for (let n = 1; n < 100; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const taken = await db.article.findFirst({ where: { slug: candidate, NOT: id ? { id } : undefined }, select: { id: true } });
    if (!taken) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/** Creates (id null) or updates an article with its tags. Returns the article's id, so a new one can open for editing. */
export async function saveArticle(id: number | null, input: ArticleInput) {
  return adminAction(articleSchema, input, async ({ tagIds, slug, content, publishedAt, ...data }, admin) => {
    // Only what the editor can make is kept; a language whose body is empty is dropped
    const body: Translated = {};
    for (const [locale, html] of Object.entries(content) as [keyof Translated, string][]) {
      const clean = sanitizeArticleHtml(html);
      if (!isBlankHtml(clean)) body[locale] = clean;
    }
    if (data.status === 'published' && Object.keys(body).length === 0) {
      throw new FormError('مقاله بدون محتوا منتشر نمی‌شود. متن مقاله را بنویسید یا آن را پیش‌نویس ذخیره کنید.', { content: 'متن مقاله را دست‌کم به یک زبان بنویسید.' });
    }

    const existing = id ? await db.article.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
    if (id && !existing) throw new FormError('این مقاله پیدا نشد؛ شاید قبلاً حذف شده باشد.');

    // Empty: made from the English or Turkish title; with neither, "article-<id>" once the id is known
    let finalSlug = slug;
    const latin = slugify(data.title.en ?? data.title.tr ?? '');
    if (finalSlug) {
      const taken = await db.article.findFirst({ where: { slug: finalSlug, NOT: id ? { id } : undefined }, select: { id: true } });
      if (taken) throw new FormError('این نامک برای مقاله دیگری استفاده شده است.', { slug: 'این نامک تکراری است.' });
    } else if (latin) {
      finalSlug = await freeSlug(latin, id);
    } else {
      finalSlug = id ? await freeSlug(`article-${id}`, id) : `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    // Publishing without a time means now; a published article keeps the time it first went out
    const when = data.status === 'published' ? (publishedAt ?? existing?.publishedAt ?? new Date()) : publishedAt;
    const tags = await db.tag.findMany({ where: { id: { in: tagIds } }, select: { id: true } });
    const values = { ...data, slug: finalSlug, content: body, publishedAt: when };

    const saved = await db.$transaction(async (tx) => {
      let article = id ? await tx.article.update({ where: { id }, data: values }) : await tx.article.create({ data: { ...values, adminId: admin.id } });
      if (!id && !slug && !latin) {
        const numbered = `article-${article.id}`;
        const taken = await tx.article.findFirst({ where: { slug: numbered }, select: { id: true } });
        article = await tx.article.update({ where: { id: article.id }, data: { slug: taken ? `${numbered}-${Date.now().toString(36)}` : numbered } });
      }
      await tx.articleTag.deleteMany({ where: { articleId: article.id } });
      await tx.articleTag.createMany({ data: tags.map((tag) => ({ articleId: article.id, tagId: tag.id })) });
      return article;
    });

    const scheduled = saved.status === 'published' && saved.publishedAt && saved.publishedAt > new Date();
    const message =
      saved.status === 'draft' ? 'مقاله به‌صورت پیش‌نویس ذخیره شد.' : scheduled ? 'مقاله ذخیره شد و در زمان تعیین‌شده منتشر می‌شود.' : id ? 'تغییرات مقاله ذخیره شد.' : 'مقاله منتشر شد.';
    return { ok: true, message, data: { id: Number(saved.id), slug: saved.slug } };
  });
}

/** Publish or unpublish from the list. Publishing a draft that never had a time puts it out now. */
export async function setArticleStatus(id: number, status: (typeof ARTICLE_STATUSES)[number]) {
  return adminAction(z.object({ id: z.number().int().positive(), status: z.enum(ARTICLE_STATUSES) }), { id, status }, async (data) => {
    const article = await db.article.findUnique({ where: { id: data.id }, select: { content: true, publishedAt: true } });
    if (!article) throw new FormError('این مقاله پیدا نشد؛ شاید قبلاً حذف شده باشد.');
    if (data.status === 'published' && Object.keys(article.content ?? {}).length === 0) {
      throw new FormError('این مقاله هنوز متنی ندارد. ابتدا آن را ویرایش و متنش را بنویسید.');
    }
    await db.article.update({
      where: { id: data.id },
      data: { status: data.status, publishedAt: data.status === 'published' ? (article.publishedAt ?? new Date()) : article.publishedAt },
    });
    return { ok: true, message: data.status === 'published' ? 'مقاله منتشر شد.' : 'مقاله به پیش‌نویس برگشت و دیگر در سایت دیده نمی‌شود.' };
  });
}

export async function deleteArticle(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    await db.article.delete({ where: { id: data.id } });
    return { ok: true, message: 'مقاله حذف شد.' };
  });
}
