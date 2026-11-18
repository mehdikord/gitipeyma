import type { Metadata } from 'next';
import { listTags } from '../../../../modules/tags/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { TagsManager } from './TagsManager';

export const metadata: Metadata = { title: 'برچسب‌ها' };

export default async function TagsPage({ searchParams }: { searchParams: SearchParams }) {
  return <TagsManager rows={await listTags(await searchParams)} />;
}
