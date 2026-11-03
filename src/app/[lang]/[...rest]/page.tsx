import { notFound } from 'next/navigation';

// Any other path under a language renders that language's not-found page.
export default function Page() {
  notFound();
}
