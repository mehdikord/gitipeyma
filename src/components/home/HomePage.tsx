import React from 'react';
import { Hero } from './Hero';
import { TrustSection } from './TrustSection';
import { ServicesHighlight } from './ServicesHighlight';
import { AboutStorySection } from './AboutStorySection';
import { AdvantagesSection } from './AdvantagesSection';
import { Support24Section } from './Support24Section';
import { TeamSection } from './TeamSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FinalCTA } from './FinalCTA';
import { LatestArticlesSection } from './LatestArticlesSection';
import { getLatestArticles } from '../../modules/site/articles';
import { getMetrics, getServiceGroups, getServices, getTeamMembers, getTestimonials, getTrustQuotes } from '../../modules/site/queries';

export async function HomePage() {
  const [services, groups, team, testimonials, metrics, quotes, articles] = await Promise.all([
    getServices(),
    getServiceGroups(),
    getTeamMembers(),
    getTestimonials(),
    getMetrics(),
    getTrustQuotes(),
    getLatestArticles(4),
  ]);

  return (
    <main>
      <Hero />
      <TrustSection />
      <ServicesHighlight services={services} lines={groups} />
      <AboutStorySection />
      <AdvantagesSection />
      <Support24Section />
      <TeamSection members={team} />
      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials}
          metrics={metrics}
          quotes={quotes}
          services={services.map(({ id, shortTitle }) => ({ id, shortTitle }))}
        />
      )}
      {articles.length > 0 && <LatestArticlesSection articles={articles} />}
      <FinalCTA />
    </main>
  );
}
