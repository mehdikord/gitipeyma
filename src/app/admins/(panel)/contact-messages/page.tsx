import type { Metadata } from 'next';
import { listContactMessages } from '../../../../modules/contactMessages/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { ContactMessagesView } from './ContactMessagesView';

export const metadata: Metadata = { title: 'پیام‌های تماس' };

export default async function ContactMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  return <ContactMessagesView list={await listContactMessages(await searchParams)} />;
}
