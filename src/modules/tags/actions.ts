'use server';

import { db } from '../../lib/db';
import { adminAction, idSchema } from '../../lib/actions';
import { textSearch } from '../../lib/search';
import { fa } from '../../i18n/translated';
import { quickTagSchema, TagInput, tagSchema } from './schema';

export async function saveTag(id: number | null, input: TagInput) {
  return adminAction(tagSchema, input, async (data) => {
    if (id) await db.tag.update({ where: { id }, data });
    else await db.tag.create({ data });
  });
}

export async function deleteTag(id: number) {
  return adminAction(idSchema, { id }, async (data) => {
    // The tag simply comes off the articles that had it (article_tag cascades)
    await db.tag.delete({ where: { id: data.id } });
    return { ok: true, message: 'برچسب حذف شد.' };
  });
}

/** Adds a tag by its Persian name from the article form, or returns the one that already has that name. */
export async function createQuickTag(name: string) {
  return adminAction(quickTagSchema, { name }, async (data) => {
    const existing = (await db.tag.findMany({ where: { OR: textSearch('name', data.name) }, select: { id: true, name: true } })).find(
      (tag) => fa(tag.name) === data.name,
    );
    const tag = existing ?? (await db.tag.create({ data: { name: { fa: data.name } }, select: { id: true, name: true } }));
    return { ok: true, message: existing ? 'این برچسب از قبل وجود داشت و انتخاب شد.' : 'برچسب ساخته شد.', data: { value: String(tag.id), label: fa(tag.name) } };
  });
}
