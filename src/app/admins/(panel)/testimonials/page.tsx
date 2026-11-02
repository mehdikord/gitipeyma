import type { Metadata } from 'next';
import { listTestimonials } from '../../../../modules/testimonials/queries';
import { categoryOptions } from '../../../../modules/services/queries';
import type { SearchParams } from '../../../../lib/pagination';
import { TestimonialsManager } from './TestimonialsManager';

export const metadata: Metadata = { title: 'نظرات مشتریان' };

export default async function TestimonialsPage({ searchParams }: { searchParams: SearchParams }) {
  const [list, categories] = await Promise.all([listTestimonials(await searchParams), categoryOptions()]);
  return <TestimonialsManager list={list} categories={categories} />;
}
